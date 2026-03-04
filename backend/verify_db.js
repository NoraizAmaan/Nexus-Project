import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Project from './src/models/Project.js';
import ProjectMember from './src/models/ProjectMember.js';
import Phase from './src/models/Phase.js';

dotenv.config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");
        console.log("Database Name:", mongoose.connection.name);

        const userCount = await User.countDocuments();
        const projectCount = await Project.countDocuments();
        const memberCount = await ProjectMember.countDocuments();
        const phaseCount = await Phase.countDocuments();

        console.log("--- DATABASE SUMMARY ---");
        console.log(`Users: ${userCount}`);
        console.log(`Projects: ${projectCount}`);
        console.log(`Members: ${memberCount}`);
        console.log(`Roadmap Phases: ${phaseCount}`);

        // List specific users to help user identify
        const users = await User.find({}, 'name email role');
        console.log("\n--- USERS LIST ---");
        users.forEach(u => console.log(`- ${u.name} (${u.email}) [${u.role}]`));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verify();
