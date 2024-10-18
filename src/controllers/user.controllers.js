import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req, res) => {
  const { fullname, email, username, password } = req.body;


  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw ApiError(400, "All fiels are requird!");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });


  if (existingUser) {
    throw new ApiError(409, "User with email or username already existed!");
  }

  // console.warn("files :",req.files);

  console.log(req.body);

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  console.log("avatarLocalPath : ", avatarLocalPath);
  console.log("coverLocalPath : ", coverLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing!");
  }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);

  // let coverImage = "";

  // if (coverLocalPath) {
  //   coverImage = await uploadOnCloudinary(coverImage);
  // }

  let avatar;

  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Uploaded avatar from usercontroller : ", avatar);
    
  } catch (error) {
    console.log("error in uploading avatar", error);
    throw new ApiError(500, "failed to upload avatar!");
  }

  let coverImage;

  try {
    coverImage = await uploadOnCloudinary(coverLocalPath);
    console.log("Uploaded coverImage : ", coverImage);
  } catch (error) {
    console.log("error in uploading coverImage", error);
    throw new ApiError(500, "failed to upload coverImage!");
  }

  try {
    const user = await User.create({
      fullname,
      avatar: avatar?.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "something went wrong while registering a user");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
  } catch (error) {
    console.log("User creation is failed");

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }

    throw new ApiError(500, "something went wrong while registering a user and images were deleted!");
  }
});

export { registerUser };
