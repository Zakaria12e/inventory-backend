import Alert from "../models/Alert.js";

// GET all alerts
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE alert
export const createAlert = async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// mark alert as seen
export const markAlertSeen = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { seen: true },
      { new: true } // return the updated document
    );
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json({ success: true, data: alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// clear all seen alerts
export const clearAlerts = async (req, res) => {
  try {
    await Alert.deleteMany({ seen: true });
    res.json({ message: "Alerts cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
