import Message from "../models/Message.js";
import { createNotification } from "../utils/notifications.js";

export async function getMessages(req, res, next) {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
      .populate("sender receiver", "name role")
      .sort("createdAt");

    res.json(messages);
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const message = await Message.create({
      sender: req.user._id,
      receiver: req.body.receiver,
      body: req.body.body
    });

    await createNotification(req.body.receiver, {
      title: "New message",
      body: `${req.user.name} sent you a message`,
      type: "message"
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

export async function markMessageRead(req, res, next) {
  try {
    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, receiver: req.user._id },
      { readAt: new Date() },
      { new: true }
    ).populate("sender receiver", "name role email");

    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json(message);
  } catch (error) {
    next(error);
  }
}
