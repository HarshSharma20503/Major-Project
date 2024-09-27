import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import logger from "./logger.js";

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.APP_PASSWORD,
  },
});

// Helper function to read and inject dynamic data into the HTML template
const generateMailHtml = (id: string): string => {
  // Read the HTML file template
  const filePath = path.join(
    path.resolve(),
    "./src/templates/emailConfirmation.template.html"
  );
  let emailHtml = fs.readFileSync(filePath, "utf-8");

  // Replace placeholder with dynamic data
  const verificationUrl = `http://localhost:8000/api/auth/confirmEmail/${id}`;
  emailHtml = emailHtml.replace("{{ verificationUrl }}", verificationUrl);

  return emailHtml;
};

// Function to send confirmation email
const sendConfirmationMail = async (to: string, id: string) => {
  logger.debug("Inside sendConfirmationMail function");
  try {
    // Generate HTML content with dynamic data
    const emailHtml = generateMailHtml(id);

    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: [to],
      subject: "Email Verification for Red Alert App",
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    logger.info("Verification email sent successfully");
    return true;
  } catch (error) {
    logger.error("Error sending verification email: ", error);
    return false;
  }
};

export { sendConfirmationMail };
