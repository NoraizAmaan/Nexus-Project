import Activity from "../models/Activity.js";

// @desc    Get recent activities for a project
// @route   GET /api/activities?projectId=...
// @access  Private
const getActivities = async (req, res) => {
    try {
        const { projectId } = req.query;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const activities = await Activity.find({ projectId })
            .populate("user", "name profilePic")
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getActivities };
