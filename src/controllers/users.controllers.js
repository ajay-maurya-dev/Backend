import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.config.js";
import { use } from "react";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //first we will get the data from the request body
  //validate the data (you can add more validation as needed)
  //alresdy we have a middleware to validate the data, so we can skip this step here
  //check for image file
  //upload the image to cloudinary and get the URL
  //remove the password from the response
  //check for user creation in the database
  //return the response to the client
  const { fullname, username, email, password } = req.body;//log the email to check if it is being received correctly from the request body
  console.log(email);

  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }//validate password length

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }//validate email format using a simple regex pattern, but you can use a more robust validation method if needed

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }//check if a user with the same email or username already exists in the database, and if so, we will throw an error to prevent duplicate users in the database

  const userExists = await User.findOne({ $or: [{ email }, { username }] });//check if a user with the same email or username already exists in the database, and if so, we will throw an error to prevent duplicate users in the database

  //if a user with the same email or username already exists, we will throw an error to prevent duplicate users in the database
  if (userExists) {
    throw new ApiError(409, "User with email or username already exists");
  }

  //check for image file
  const avatar = req.files?.avatar ? req.files.avatar[0].path : null;

  //cover image is optional, so we will not throw an error if it is not provided, but we can log a warning and continue with the user creation
  const coverImage = req.files?.coverImage
    ? req.files.coverImage[0].path
    : null;

  //after validating the data, we can create the user in the database, but we will not include the avatar and cover image URLs in the user document until we have uploaded them to cloudinary and updated the user document with the cloudinary URLs
  const user = await User.create({
    ...req.body,
    avatar,
    coverImage,
  });

  //after creating the user, we can check if the user is created successfully and then return the response to the client, but we will not include the avatar and cover image URLs in the response until we have uploaded them to cloudinary and updated the user document with the cloudinary URLs
  if (!user) {
    throw new ApiError(500, "Failed to create user");
  }

  //remove the password from the response
  const userResponse = user.toObject();//convert the Mongoose document to a plain JavaScript object
  delete userResponse.password;//delete userResponse.refreshToken;

  //after creating the user, we can return the response to the client, but we will not include the avatar and cover image URLs in the response until we have uploaded them to cloudinary and updated the user document with the cloudinary URLs
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { message: "User registered successfully", user: userResponse },
        "User registered successfully"
      )
    );

    //after creating the user, we can upload the images to cloudinary and get the URLs
  const avatarUrl = await uploadOnCloudinary(avatar)
    .then((result) => {
      console.log("Avatar uploaded to Cloudinary:", result.url);
      return result.url;
    })
    .catch((error) => {
      console.error("Error uploading avatar to Cloudinary:", error);
      throw error;
    });

    //cover image is optional, so we will not throw an error if it fails to upload, but we can log the error and continue with the user creation
  const coverImageUrl = await uploadOnCloudinary(coverImage)
    .then((result) => {
      console.log("Cover image uploaded to Cloudinary:", result.url);
      return result.url;
    })
    .catch((error) => {
      console.error("Error uploading cover image to Cloudinary:", error);
      throw error;
    });

    //after uploading the images to cloudinary, we can check if the URLs are valid and then update the user document with the cloudinary URLs
  if (!avatarUrl) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary");
  }

  //cover image is optional, so we will not throw an error if it fails to upload, but we can log the error and continue with the user creation
  if (!coverImageUrl) {
    throw new ApiError(500, "Failed to upload cover image to Cloudinary");
  }

  //after uploading the images to cloudinary, we can update the user document with the cloudinary URLs
  const createdUser = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatarUrl.url,
    coverImage: coverImageUrl?.url || "",
  })
    .then((createdUser) => {
      if (!createdUser) {
        throw new ApiError(500, "Failed to create user with Cloudinary URLs");
      }
      console.log(
        "User created successfully with Cloudinary URLs:",
        createdUser
      );
    })
    .catch((error) => {
      console.error("Error creating user with Cloudinary URLs:", error);
      throw error;
    });

    //after creating the user with the cloudinary URLs, we can return the response to the client
  const updatedUser = await createdUser
    .findById(user._id)
    .select("-password -refreshToken")
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new ApiError(500, "Failed to retrieve updated user");
      }
      console.log("Updated user retrieved successfully:", updatedUser);
      res
        .status(201)
        .json(
          new ApiResponse(
            201,
            { message: "User registered successfully", user: updatedUser },
            "User registered successfully"
          )
        );
    })
    .catch((error) => {
      console.error("Error retrieving updated user:", error);
      throw error;
    });
});

//after all the operations are successful, we can return the response to the client
return res
  .status(201)
  .json(
    new ApiResponse(
      201,
      { message: "User registered successfully", user: userResponse },
      "User registered successfully"
    )
  );

export { registerUser };
