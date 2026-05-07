import User from "../models/User.js";
import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";

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

// @desc    Get data for 3D Organization Graph
// @route   GET /api/users/graph
// @access  Private
const getGraphData = async (req, res) => {
    try {
        const users = await User.find({});
        const projects = await Project.find({});
        const members = await ProjectMember.find({});

        const nodes = [];
        const links = [];

        // Map users to nodes
        const userMap = new Map();
        users.forEach(user => {
            userMap.set(user.email, user._id.toString());
            nodes.push({
                id: "user_" + user._id,
                name: user.name,
                group: "user",
                color: "#3b82f6",
                val: 5
            });
        });

        // Map projects to nodes
        projects.forEach(project => {
            nodes.push({
                id: "proj_" + project._id,
                name: project.name,
                group: "project",
                color: "#10b981",
                val: 10
            });
        });

        // Map members to links and handle external users
        members.forEach(member => {
            const projectId = "proj_" + member.projectId;
            let userId = userMap.get(member.email);

            if (!userId) {
                // External/Ghost member
                userId = "ext_" + member._id;
                nodes.push({
                    id: userId,
                    name: member.name + " (External)",
                    group: "external",
                    color: "#f97316", // Orange
                    val: 4
                });
            } else {
                userId = "user_" + userId;
            }

            links.push({
                source: userId,
                target: projectId,
                label: member.role || "Member"
            });
        });

        res.json({ nodes, links });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error fetching graph data" });
    }
};

export { getUsers, deleteUser, getGraphData };
