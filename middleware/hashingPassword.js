const bcrypt=require("bcrypt");
const asyncHandler = require("express-async-handler");


const hashingPassword=asyncHandler(async (password)=>
{
  const hashedPassword=await bcrypt.hash(password);
  return hashedPassword;
}
)

module.exports={hashingPassword};