import { useState, useEffect, useRef } from "react";
import { useProject } from "../context/ProjectContext";
import ProjectLayout from "../components/project/ProjectLayout";
import documentService from "../services/documentService";

export default function ProjectDocuments() {
    const { project } = useProject();
    const [docs, setDocs] = useState([]);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (project?._id) {
            fetchDocs();
        }
    }, [project?._id]);

    const fetchDocs = async () => {
        try {
            setLoading(true);
            const data = await documentService.getProjectDocuments(project._id);
            setDocs(data);
        } catch (error) {
            console.error("Failed to fetch documents", error);
        } finally {
            setLoading(false);
        }
    };

    const getFileCategory = (ext) => {
        const e = ext.toLowerCase();
        if (e === "pdf") return "PDF";
        if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(e)) return "Image";
        if (["js", "jsx", "ts", "tsx", "py", "java", "c", "cpp", "h", "html", "css", "sql", "json"].includes(e)) return "Code";
        if (["xlsx", "xls", "csv"].includes(e)) return "Sheet";
        return "Doc"; // Default for docx, txt, md etc.
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", project._id);

        try {
            setLoading(true);
            await documentService.uploadDocument(formData);
            fetchDocs();
            e.target.value = null; // Clear input
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this document?")) {
            try {
                await documentService.deleteDocument(id);
                fetchDocs();
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    const filteredDocs = docs.filter(doc => {
        const category = getFileCategory(doc.extension);
        const matchesType = filter === "All" || category === filter;
        const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    const getIcon = (type) => {
        const commonClasses = "w-8 h-8";
        switch (type) {
            case "PDF": return (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`${commonClasses} text-red-500`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v15a2 2 0 002 2z" />
                </svg>
            );
            case "Image": return (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`${commonClasses} text-purple-500`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            );
            case "Code": return (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`${commonClasses} text-blue-500`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            );
            case "Sheet": return (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`${commonClasses} text-green-500`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
            default: return (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`${commonClasses} text-gray-400`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v15a2 2 0 002 2z" />
                </svg>
            );
        }
    }

    return (
        <ProjectLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Documents</h1>
                    <p className="text-sm text-gray-500">{project?.name} / Documents</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search docs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white flex-1 sm:w-64"
                    />
                    <button
                        onClick={handleUploadClick}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shrink-0"
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        )}
                        Upload
                    </button>
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 pb-2 mt-4 overflow-x-auto no-scrollbar">
                {["All", "PDF", "Image", "Code", "Doc", "Sheet"].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${filter === type
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden dark:bg-slate-800 mt-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider dark:bg-slate-900 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Name</th>
                                <th className="px-6 py-3 font-semibold">Size</th>
                                <th className="px-6 py-3 font-semibold">Date Uploaded</th>
                                <th className="px-6 py-3 font-semibold">Uploaded By</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {loading && filteredDocs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading documents...</td>
                                </tr>
                            ) : filteredDocs.map(doc => (
                                <tr key={doc._id} className="hover:bg-gray-50 transition dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                                            {getIcon(getFileCategory(doc.extension))}
                                        </div>
                                        <div>
                                            {(() => {
                                                const ext = doc.extension.toLowerCase();
                                                const officeExtensions = ["docx", "doc", "xlsx", "xls", "pptx", "ppt"];

                                                let previewUrl = doc.url;
                                                if (officeExtensions.includes(ext)) {
                                                    previewUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(doc.url)}`;
                                                }

                                                return (
                                                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 dark:text-white hover:text-indigo-600">
                                                        {doc.name}
                                                    </a>
                                                );
                                            })()}
                                            <p className="text-xs text-gray-500 uppercase">{doc.extension}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatSize(doc.size)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(doc.createdAt)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{doc.uploadedBy?.name || "Unknown"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(doc._id)}
                                            className="text-gray-400 hover:text-red-600 p-1"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredDocs.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        No documents found.
                    </div>
                )}
            </div>
        </ProjectLayout>
    );
}
