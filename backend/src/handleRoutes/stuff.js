import { db } from "../utils/mongodb.js";
import { sendJson } from "../utils/response.js";
import { hashPassword } from "../utils/hash.js";
import { sendToEmail } from "../utils/sendToEmail.js";

const users = db.collection("users");

const rolesData = [
  { role: "manager", email: "manager@gmail.com", password: "manager", firstname: "Manager", lastname: "Manager" },
  { role: "master", email: "master@gmail.com", password: "master", firstname: "Manager", lastname: "Master" },
  { role: "user", email: "user@gmail.com", password: "user", firstname: "User", lastname: "User" },
];

export async function createRoles(req, res) {
  try {
    const createdUsers = [];

    for (const { role, email, password, firstname, lastname } of rolesData) {
      let user = await users.findOne({ email });

      if (!user) {
        const hashedPassword = await hashPassword(password);

        const newUser = {
          email,
          password: hashedPassword,
          firstname,
          lastname,
          role,
          createdAt: new Date(),
        };

        await users.insertOne(newUser);

        const subject = `${role.charAt(0).toUpperCase() + role.slice(1)} account created`;
        const text = `Dear ${firstname}, an account with ${role} has been created for you.\n\nLogin: ${email}\nPassword: ${password}`;

        await sendToEmail(email, subject, text);

        createdUsers.push(role);
      }
    }

    if (createdUsers.length === 0) {
      return sendJson(res, 200, { message: "All roles already exist." });
    }

    return sendJson(res, 201, { message: `The following roles have been created: ${createdUsers.join(", ")}` });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Server error" });
  }
}
