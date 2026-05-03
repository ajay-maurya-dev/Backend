import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    const uploadOnCloudinary = async (filePath) => {
        try {
            if (!filePath) {
                throw new Error('File path is required');
            }
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'my_folder',
                resource_type: 'auto'  
            });
            console.log('Upload successful:', result.url);
            return result;
        } catch (error) {
            fs.unlinkSync(filePath); // Clean up local file
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    };
        
})();