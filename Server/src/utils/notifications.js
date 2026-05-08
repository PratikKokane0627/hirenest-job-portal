import Notification from "../models/Notification.js";
import { notifyUser } from "../socket.js";

export async function createNotification(userId, payload) {
  const notification = await Notification.create({ user: userId, ...payload });
  notifyUser(userId.toString(), "notification:new", notification);
  return notification;
}
