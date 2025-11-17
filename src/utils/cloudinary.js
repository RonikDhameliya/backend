import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const uploadOnCloudinary = async function(localFilePath){
    try {
        if(!localFilePath) return null
        // console.log(localFilePath, "localFilePath  <----");
       const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type : 'auto'
      })
      // .then(res => console.log(res.url, "res from cloudinary"))
      // .catch(err => console.log(err, "err from cloudinary"))
      // console.log('file is uploaded on cloudinary', response.url);
      fs.unlinkSync(localFilePath)
      return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
  }

  const deleteOnCloudinary = async function(oldImagePath){
    try {
      if(!oldImagePath) return null;

      
      const parts = oldImagePath.split('/upload/');
      if (parts.length < 2) return null;
      const path = parts[1];   // Get the path after upload/
      const withoutVersion = path.replace(/^v\d+\//, '');   // Remove version if present (starts with 'v' + digits)
      const publicId = withoutVersion.replace(/\.[^/.]+$/, '');  // Remove file extension


      const response = await cloudinary.uploader.destroy(publicId)
      // console.log(response);
      return response;
    } catch (error) {
      console.log('error : while destoring on Cloudinary ');
    }
  }
export {uploadOnCloudinary, deleteOnCloudinary};