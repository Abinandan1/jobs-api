const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Please provide name`],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, `Please provide email`],
    minlength: 3,
    maxlength: 50,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true, //creates unique index
  },
  password: {
    type: String,
    required: [true, `Please provide password`],
    minlength: 6,
  },
});
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};
UserSchema.methods.comparePasswords = async function (password) {
  const passwordMatcher = await bcrypt.compare(password, this.password);
  return passwordMatcher;
};
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose.model("User", UserSchema);
