import connectDB from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import User from "@/models/User";
import { verifyPassword } from "@/utils/auth";

async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: "failed", message: "Error in connecting to DB" });
  }
  const session = await getServerSession(req, res, authOptions);
  console.log("SESSION:", session);
  if (!session) {
    return res
      .status(401)
      .json({ status: "Failed", message: "You are Not Logged In!" });
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return res
      .status(404)
      .json({ status: "Failed", message: "User doesn't exsit!" });
  }
  if (req.method === "POST") {
    const { name, lastName, password } = req.body;
    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return res
        .status(422)
        .json({ status: "Failed", message: "password is incorrect!" });
    }
    user.name = name;
    user.lastName = lastName;
    user.save();
    res.status(200).json({
      status: "success",
      data: { name, lastName, email: session.user.email },
    });
  } else if (req.method === "GET") {
    res.status(200).json({
      status: "success",
      data: { name: user.name, lastName: user.lastName, email: user.email },
    });
  } else if (req.method === "PATCH") {
    const data = req.body;
    if (!data) {
      return res
        .status(422)
        .json({ status: "Failed", message: "Invalid Data!" });
    }
    user.name = data.name;
    user.lastName = data.lastName;
    user.save();
    res.status(200).json({
      status: "success",
      data: { name: user.name, lastName: user.lastName, email: user.email },
    });
  }
}
export default handler;
