import User from "../models/User.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only - simplified for now)
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: "User removed" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

export { getUsers, deleteUser };
