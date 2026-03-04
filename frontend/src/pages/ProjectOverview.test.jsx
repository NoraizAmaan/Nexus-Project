import { screen, waitFor, act } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import ProjectOverview from './ProjectOverview';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Mock api
jest.mock('../services/api');

// Mock mocks
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('../context/ProjectContext', () => ({
    useProject: jest.fn(),
    ProjectProvider: ({ children }) => <div>{children}</div>
}));

// Mock ProjectLayout to simplify containment
jest.mock('../components/project/ProjectLayout', () => ({ children }) => <div data-testid="project-layout">{children}</div>);

describe('ProjectOverview Page', () => {
    const mockUser = { token: 'fake-token' };
    const mockProject = { _id: '123', name: 'Test Project', description: 'Test Desc' };
    const originalConsoleError = console.error;

    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn(); // Suppress console.error

        // Default api implementation
        api.get.mockResolvedValue({ data: [] });
    });

    afterEach(() => {
        console.error = originalConsoleError; // Restore console.error
    });

    test('renders loading state initially', () => {
        useAuth.mockReturnValue({ user: mockUser });
        useProject.mockReturnValue({ project: mockProject, loading: true });

        customRender(<ProjectOverview />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders project stats after fetching data', async () => {
        useAuth.mockReturnValue({ user: mockUser });
        useProject.mockReturnValue({ project: mockProject, loading: false });

        const mockMembers = [{ id: 1 }, { id: 2 }]; // 2 members
        const mockPhases = [
            { status: 'Completed', tasks: [{}, {}] }, // 2 tasks
            { status: 'Pending', tasks: [{}] },       // 1 task
            { status: 'In Progress', tasks: [{}, {}] } // 2 tasks
        ];

        api.get.mockImplementation((url) => {
            if (url.includes('/members')) {
                return Promise.resolve({ data: mockMembers });
            }
            if (url.includes('/phases')) {
                return Promise.resolve({ data: mockPhases });
            }
            if (url.includes('/activities')) {
                return Promise.resolve({ data: [] });
            }
            return Promise.resolve({ data: [] });
        });

        customRender(<ProjectOverview />);

        // Wait for stats to update from "Loading..."
        await waitFor(() => {
            expect(screen.getByText('Test Project / Overview')).toBeInTheDocument();
        });

        // Check Stats
        expect(screen.getByText('Total Members')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();

        expect(screen.getByText('Active Tasks')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();

        expect(screen.getByText('Pending Reviews')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();

        expect(screen.getByText('Project Completion')).toBeInTheDocument();
        expect(screen.getAllByText('33%')).toHaveLength(2);
    });

    test('handles fetch errors gracefully', async () => {
        useAuth.mockReturnValue({ user: mockUser });
        useProject.mockReturnValue({ project: mockProject, loading: false });

        // Mock api failure
        api.get.mockRejectedValue(new Error('Network Error'));

        customRender(<ProjectOverview />);

        // Should show fallback 0s
        await waitFor(() => {
            const zeros = screen.getAllByText('0');
            expect(zeros.length).toBeGreaterThan(0);
        });

        // Ensure console.error was called (suppressed)
        expect(console.error).toHaveBeenCalled();
    });

    test('renders project description', async () => {
        useAuth.mockReturnValue({ user: mockUser });
        useProject.mockReturnValue({ project: mockProject, loading: false });

        // Mock success fetch with empty data to avoid errors
        api.get.mockResolvedValue({ data: [] });

        customRender(<ProjectOverview />);

        expect(screen.getByText('Project Description')).toBeInTheDocument();
        expect(screen.getByText('Test Desc')).toBeInTheDocument();

        // Wait for eventual consistency to avoid act warnings
        await waitFor(() => expect(api.get).toHaveBeenCalled());
    });

});
