import multer from 'multer';
import { ServerError } from '../error.mjs';

// Memory storage (keeps files in RAM as Buffer)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
  } else {
    callback(new Error("Only image files are allowed"), false);
  }
};

const uploadConfig = {
  storage,
  limits: {
    fileSize: 0.5 * 1024 * 1024,
    files: 1
  },
  fileFilter
};

const upload = multer(uploadConfig);

// const singleImageUploadMiddleware = (fieldName) => {
//   return async (req,res,next)=>{
//     const multerMiddlewareFunction = upload.single(fieldName)
//     multerMiddlewareFunction(req,res,next)
//   }
// };
const singleImageUploadMiddleware = (fieldName) => {
  return async (req, res, next) => {
    const multerMiddlewareFunction = upload.single(fieldName)
    multerMiddlewareFunction(req, null, (err) => {
      if (err) {
        return next(new ServerError(400, err.message))
      }
      if (!req.file) {
        return next(new ServerError(404, "File must be supplied!!!"))
      }
      next()
    })
  }
};

export { singleImageUploadMiddleware }
