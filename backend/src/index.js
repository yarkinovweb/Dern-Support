import http from "http";
import { connect } from "./utils/mongodb.js";
import { createRoles } from "./handleRoutes/stuff.js";
import { login, register, logout } from "./handleRoutes/auth.js";
import {
  createServiceRequest,
  sendToMaster,
  updateService,
  getAllServices,
  markAsInprogres,
} from "./handleRoutes/service.js";
import {
  createComponent,
  getAllComponents,
} from "./handleRoutes/components.js";
import { getCurrentUser } from "./utils/getCurrentUser.js";
import { sendJson } from "./utils/response.js";
import { getAllUsers } from "./handleRoutes/users.js";

const server = http.createServer(async (req, res) => {
  const { url, method } = req;
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3002");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "http://localhost:3002",
      "Access-Control-Allow-Methods": "GET, POST,PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (url === "/api/auth/register" && method === "POST") {
    register(req, res);
  } else if (url === "/api/auth/login" && method === "POST") {
    login(req, res);
  } else if (url === "/api/auth/logout" && method === "POST") {
    logout(req, res);
  } else if (url === "/api/auth/current-user" && method === "GET") {
    const user = await getCurrentUser(req, res);
    if (!user) {
      sendJson(res, 401, { error: "Unauthorized" });
      return;
    }
    const { password, ...userWithoutPassword } = user;

    return sendJson(res, 200, userWithoutPassword);
  } else if (url === "/api/service/create" && method === "POST") {
    createServiceRequest(req, res);
  } else if (url === "/api/users" && method === "GET") {
    getAllUsers(req, res);
  } else if (url === "//apistuff/create") {
    createRoles(req, res);
  } else if (url.startsWith("/api/service/send") && method === "POST") {
    const parts = url.split("/");
    const serviceId = parts[4];
    if (!serviceId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "ID not found" }));
    }
    sendToMaster(req, res, serviceId);
  } else if (url === "/api/service-request" && method === "GET") {
    console.log("object");
    getAllServices(req, res);
  } else if (url === "/api/service-request/update" && method === "PUT") {
    updateService(req, res);
  } else if (url.startsWith("/api/service-request/set-status") && method === "PUT") {
    const parts = url.split("/");
    const serviceId = parts[4];
    markAsInprogres(req, res, serviceId);
  } else if (url === "/api/components" && method === "POST") {
    createComponent(req, res);
  } else if (url === "/api/components" && method === "GET") {
    getAllComponents(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

connect().then(() => {
  server.listen(8002, () => {
    console.log("Server running on", );
  });
});
