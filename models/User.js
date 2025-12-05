import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
  },
  password: { 
    type: String, 
    required: true,
    select: false, // hide password by default
  },
  role: {
    type: String,
    enum: ["employe", "admin", "superadmin"],
    required: true,
    default: "employe",
  },
  phone: {
    type: String,
    default: "",
  },

  bio: {
    type: String,
    default: "",
  },

  is_active: {
    type: Boolean,
    default: true,
  },
  avatarColor: {
  type: String,
  default: function () {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
},
  profile_image: {
    type: String,
  },
}, { timestamps: true });

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Add matchPassword method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
