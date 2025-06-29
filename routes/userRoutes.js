const express = require("express");
const User = require("../models/user");
const logger = require("../logger");
const { getDates } = require("date-range-handler");
const router = express.Router();

// Get all users
router.get("/get/all", async (req, res) => {
  try {
    const users = await User.find();
    logger.info("Fetched all users");
    res.json(users);
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).send("Server error");
  }
});

// Add a new user
router.post("/sigup", async (req, res) => {
  try {
    const result = getDates({}); // Returns the current FY
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    logger.error("Error creating user:", error);
    res.status(400).send("Invalid user data");
  }
});

module.exports = router;
