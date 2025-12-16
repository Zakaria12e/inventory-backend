import express from "express"
import {
  getSystemSettings,
  updateSystemSettings,
} from "../controllers/systemSettingsController.js"
import { protect } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", protect, getSystemSettings)
router.put("/", protect, updateSystemSettings)

export default router
