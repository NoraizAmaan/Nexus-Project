import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import Projects from './Projects';
import { useProject } from '../context/ProjectContext';

// Mocks
jest.mock('../context/ProjectContext', () => ({
    useProject: jest.fn(),
    ProjectProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('../components/project/ProjectLayout', () => ({ children }) => <div data-testid="project-layout">{children}</div>);

// Mock AddProjectModal
jest.mock('../components/project/AddProjectModal', () => ({ onClose, onAdd }) => (
    <div data-testid="add-project-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onAdd({ name: 'New Project', description: 'Desc' })}>Create</button>
    </div>
));

describe('Projects Page', () => {
    const mockSwitchProject = jest.fn();
    const mockCreateProject = jest.fn();
    const mockProjects = [
        { _id: '1', name: 'Project Alpha', description: 'Desc A', privacy: 'Private' },
        { _id: '2', name: 'Project Beta', description: 'Desc B', privacy: 'Public' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders project list', () => {
        useProject.mockReturnValue({
            projects: mockProjects,
            project: mockProjects[0], // Active project is Alpha
            switchProject: mockSwitchProject,
            createProject: mockCreateProject
        });

        customRender(<Projects />);

        expect(screen.getByText('Participating Projects')).toBeInTheDocument();
        expect(screen.getByText('Project Alpha')).toBeInTheDocument();
        expect(screen.getByText('Project Beta')).toBeInTheDocument();

        // Active badge check (Alpha is active)
        // We can find the container for Alpha maybe? or just check for "Active" text.
        // There should be one "Active" badge.
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    test('switches project on click', () => {
        useProject.mockReturnValue({
            projects: mockProjects,
            project: mockProjects[0],
            switchProject: mockSwitchProject,
            createProject: mockCreateProject
        });

        customRender(<Projects />);

        // Find "Open Project" buttons. There are 2.
        const openButtons = screen.getAllByText(/Open Project/i);

        // Click second one (Beta)
        fireEvent.click(openButtons[1]);

        expect(mockSwitchProject).toHaveBeenCalledWith('2');
    });

    test('opens new project modal', () => {
        useProject.mockReturnValue({
            projects: mockProjects,
            project: mockProjects[0],
            switchProject: mockSwitchProject,
            createProject: mockCreateProject
        });

        customRender(<Projects />);

        const newProjectBtn = screen.getByText('New Project');
        fireEvent.click(newProjectBtn);

        expect(screen.getByTestId('add-project-modal')).toBeInTheDocument();
    });

    test('creates new project', async () => {
        useProject.mockReturnValue({
            projects: mockProjects,
            project: mockProjects[0],
            switchProject: mockSwitchProject,
            createProject: mockCreateProject
        });

        customRender(<Projects />);

        fireEvent.click(screen.getByText('New Project'));

        const createBtn = screen.getByText('Create');
        await act(async () => {
            fireEvent.click(createBtn);
        });

        expect(mockCreateProject).toHaveBeenCalledWith({ name: 'New Project', description: 'Desc' });
    });
});
