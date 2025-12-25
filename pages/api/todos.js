import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import sortTodos from "@/utils/sortTodos";

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
    const { title, status } = req.body;
    if (!title || !status) {
      return res
        .status(422)
        .json({ status: "Failed", message: "Invalid data!" });
    }
    user.todos.push({ title, status });
    user.save();
    res.status(201).json({ status: "success", message: "Todo Created!" });
  } else if (req.method === "GET") {
    console.log(user.todos);
    const sortedData = sortTodos(user.todos);

    res.status(200).json({ status: "success", data: { todos: sortedData } });
  } else if (req.method === "PATCH") {
    const { id, status } = req.body;
    if (!id || !status) {
      return res
        .status(422)
        .json({ status: "Failed", message: "Invalid Data!" });
    }
    const result = await User.updateOne(
      { "todos._id": id },
      { $set: { "todos.$.status": status } }
    );
    console.log(result);
    res.status(200).json({ status: "success" });
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) {
      return res
        .status(422)
        .json({ status: "Failed", message: "Invalid Data!" });
    }
    try {
      await User.updateOne(
        { "todos._id": id },
        { $pull: { todos: { _id: id } } }
      );
      res.status(200).json({ status: "success", message: "Data deleted" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "Failed", message: "Error in Deleting Data from DB" });
    }
  }
}
export default handler;
