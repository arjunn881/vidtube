import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw ApiError(400, "All fiels are requird!");
  }
});

const existingUser = await User.findOne({
  $or :[{username}, {email}]
})

if(existingUser){
  throw ApiError(409, "User with eail or username already existed!")
}

const avatarLocalPath = req.files?.avatar[0]?.path
const coverLocalPath = req.files?.coverImage[0]?.path

if(!avatarLocalPath){
  throw ApiError (400, "Avatar file is missing!");
}

const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage = await uploadOnCloudinary(coverLocalPath);



export { registerUser };
