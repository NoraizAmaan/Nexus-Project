import { GoogleGenerativeAI } from "@google/generative-ai";

export const handleChat = async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        if (!apiKey) {
            console.error("GEMINI_API_KEY is not defined in environment variables.");
            return res.status(500).json({ error: "Chatbot configuration error." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Build the system prompt
        const systemPrompt = `You are the Nexus Portal Support Assistant. Your job is to help users navigate and understand the Nexus Portal, an enterprise role-based access management system.
        
        Key features of Nexus Portal:
        - Dashboard: System summary, active users, system status.
        - Users: View and manage system users (Admin only).
        - Projects: Manage and switch between projects, view roadmap and phases, track active tasks and progress.
        - Reports: Generate system reports, user activity, login audit, role distribution (exportable to CSV/PDF).
        - Profile: Manage account information, designation, office location, view admin overview.
        - Help Center: Access FAQ, troubleshooting, and support.
        
        FAQ Knowledge Base:
        - Q: How do I create a new project? A: Navigate to the Projects page and click the 'New Project' button in the top right corner. Fill in the details and save.
        - Q: Can I invite external members? A: Yes, you can invite members via email in the Project Settings > Members section.
        - Q: Where can I find my reports? A: Reports are available in the 'Reports' tab. You can export them as PDF or CSV.
        - Q: How do I change my password? A: You can reset your password by clicking the 'Forgot Password' link on the Login page.
        - Q: Account locked? A: If you've entered the wrong password too many times, your account may be temporarily locked for 15 minutes.
        - Q: Login issues? A: Try clearing your browser cache or opening the page in Incognito mode.

        Guidelines for responding:
        1. Be concise, polite, and helpful.
        2. Answer questions based ONLY on the provided knowledge base and features.
        3. If a user asks something completely unrelated to the Nexus Portal or general tech support, politely inform them that you can only assist with Nexus Portal queries.
        4. Do not provide code or complex technical implementations unless specifically asked about the portal's functionality (e.g., how RBAC works).
        `;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt
        });

        // Format history for Gemini API
        // Gemini expects history as: [{ role: "user" | "model", parts: [{ text: "..." }] }]
        let formattedHistory = [];
        if (history && Array.isArray(history)) {
            formattedHistory = history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));
        }

        // Start chat with history
        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.2, // Low temperature for factual responses
            }
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        res.status(200).json({ reply: response });
    } catch (error) {
        console.error("Error in chatController:", error);
        res.status(500).json({ error: error.message || "An error occurred while processing your request." });
    }
};
