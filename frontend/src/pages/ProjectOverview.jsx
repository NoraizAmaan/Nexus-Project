import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import ProjectLayout from "../components/project/ProjectLayout";
import api from "../services/api";
import { generateProjectPDF } from "../services/reportService";

export default function ProjectOverview() {
    const { t } = useTranslation();
    const { project, loading } = useProject();
    const { user } = useAuth();
    const [activities, setActivities] = useState([]);
    const [stats, setStats] = useState([
        { label: "projectDetails.totalMembers", value: "0", change: "projectDetails.loading", trend: "neutral" },
        { label: "projectDetails.activeTasks", value: "0", change: "projectDetails.loading", trend: "neutral" },
        { label: "projectDetails.pendingReviews", value: "0", change: "projectDetails.loading", trend: "neutral" },
        { label: "projectDetails.projectCompletion", value: "0%", change: "projectDetails.loading", trend: "neutral" },
    ]);

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return t('projectDetails.yearsAgo', { count: interval });
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return t('projectDetails.monthsAgo', { count: interval });
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return t('projectDetails.daysAgo', { count: interval });
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return t('projectDetails.hoursAgo', { count: interval });
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return t('projectDetails.minutesAgo', { count: interval });
        return t('projectDetails.secondsAgo', { count: Math.floor(seconds) });
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!project?._id) return;

            try {
                const [membersRes, phasesRes, activitiesRes] = await Promise.all([
                    api.get(`/members?projectId=${project._id}`),
                    api.get(`/phases?projectId=${project._id}`),
                    api.get(`/activities?projectId=${project._id}`),
                ]);

                const members = membersRes.data;
                const phases = phasesRes.data;
                const activityData = activitiesRes.data;

                if (!Array.isArray(members) || !Array.isArray(phases)) {
                    throw new Error("Invalid data format");
                }

                // Stats calculation...
                const totalMembers = members.length;
                const activeTasks = phases
                    .filter(p => p.status !== "Completed")
                    .reduce((acc, curr) => acc + (curr.tasks ? curr.tasks.length : 0), 0);
                const pendingReviews = phases.filter(p => p.status === "Pending").length;
                const totalPhases = phases.length;
                const completedPhases = phases.filter(p => p.status === "Completed").length;
                const completionPercentage = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

                setStats([
                    { label: "projectDetails.totalMembers", value: totalMembers.toString(), change: "projectDetails.updatedNow", trend: "neutral" },
                    { label: "projectDetails.activeTasks", value: activeTasks.toString(), change: "projectDetails.inActivePhases", trend: "neutral" },
                    { label: "projectDetails.pendingReviews", value: pendingReviews.toString(), change: "projectDetails.phasesPending", trend: pendingReviews > 0 ? "down" : "up" },
                    { label: "projectDetails.projectCompletion", value: `${completionPercentage}%`, change: "projectDetails.basedOnPhases", trend: "up" },
                ]);

                setActivities(activityData);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [project, user]);

    if (loading) return <div>{t('projectDetails.loading')}</div>;

    return (
        <ProjectLayout>
            {/* Re-using header style but with custom content for Overview */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold dark:text-white">{t('projectDetails.overview')}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{project?.name} / {t('projectDetails.overview')}</p>
                </div>
                <button
                    onClick={() => generateProjectPDF(project, stats, activities)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
                >
                    {t('projectDetails.downloadReport')}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
                        <p className="text-sm text-gray-500 font-medium dark:text-gray-400">{t(stat.label)}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <span
                                className={`font-medium ${stat.trend === "up"
                                    ? "text-green-600 dark:text-green-400"
                                    : stat.trend === "down"
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                            >
                                {t(stat.change)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Project Description */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: Description & Progress */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('projectDetails.projectDescription')}</h2>
                        <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                            {project?.description}
                        </p>
                        <div className="mt-6">
                            <div className="flex justify-between text-sm font-medium mb-2 dark:text-gray-300">
                                <span>{t('projectDetails.progress')}</span>
                                <span>{stats[3]?.value}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-slate-700">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: stats[3]?.value }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Recent Activity */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
                    <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('projectDetails.recentActivity')}</h2>
                    <div className="space-y-4">
                        {activities.length > 0 ? (
                            activities.map((activity) => (
                                <div key={activity._id} className="flex gap-3">
                                    <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase dark:bg-slate-700 dark:text-indigo-400 border border-gray-100 dark:border-slate-600">
                                        {activity.user?.profilePic ? (
                                            <img src={activity.user.profilePic} alt={activity.userName} className="w-full h-full object-cover" />
                                        ) : (
                                            activity.userName.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-900 dark:text-gray-200">
                                            <span className="font-medium">{activity.userName}</span>{" "}
                                            <span className="text-gray-500 dark:text-gray-400">{activity.action}</span>{" "}
                                            <span className="font-medium text-indigo-600 dark:text-indigo-400">{activity.targetName}</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">{timeAgo(activity.createdAt)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 dark:text-gray-500">{t('projectDetails.noActivityFound')}</p>
                        )}
                    </div>
                </div>
            </div>
        </ProjectLayout>
    );
}
