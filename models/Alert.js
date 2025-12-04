import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    productId: {                     // Reference to the Item
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    productName: { type: String, required: true },
    message: { type: String, required: true },
    quantityAtCreation: {            // Store the quantity when alert was created
      type: Number,
      required: true,
    },
    isActive: { type: Boolean, default: true },   // Alert still valid or solved
    seen: { type: Boolean, default: false },      // User has read it or not
  },
  { timestamps: true }
);

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;
