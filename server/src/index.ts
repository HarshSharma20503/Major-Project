import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";
// import { GetLatestNews } from "./scripts/GetNews";

dotenv.config();

const port: number = Number(process.env.PORT) || 8000;

import { sendNotification } from "./utils/SendNotification.js";

app.get("/", (req, res) => {
  res.send("Welcome to the backend");
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(port, async () => {
      console.log(`Server listening on port ${port}`);
      // await GetLatestNews();
      // sendNotification(
      //   "fBLBQHRJO7p6xY3sZ8-W2k:APA91bEfE1dcwVQX-SJ1QPlVdQ5sv8Aoih3PV1rh1TN7SlL5_Ut9-pp3nur1kPz5ElqI9ne_N1f3hz2OyEcw9VkxLBTc3O21jyvZxgP_zsnKUNEyo9iNLglu9lR4325mFk9-TyQlljRg",
      //   {
      //     _id: "unique-id-123",
      //     title: "Test1",
      //     body: "This is the body of the Test1",
      //   }
      // );
    });
  })
  .catch((err: Error) => {
    console.log(err.message);
  });
