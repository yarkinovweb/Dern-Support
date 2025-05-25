import { getCurrentUser } from "../utils/getCurrentUser.js";
import { db } from "../utils/mongodb.js";
import { sendJson } from "../utils/response.js";

const users = db.collection("users");

export async function getAllUsers(req, res) {
  const current = await getCurrentUser(req, res);

  if (current.role === "manager") {
    const allUser = await users.find().toArray();
    return sendJson(res, 200, allUser);
  }
  else{
    return sendJson(res, 403,{error:"no permission"} )
  }
}
