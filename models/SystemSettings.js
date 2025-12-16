import mongoose from "mongoose"

const systemSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    language: {
      type: String,
      enum: ["en", "fr", "es"],
      default: "en",
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    dateFormat: {
      type: String,
      default: "MM/DD/YYYY",
    },
  },
  { timestamps: true }
)

export default mongoose.model("SystemSettings", systemSettingsSchema)
