import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";
import dotenv from "dotenv";
dotenv.config();

const getResumeUrl = async (key) => {
  // ✅ accept key as a parameter
    try {
        if (!key) {
        throw new Error("S3 object key is required");
        }

        const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key, // ✅ use the argument passed from controller
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // ⏰ valid for 1 hour
        return signedUrl;
    } catch (error) {
        console.error("Error generating signed URL:", error.message);
        return null;
    }
};

export default getResumeUrl;
