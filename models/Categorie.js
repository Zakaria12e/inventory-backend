import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    itemsCount: { type: Number, default: 0 },
    icon: { type: String, default: "Box" },
    iconColor: { type: String, default: "#000000" }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
