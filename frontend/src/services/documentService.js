import api from "./api";

const documentService = {
    getProjectDocuments: async (projectId) => {
        const response = await api.get(`/documents/${projectId}`);
        return response.data;
    },

    uploadDocument: async (formData) => {
        const response = await api.post("/documents", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    deleteDocument: async (id) => {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    },
};

export default documentService;
