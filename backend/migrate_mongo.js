import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProjectMember from './src/models/ProjectMember.js';
import Phase from './src/models/Phase.js';
import Project from './src/models/Project.js';

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const projects = await Project.find({});
        if (projects.length === 0) {
            console.error("No projects found.");
            process.exit(1);
        }

        const targetProject = projects[0];
        console.log(`Using target project: ${targetProject.name} (${targetProject._id})`);

        // Update Members
        const memResult = await ProjectMember.updateMany(
            { projectId: { $exists: false } },
            { $set: { projectId: targetProject._id } }
        );
        console.log(`Updated ${memResult.modifiedCount} members.`);

        // Update Phases
        const phaseResult = await Phase.updateMany(
            { projectId: { $exists: false } },
            { $set: { projectId: targetProject._id } }
        );
        console.log(`Updated ${phaseResult.modifiedCount} phases.`);

        console.log("Migration Complete.");
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

migrate();
