import { ICloudinaryResponse, IFile } from './../app/interfaces/file';
import multer from "multer";
import path from "path";
import fs from 'fs';

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dr4tvtzda",
  api_key: "993492718988977",
  api_secret: "uysc2wfEkSOJqfbHw9o6WBl5bBk",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: IFile):Promise<ICloudinaryResponse | undefined> => {

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
     
      (error:Error, result:ICloudinaryResponse) => {
        fs.unlinkSync(file.path)
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};




export const fileUpLoader = {
  upload,
  uploadToCloudinary,
};
