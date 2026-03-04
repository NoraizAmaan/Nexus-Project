// Native fetch in Node 18+

const seed = async () => {
    try {
        console.log("Creating default project...");
        const response = await fetch("http://localhost:5000/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Project Alpha",
                description: "Default project to restore access.",
                privacy: "Private",
                status: "Active"
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Success! Created project:", data.name);
            console.log("ID:", data._id);
        } else {
            console.error("Failed:", await response.text());
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

seed();
