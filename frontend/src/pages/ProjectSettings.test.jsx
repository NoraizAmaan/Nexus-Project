import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProjectSettings from './ProjectSettings';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Mock Router but keep MemoryRouter working
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

// Mock Context with __esModule true
jest.mock('../context/ProjectContext', () => ({
    __esModule: true,
    useProject: jest.fn(),
    ProjectProvider: ({ children }) => <div>{children}</div>
}));

// Mock Layout
jest.mock('../components/project/ProjectLayout', () => ({ children }) => <div data-testid="project-layout">{children}</div>);

// Mock api
jest.mock('../services/api');

// No need for manual global.alert mock here as we use spyOn in beforeEach

describe('ProjectSettings Page', () => {
    const mockUpdateProject = jest.fn();
    const mockProject = {
        _id: '123',
        name: 'Test Project',
        description: 'Desc',
        privacy: 'Private',
        status: 'Active'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn(() => true);
        const alertMock = jest.fn();
        window.alert = alertMock;
        global.alert = alertMock;
    });

    const customRender = (ui) => {
        return render(
            <MemoryRouter>
                {ui}
            </MemoryRouter>
        );
    };

    test('renders settings form with initial values', () => {
        useProject.mockReturnValue({ project: mockProject, loading: false, updateProject: mockUpdateProject });
        customRender(<ProjectSettings />);

        expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Desc')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Active')).toBeInTheDocument();
    });

    test('saves changes', async () => {
        useProject.mockReturnValue({
            project: mockProject,
            loading: false,
            updateProject: mockUpdateProject
        });

        api.put.mockResolvedValue({ data: { ...mockProject, name: 'Updated Project' } });

        customRender(<ProjectSettings />);

        const nameInput = screen.getByDisplayValue('Test Project');
        fireEvent.change(nameInput, { target: { name: 'projectName', value: 'Updated Project' } });

        const saveButton = screen.getByText('Save Changes');

        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(api.put).toHaveBeenCalledWith(
            expect.stringContaining('/projects/123'),
            expect.objectContaining({ name: 'Updated Project' })
        );
        expect(mockUpdateProject).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated Project' }));
        expect(window.alert).toHaveBeenCalledWith('Settings saved successfully!');
    });

    test('archives project', async () => {
        useProject.mockReturnValue({
            project: mockProject,
            loading: false,
            updateProject: mockUpdateProject
        });

        api.put.mockResolvedValue({ data: { ...mockProject, status: 'Archived' } });

        customRender(<ProjectSettings />);

        const archiveButton = screen.getByText('Archive');

        await act(async () => {
            fireEvent.click(archiveButton);
        });

        expect(window.confirm).toHaveBeenCalled();
        expect(api.put).toHaveBeenCalledWith(
            expect.stringContaining('/projects/123'),
            expect.objectContaining({ status: 'Archived' })
        );
        expect(mockUpdateProject).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Project archived.');
    });

    test('deletes project', async () => {
        useProject.mockReturnValue({ project: mockProject, loading: false, updateProject: mockUpdateProject });

        api.delete.mockResolvedValue({ ok: true });

        customRender(<ProjectSettings />);

        const deleteButton = screen.getByRole('button', { name: 'Delete Project' });

        await act(async () => {
            fireEvent.click(deleteButton);
        });

        expect(window.confirm).toHaveBeenCalled();
        expect(api.delete).toHaveBeenCalledWith(expect.stringContaining('/projects/123'));
        expect(window.alert).toHaveBeenCalledWith('Project deleted.');
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
