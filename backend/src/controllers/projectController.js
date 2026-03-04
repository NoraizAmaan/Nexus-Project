import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";
import Phase from "../models/Phase.js";
import { logActivity } from "../utils/activityLogger.js";

// Default dummy data to seed if database is empty
const defaultProject = {
    name: "Project 007",
    description: "A top-secret project for world domination... or just a cool app.",
    status: "Active",
    privacy: "Private",
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        let projects;
        if (req.user.role === "Admin") {
            // Admins can see all projects
            projects = await Project.find({});
        } else {
            // Regular users see Public projects OR Private projects where they are members
            const memberProjects = await ProjectMember.find({
                email: { $regex: new RegExp(`^${req.user.email}$`, "i") }
            }).select("projectId");

            const projectIds = memberProjects.map((m) => m.projectId.toString());

            projects = await Project.find({
                $or: [
                    { privacy: "Public" },
                    { _id: { $in: projectIds } }
                ]
            });
        }
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Access check
        if (req.user.role !== "Admin" && project.privacy === "Private") {
            const isMember = await ProjectMember.findOne({
                projectId: project._id,
                email: req.user.email,
            });

            if (!isMember) {
                return res.status(403).json({ message: "Access denied to this private project" });
            }
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Public
const createProject = async (req, res) => {
    const { name, description, status, privacy } = req.body;

    try {
        const project = await Project.create({
            name,
            description,
            status: status || "Active",
            privacy: privacy || "Private",
        });

        await logActivity(
            req.user._id,
            req.user.name,
            "created project",
            "Project",
            project.name,
            project._id
        );

        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update project details
// @route   PUT /api/projects/:id
// @access  Public
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            project.name = req.body.name || project.name;
            project.description = req.body.description || project.description;
            project.status = req.body.status || project.status;
            project.privacy = req.body.privacy || project.privacy;

            const updatedProject = await project.save();

            await logActivity(
                req.user._id,
                req.user.name,
                "updated project",
                "Project",
                updatedProject.name,
                updatedProject._id
            );

            res.json(updatedProject);
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete (or Reset) project
// @route   DELETE /api/projects/:id
// @access  Public

// @desc    Delete (or Reset) project
// @route   DELETE /api/projects/:id
// @access  Public
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            const projectName = project.name;
            const projectId = project._id;

            // Cascade delete members and phases
            await ProjectMember.deleteMany({ projectId: project._id });
            await Phase.deleteMany({ projectId: project._id });

            await project.deleteOne();

            await logActivity(
                req.user._id,
                req.user.name,
                "deleted project",
                "Project",
                projectName,
                projectId
            );

            res.json({ message: "Project and all associated data deleted" });
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getProjects, getProjectById, createProject, updateProject, deleteProject };
