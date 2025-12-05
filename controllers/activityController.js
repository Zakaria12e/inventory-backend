import Activity from "../models/Activity.js";

// GET /activities
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .populate("user", "first_name profile_image role avatarColor email");

    res.json({ success: true, data: activities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// POST /activities
export const addActivity = async (req, res) => {
  try {
    const { user, action, role } = req.body;
    if (!user || !action || !role) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const activity = new Activity({ user, action, role });
    await activity.save();

    res.json({ success: true, data: activity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
