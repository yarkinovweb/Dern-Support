import { db } from "../utils/mongodb.js";
import { handleRequest } from "../utils/handleRequest.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { createToken } from "../utils/jwt.js";
import { sendJson } from "../utils/response.js";

const users = db.collection("users");

export async function register(req, res) {
  try {
    const { email, password, firstName, lastName } = await handleRequest(req);

    if (!email || !password || !firstName || !lastName)
      return sendJson(res, 400, { error: "All fields must be filled in." });

    if (await users.findOne({ email }))
      return sendJson(res, 409, { error: "Already available email" });

    const hashedPassword = await hashPassword(password);
    const result = await users.insertOne({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: "user",
      createdAt: new Date(),
    });

    const token = createToken({ id: result.insertedId });

    sendJson(res, 201, {
      message: "User registered successfully",
      userId: result.insertedId,
    }, token);
  } catch (err) {
    sendJson(res, 500, { error: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = await handleRequest(req);

    if (!email || !password)
      return sendJson(res, 400, { error: "Email and password required" });

    const user = await users.findOne({ email });
    if (!user)
      return sendJson(res, 401, { error: "Invalid email or password" });

    const match = await comparePassword(password, user.password);
    if (!match)
      return sendJson(res, 401, { error: "Invalid email or password" });

    const token = createToken({ id: user._id });

    sendJson(res, 200, {
      message: "Successfully logIn",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
    }, token);
  } catch (err) {
    sendJson(res, 500, { error: "Server Error" });
  }
}

export function logout(req, res) {
  res.writeHead(200, {
    'Set-Cookie': `token=; HttpOnly; Path=/; Max-Age=0`, 
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({ message: "Logged out successfully" }));
}