// Native fetch in Node 18+

const migrate = async () => {
    try {
        console.log("Starting migration...");

        // 1. Get Projects
        const projRes = await fetch("http://localhost:5000/api/projects");
        if (!projRes.ok) throw new Error("Failed to fetch projects");
        const projects = await projRes.json();

        if (projects.length === 0) {
            console.error("No projects found to migrate data to!");
            return;
        }

        const targetProject = projects[0]; // Assign to the first project
        console.log(`Migrating data to project: ${targetProject.name} (${targetProject._id})`);

        // 2. Migrate Members
        const memRes = await fetch("http://localhost:5000/api/members");
        if (!memRes.ok) throw new Error("Failed to fetch members");
        const members = await memRes.json();

        console.log(`Found ${members.length || 0} members.`);

        if (Array.isArray(members)) {
            let membersMigrated = 0;
            for (const m of members) {
                if (!m.projectId) {
                    console.log(`Migrating member ${m.name}...`);
                    await fetch(`http://localhost:5000/api/members/${m._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ projectId: targetProject._id })
                    });
                    membersMigrated++;
                }
            }
            console.log(`Migrated ${membersMigrated} members.`);
        }

        // 3. Migrate Phases (Roadmap)
        const phaseRes = await fetch("http://localhost:5000/api/phases");
        if (!phaseRes.ok) throw new Error("Failed to fetch phases");
        const phases = await phaseRes.json();
        console.log(`Found ${phases.length || 0} phases.`);

        if (Array.isArray(phases)) {
            let phasesMigrated = 0;
            for (const p of phases) {
                if (!p.projectId) {
                    console.log(`Migrating phase ${p.title}...`);
                    await fetch(`http://localhost:5000/api/phases/${p._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ projectId: targetProject._id })
                    });
                    phasesMigrated++;
                }
            }
            console.log(`Migrated ${phasesMigrated} phases.`);
        }

        console.log("Migration complete!");

    } catch (error) {
        console.error("Migration error:", error);
    }
};

migrate();
