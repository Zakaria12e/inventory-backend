import Item from "../models/Item.js";
import Categorie from "../models/Categorie.js";
import Alert from "../models/Alert.js";
import Activity from "../models/Activity.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// GET /api/dashboard
export const getDashboard = asyncHandler(async (req, res) => {
  try {
    // Fetch all items and categories
    const items = await Item.find().populate("category", "name");
    const categories = await Categorie.find();
    
    // Low stock items
    const lowStockCount = items.filter(item => item.quantity < item.lowStockThreshold).length;

    // Total stock quantity
    const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);

    // Stock per category
    const chartData = categories.map(cat => ({
      name: cat.name,
      stock: items
        .filter(item => item.category && item.category._id.toString() === cat._id.toString())
        .reduce((sum, item) => sum + item.quantity, 0)
    }));

    // Recent activity (last 5)
    const recentActivities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(5)
      .populate("user", "first_name last_name role");

    // Active alerts (last 5)
    const alerts = await Alert.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      items,
      categories,
      lowStockCount,
      totalStock,
      chartData,
      recentActivities,
      alerts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});