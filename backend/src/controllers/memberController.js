import ProjectMember from "../models/ProjectMember.js";
import { logActivity } from "../utils/activityLogger.js";

// Default dummy members to seed if database is empty
const defaultMembers = [
    {
        name: "John Doe",
        email: "john@company.com",
        role: "Administrator",
        status: "Active",
        type: "Member",
        budget: "$50/hr",
        projects: 3,
        expiresIn: "12 months",
        expirationDate: "2027-01-01",
        roles: ["Administrator"],
    },
    {
        name: "Jane Smith",
        email: "jane@company.com",
        role: "Developer",
        status: "Active",
        type: "Member",
        budget: "$40/hr",
        projects: 1,
        expiresIn: "3 days",
        expirationDate: "2026-02-15",
        roles: ["Developer"],
    },
    {
        name: "Group Alpha",
        email: "alpha@group.com",
        role: "Group",
        status: "Active",
        type: "Group",
        budget: "$0/hr",
        projects: 2,
        expiresIn: "2 years",
        expirationDate: "2028-01-01",
        roles: ["Group"],
    },
];

// ... (getMembers and addMember remain same) ...

// @desc    Update a member
// @route   PUT /api/members/:id
// @access  Private
const updateMember = async (req, res) => {
    const { name, role, email, status, type, budget, roles, projects, expiresIn, expirationDate } = req.body;

    const member = await ProjectMember.findById(req.params.id);

    if (member) {
        member.name = name || member.name;
        member.role = role || member.role;
        member.email = email || member.email;
        member.status = status || member.status;
        member.type = type || member.type;
        member.budget = budget || member.budget;
        member.roles = roles || member.roles;
        member.projects = projects !== undefined ? projects : member.projects;
        member.expiresIn = expiresIn || member.expiresIn;
        member.expirationDate = expirationDate || member.expirationDate;
        member.projectId = req.body.projectId || member.projectId;

        const updatedMember = await member.save();

        await logActivity(
            req.user._id,
            req.user.name,
            "updated member",
            "Member",
            updatedMember.name,
            updatedMember.projectId
        );

        res.json(updatedMember);
    } else {
        res.status(404).json({ message: "Member not found" });
    }
};

// @desc    Delete a member
// ...

// @desc    Get all members (seeds default data if empty)
// @route   GET /api/members
// @access  Private
// @desc    Get all members (seeds default data if empty AND no projectId provided)
// @route   GET /api/members
// @access  Private
const getMembers = async (req, res) => {
    try {
        const { projectId } = req.query;
        let query = {};
        if (projectId) {
            query.projectId = projectId;
        }

        const members = await ProjectMember.find(query);
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a member
// @route   POST /api/members
// @access  Private
const addMember = async (req, res) => {
    const { name, role, email, status, type, budget, roles, projects, expiresIn, expirationDate, projectId } = req.body;

    const member = await ProjectMember.create({
        name,
        role,
        email,
        status,
        type,
        budget,
        projects,
        expiresIn,
        expirationDate,
        roles,
        projectId,
    });

    await logActivity(
        req.user._id,
        req.user.name,
        "added member",
        "Member",
        member.name,
        projectId
    );

    res.status(201).json(member);
};

// @desc    Delete a member
// @route   DELETE /api/members/:id
// @access  Private
const deleteMember = async (req, res) => {
    const member = await ProjectMember.findById(req.params.id);

    if (member) {
        const memberName = member.name;
        const projectId = member.projectId;

        await member.deleteOne();

        await logActivity(
            req.user._id,
            req.user.name,
            "removed member",
            "Member",
            memberName,
            projectId
        );

        res.json({ message: "Member removed" });
    } else {
        res.status(404).json({ message: "Member not found" });
    }
};

export { getMembers, addMember, updateMember, deleteMember };
