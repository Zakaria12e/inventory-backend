import SystemSettings from "../models/SystemSettings.js"

/**
 * GET /api/system-settings
 */
export const getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne({ user: req.user.id })

    if (!settings) {
      const newSettings = await SystemSettings.create({
        user: req.user.id,
      })
      return res.json(newSettings)
    }

    res.json(settings)
  } catch (error) {
    res.status(500).json({ message: "Failed to load settings" })
  }
}

/**
 * PUT /api/system-settings
 */
export const updateSystemSettings = async (req, res) => {
  try {
    const { language, theme, dateFormat } = req.body

    const settings = await SystemSettings.findOneAndUpdate(
      { user: req.user.id },
      { language, theme, dateFormat },
      { new: true, upsert: true }
    )

    res.json(settings)
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings" })
  }
}
