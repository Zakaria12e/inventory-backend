import Item from "../models/Item.js";
import Category from "../models/Categorie.js";
import Alert from "../models/Alert.js";
import Activity from "../models/Activity.js";

export const getDashboardStats = async (req, res) => {
  try {
    /* ===============================
       KPIs
    =============================== */

    const totalItems = await Item.countDocuments();

    const totalQuantityAgg = await Item.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);

    const totalQuantity = totalQuantityAgg[0]?.total || 0;

    const lowStockCount = await Item.countDocuments({
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] },
    });

    const activeAlertsCount = await Alert.countDocuments({
      isActive: true,
    });

    /* ===============================
       STOCK BY CATEGORY (Chart)
    =============================== */

    const stockByCategory = await Item.aggregate([
      {
        $group: {
          _id: "$category",
          stock: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          category: "$category.name",
          stock: 1,
          icon: "$category.icon",
          iconColor: "$category.iconColor",
        },
      },
      { $sort: { stock: -1 } },
    ]);

    /* ===============================
       LOW STOCK ITEMS
    =============================== */

    const lowStockItems = await Item.find({
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] },
    })
      .populate("category", "name")
      .select("name quantity lowStockThreshold")
      .limit(5)
      .lean();

    /* ===============================
       LATEST ALERTS
    =============================== */

    const alerts = await Alert.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("message productName quantityAtCreation seen createdAt")
      .lean();

    /* ===============================
       RECENT ACTIVITIES
    =============================== */

    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(5)
      .populate("user", "first_name profile_image avatarColor")
      .lean();

    /* ===============================
       FINAL RESPONSE
    =============================== */

    res.json({
      stats: {
        totalItems,
        totalQuantity,
        lowStockCount,
        activeAlertsCount,
      },
      charts: {
        stockByCategory,
      },
      panels: {
        lowStockItems,
        alerts,
        activities,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
