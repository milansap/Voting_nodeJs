const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, match: /.+\@.+\..+/ },
    mobile_number: { type: String, required: true },
    address: { type: String },
    citizenship_no: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["voter", "admin"],
      default: "voter",
    },
    isVoted: { type: Boolean, default: false },
    votedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Events",
      },
    ],
    assignedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Events",
      },
    ],
    image: {
      type: String,
      default: "/uploads/profile/default.png",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(user.password, salt);

    user.password = hashPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
