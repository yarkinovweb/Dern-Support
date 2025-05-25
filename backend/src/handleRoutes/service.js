import { db } from "../utils/mongodb.js";
import { ObjectId } from "mongodb";
import { hashPassword } from "../utils/hash.js";
import { sendJson } from "../utils/response.js";
import { sendToEmail } from "../utils/sendToEmail.js";
import { handleRequest } from "../utils/handleRequest.js";
import { getCurrentUser } from "../utils/getCurrentUser.js";

const users = db.collection("users");
const services = db.collection("services");
const componentsCollection = db.collection("components");

export async function createServiceRequest(req, res) {
  try {
    const body = await handleRequest(req);
    const {
      device_model,
      issue_type,
      problem_area,
      description,
      location,
      email,
      fullName,
    } = body;

    if (
      !device_model ||
      !issue_type ||
      !problem_area ||
      !description ||
      !location
    ) {
      return sendJson(res, 400, {
        error: "All required fields must be filled in.",
      });
    }

    let owner = null;

    if (email && fullName) {
      owner = await users.findOne({ email });

      if (!owner) {
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await hashPassword(randomPassword);

        const firstname = fullName.split(" ")[0] || fullName;
        const lastname = fullName.split(" ")[1] || "";

        const newUser = {
          email,
          password: hashedPassword,
          firstname,
          lastname,
          role: "user",
          createdAt: new Date(),
        };

        const result = await users.insertOne(newUser);
        owner = { _id: result.insertedId, ...newUser };

        const subject = "Your account has been created";
        const text = `Dear ${firstname}, account has been created for you..\n\nLogin: ${email}\nPassword: ${randomPassword}`;
        await sendToEmail(email, subject, text);
      }
    } else {
      owner = await getCurrentUser(req);
    }

    if (!owner) {
      return sendJson(res, 401, { error: "User not found" });
    }

    const { password, ...ownerData } = owner;

    const newServiceRequest = {
      device_model,
      issue_type,
      problem_area,
      description,
      location,
      owner: ownerData,
      createdAt: new Date(),
      status: "pending",
    };

    const result = await services.insertOne(newServiceRequest);

    return sendJson(res, 201, {
      message: "Request was successfully created.",
      serviceId: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Server error" });
  }
}

export async function sendToMaster(req, res, serviceId) {
  try {
    const user = await getCurrentUser(req);
    if (!user || user.role !== "manager") {
      return sendJson(res, 403, {
        error: "Only a manager can perform this action.",
      });
    }

    if (!ObjectId.isValid(serviceId)) {
      return sendJson(res, 400, { error: "Invalid servisId format" });
    }

    const serviceRequest = await services.findOne({
      _id: new ObjectId(serviceId),
    });
    if (!serviceRequest) {
      return sendJson(res, 404, { error: "Request not found" });
    }

    const master = await users.findOne({ role: "master" });
    if (!master) {
      return sendJson(res, 404, { error: "Master not found" });
    }

    const { password, ...masterData } = master;

    const updateResult = await services.updateOne(
      { _id: new ObjectId(serviceId) },
      {
        $set: {
          master: masterData,
          status: "in_review",
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return sendJson(res, 500, { error: "Could not update query." });
    }

    return sendJson(res, 200, { message: "Request sent to master" });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Server error" });
  }
}

export async function updateService(req, res) {
  try {
    const user = await getCurrentUser(req);
    if (!user || user.role !== "master") {
      return sendJson(res, 403, {
        error: "Only the master can perform this action.",
      });
    }

    const body = await handleRequest(req);
    const { price, finishedAt, components, requestId } = body;

    if (
      price === undefined ||
      !finishedAt ||
      !components ||
      !Array.isArray(components) ||
      components.length === 0
    ) {
      return sendJson(res, 400, {
        error: "Price, expiration date, and components are required.",
      });
    }

    if (!ObjectId.isValid(requestId)) {
      return sendJson(res, 400, { error: "Invalid requestId format" });
    }

    const serviceRequest = await services.findOne({
      _id: new ObjectId(requestId),
    });
    if (!serviceRequest) {
      return sendJson(res, 404, { error: "Service request not found" });
    }

    const usedProducts = [];
    const updatedProducts = [];

    for (const comp of components) {
      const { componentId, quantity } = comp;

      if (!componentId || !ObjectId.isValid(componentId)) {
        return sendJson(res, 400, {
          error: `Invalid componentId: ${componentId}`,
        });
      }

      const component = await componentsCollection.findOne({
        _id: new ObjectId(componentId),
      });
      if (!component) {
        return sendJson(res, 404, {
          error: `Component not found: ${componentId}`,
        });
      }

      const usedQty = quantity && quantity > 0 ? quantity : 1;

      if (component.quantity < usedQty) {
        return sendJson(res, 400, {
          error: `Not enough resources for component "${component.name}". Available: ${component.quantity}, Requested: ${usedQty}`,
        });
      }

      await componentsCollection.updateOne(
        { _id: new ObjectId(componentId) },
        { $inc: { quantity: -usedQty } }
      );

      usedProducts.push({
        _id: new ObjectId(componentId),
        quantity: usedQty,
      });

      updatedProducts.push({
        componentId: component._id,
        name: component.name,
        price: component.price,
        usedQuantity: usedQty,
      });
    }

    const updateData = {
      price,
      finishedAt: new Date(finishedAt),
      usedProducts,
      updatedProducts,
      status: "approved",
      updatedAt: new Date(),
    };

    const result = await services.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return sendJson(res, 500, {
        error: "An error occurred while updating the service request.",
      });
    }

    return sendJson(res, 200, {
      message: "Service request successfully updated",
    });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Server error" });
  }
}

export async function getAllServices(req, res) {
  try {
    const user = await getCurrentUser(req);
    let db_requests = [];
    if (user && user.role === "master") {
      db_requests = await services.find({ "master._id": user._id }).toArray();
    } else if (user.role === "user") {
      db_requests = await services.find({ "owner._id": user._id }).toArray();
    } else if (user.role === "manager") {
      db_requests = await services.find({}).toArray();
    }
    return sendJson(res, 200, db_requests);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Server error" });
  }
}

export async function markAsInprogres(req, res, requestId) {
  try {
    const data = await handleRequest(req);

    if (!ObjectId.isValid(requestId)) {
      return sendJson(res, 400, { error: "Invalid servidId format" });
    }

    const serviceRequest = await services.findOne({
      _id: new ObjectId(requestId),
    });

    if (!serviceRequest) {
      return sendJson(res, 404, { error: "Request not found" });
    }

    await services.updateOne(
      { _id: new ObjectId(requestId) },
      {
        $set: { status: data.status, updatedAt: new Date() },
      }
    );

    return sendJson(res, 200, { message: "updated" });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Server error" });
  }
}
