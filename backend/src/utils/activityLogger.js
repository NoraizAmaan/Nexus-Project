import Activity from "../models/Activity.js";

/**
 * Logs an activity to the database.
 * @param {string} userId - ID of the user performing the action
 * @param {string} userName - Name of the user performing the action
 * @param {string} action - Action performed (e.g., "created", "updated")
 * @param {string} targetType - Type of the target object (e.g., "Phase", "Document")
 * @param {string} targetName - Name of the target object (e.g., "Phase name")
 * @param {string} projectId - ID of the associated project
 */
export const logActivity = async (userId, userName, action, targetType, targetName, projectId) => {
    try {
        await Activity.create({
            user: userId,
            userName,
            action,
            targetType,
            targetName,
            projectId,
        });
    } catch (error) {
        console.error("Error logging activity:", error);
    }
};
