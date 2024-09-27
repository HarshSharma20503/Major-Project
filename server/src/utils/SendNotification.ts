import { admin } from "../config/firebase.js";
import { Notification } from "../types.js";
import logger from "./logger.js";

export const sendNotification = async (
  token: string,
  notification: Notification
) => {
  logger.debug("Inside the sendNotification function");

  admin
    .messaging()
    .send({
      token,
      notification: {
        title: notification.title,
        body: notification.body,
      },
    })
    .then((response) => {
      logger.debug("Successfully sent message:", response);
    })
    .catch((error) => {
      logger.error("Error sending message:", error);
    });
};
