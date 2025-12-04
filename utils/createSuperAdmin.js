// utils/createSuperAdmin.js
import bcrypt from "bcrypt";
import User from "../models/User.js";

const createSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({ role: "superadmin" });

    if (!existingSuperAdmin) {
      const email = "s@s.com";
      const password = "SuperAdmin123!";
      
      await User.create({
        first_name: "System",
        last_name: "SAdmin",
        email,
        password,
        role: "superadmin",
      });

      console.log("👑 Super Admin created");
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
    } else {
      console.log("👑 Super Admin already exists");
    }
  } catch (err) {
    console.error("Super Admin creation error:", err);
  }
};

export default createSuperAdmin;
