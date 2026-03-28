const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const User = require('../model/user');

// Create default admin (one-time setup, call POST /users/create-admin)
router.post('/create-admin', asyncHandler(async (req, res) => {
    try {
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.json({ success: false, message: "Admin user already exists." });
        }
        const admin = new User({
            name: req.body.name || 'admin',
            password: req.body.password || 'admin123',
            role: 'admin'
        });
        await admin.save();
        res.json({ success: true, message: "Admin user created successfully.", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get all users
router.get('/', asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, message: "Users retrieved successfully.", data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// login
router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ name });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid name or password." });
        }
        // Check if the password is correct
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid name or password." });
        }

        // Authentication successful
        res.status(200).json({ success: true, message: "Login successful.", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin login - only allows admin role users
router.post('/admin-login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ name });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid name or password." });
        }

        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid name or password." });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
        }

        res.status(200).json({ success: true, message: "Admin login successful.", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get a user by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, message: "User retrieved successfully.", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Create a new user
router.post('/register', asyncHandler(async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ success: false, message: "Name, and password are required." });
    }

    try {
        const user = new User({ name, password });
        const newUser = await user.save();
        res.json({ success: true, message: "User created successfully.", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Update a user
router.put('/:id', asyncHandler(async (req, res) => {
    try {
        const userID = req.params.id;
        const { name, password, role } = req.body;
        if (!name || !password) {
            return res.status(400).json({ success: false, message: "Name, and password are required." });
        }

        const updateData = { name, password };
        if (role) updateData.role = role;

        const updatedUser = await User.findByIdAndUpdate(
            userID,
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.json({ success: true, message: "User updated successfully.", data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Delete a user
router.delete('/:id', asyncHandler(async (req, res) => {
    try {
        const userID = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userID);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

module.exports = router;
