import Phase from "../models/Phase.js";
import { logActivity } from "../utils/activityLogger.js";

// Default dummy data to seed if database is empty
const defaultPhases = [
    {
        title: "Phase 1: Planning & Research",
        date: "Q1 2026",
        status: "Completed",
        description: "Gathering requirements, user research, and technical feasibility studies.",
        tasks: ["Stakeholder Interviews", "Competitor Analysis", "Tech Stack Decision"],
    },
    {
        title: "Phase 2: Design & Prototyping",
        date: "Q2 2026",
        status: "In Progress",
        description: "Creating high-fidelity mockups, user flows, and interactive prototypes.",
        tasks: ["UI Kit Creation", "Wireframing", "User Testing"],
    },
    {
        title: "Phase 3: Development",
        date: "Q3 2026",
        status: "Pending",
        description: "Frontend and backend development, API integration, and unit testing.",
        tasks: ["Frontend Setup", "API Development", "Database Schema"],
    },
    {
        title: "Phase 4: Launch & Maintenance",
        date: "Q4 2026",
        status: "Pending",
        description: "Deployment to production, monitoring, and iterative improvements.",
        tasks: ["Production Build", "Security Audit", "Go-Live"],
    },
];

// @desc    Get all phases (seeds default data if empty)
// @route   GET /api/phases
// @access  Public
// @desc    Get all phases
// @route   GET /api/phases
// @access  Public
const getPhases = async (req, res) => {
    try {
        const { projectId } = req.query;
        let query = {};
        if (projectId) {
            query.projectId = projectId;
        }

        const phases = await Phase.find(query);
        res.json(phases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new phase
// @route   POST /api/phases
// @access  Public
const createPhase = async (req, res) => {
    const { title, date, status, description, tasks, projectId } = req.body;

    try {
        const phase = new Phase({
            title,
            date,
            status,
            description,
            tasks,
            projectId,
        });

        const createdPhase = await phase.save();

        await logActivity(
            req.user._id,
            req.user.name,
            "created phase",
            "Phase",
            createdPhase.title,
            projectId
        );

        res.status(201).json(createdPhase);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a phase
// @route   PUT /api/phases/:id
// @access  Public
const updatePhase = async (req, res) => {
    const { title, date, status, description, tasks } = req.body;

    try {
        const phase = await Phase.findById(req.params.id);

        if (phase) {
            phase.title = title || phase.title;
            phase.date = date || phase.date;
            phase.status = status || phase.status;
            phase.description = description || phase.description;
            phase.projectId = req.body.projectId || phase.projectId;
            phase.tasks = tasks || phase.tasks;

            const updatedPhase = await phase.save();

            await logActivity(
                req.user._id,
                req.user.name,
                "updated phase",
                "Phase",
                updatedPhase.title,
                updatedPhase.projectId
            );

            res.json(updatedPhase);
        } else {
            res.status(404).json({ message: "Phase not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a phase
// @route   DELETE /api/phases/:id
// @access  Public
const deletePhase = async (req, res) => {
    try {
        const phase = await Phase.findById(req.params.id);

        if (phase) {
            const phaseTitle = phase.title;
            const projectId = phase.projectId;

            await phase.deleteOne();

            await logActivity(
                req.user._id,
                req.user.name,
                "deleted phase",
                "Phase",
                phaseTitle,
                projectId
            );

            res.json({ message: "Phase removed" });
        } else {
            res.status(404).json({ message: "Phase not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getPhases, createPhase, updatePhase, deletePhase };
