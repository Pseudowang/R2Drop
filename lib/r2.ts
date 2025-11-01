import { S3Client } from "@aws-sdk/client-s3";

//1. 从环境变量中获取R2 的凭证
// const R2_ACCOUNT_ID = process.env.R2_ACCESS_KEY_ID;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

// 2. 验证环境变量是否存在
