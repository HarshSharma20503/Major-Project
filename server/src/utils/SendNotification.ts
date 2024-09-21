import { admin } from "../config/firebase.js";
import { Notification } from "../types.js";

export const sendNotification = async (
  token: string,
  notification: Notification
) => {
  console.log("******** Inside the sendNotification function ********");
  console.log("token", token);
  console.log("Notification", notification);

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
      console.log("Multicast notification sent:", response);
    })
    .catch((error) => {
      console.error("Error sending multicast notification:", error);
    });
};
