const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const mime = require("mime");
const multerS3 = require("multer-s3");
const S3 = require("aws-sdk/clients/s3");

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET,
  acl: "public-read",
  key: (req, file, done) => {
    const fileExtension = ".jpg";
    const key = `${uuidv4() + Date.now()}${fileExtension}`;
    done(null, key);
  },
  contentType: (req, file, done) => {
    const contentType = mime.getType(file.mimetype);
    done(null, contentType);
  },
});

const uploadsMiddleware = multer({ storage: storage }).single("image");

module.exports = uploadsMiddleware;
