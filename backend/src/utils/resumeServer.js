import express from 'express'
import multer from 'multer'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';



const app = express();
app.use(cors());
app.use(express.json());

