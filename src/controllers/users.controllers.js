import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  // Validation
  if ([fullname, username, email, password].some(f => f?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Check existing user
  const userExists = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (userExists) {
    throw new ApiError(409, "User already exists");
  }

  // Files
  const avatarPath = req.files?.avatar?.[0]?.path;
  const coverPath = req.files?.coverImage?.[0]?.path;

  if (!avatarPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // Upload images FIRST
  const avatarUpload = await uploadOnCloudinary(avatarPath);
  const coverUpload = coverPath
    ? await uploadOnCloudinary(coverPath)
    : null;

  if (!avatarUpload) {
    throw new ApiError(500, "Avatar upload failed");
  }

  // Create user ONCE
  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatarUpload.url,
    coverImage: coverUpload?.url || ""
  });

  // Remove sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Send ONE response
  return res.status(201).json(
    new ApiResponse(
      201,
      createdUser,
      "User registered successfully"
    )
  );
});

export { registerUser };