import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import ProjectRoadmap from './ProjectRoadmap';
import { useProject } from '../context/ProjectContext';
import api from '../services/api';

// Mock api
jest.mock('../services/api');

// Mocks
jest.mock('../context/ProjectContext', () => ({
    useProject: jest.fn(),
    ProjectProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('../components/project/ProjectLayout', () => ({ children }) => <div data-testid="project-layout">{children}</div>);

jest.mock('../components/project/AddPhaseModal', () => ({ isOpen, onClose, onAdd, initialData }) => (
    isOpen ? (
        <div data-testid="add-phase-modal">
            <p>{initialData ? 'Edit Mode' : 'Add Mode'}</p>
            <button onClick={onClose}>Close</button>
            <button onClick={onAdd}>Save</button>
        </div>
    ) : null
));

global.fetch = jest.fn();

describe('ProjectRoadmap Page', () => {
    const mockProject = { _id: '123', name: 'Test Project' };
    const mockPhases = [
        {
            _id: 'p1',
            title: 'Phase 1',
            date: '2025-01-01',
            status: 'Completed',
            description: 'Desc 1',
            tasks: ['Task A', 'Task B']
        },
        {
            _id: 'p2',
            title: 'Phase 2',
            date: '2025-02-01',
            status: 'In Progress',
            description: 'Desc 2',
            tasks: ['Task C']
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn(() => true);
    });

    test('renders roadmap and phases', async () => {
        useProject.mockReturnValue({ project: mockProject });

        api.get.mockResolvedValue({
            data: mockPhases
        });

        await act(async () => {
            customRender(<ProjectRoadmap />);
        });

        expect(screen.getByText('Test Project / Roadmap')).toBeInTheDocument();
        expect(screen.getByText('Phase 1')).toBeInTheDocument();
        expect(screen.getByText('Phase 2')).toBeInTheDocument();
        expect(screen.getByText('Task A')).toBeInTheDocument();
        expect(screen.getByText('Task C')).toBeInTheDocument();
    });

    test('opens add phase modal', async () => {
        useProject.mockReturnValue({ project: mockProject });
        api.get.mockResolvedValue({ data: [] });

        await act(async () => {
            customRender(<ProjectRoadmap />);
        });

        const addButton = screen.getByText('Add Phase');
        fireEvent.click(addButton);

        expect(screen.getByTestId('add-phase-modal')).toBeInTheDocument();
        expect(screen.getByText('Add Mode')).toBeInTheDocument();

        // Close it
        fireEvent.click(screen.getByText('Close'));
        expect(screen.queryByTestId('add-phase-modal')).not.toBeInTheDocument();
    });

    test('opens edit phase modal', async () => {
        useProject.mockReturnValue({ project: mockProject });
        api.get.mockResolvedValue({ data: mockPhases });

        await act(async () => {
            customRender(<ProjectRoadmap />);
        });

        // Find edit button (PencilSquareIcon)
        // Since we didn't mock icons with text, we look for button with title "Edit Phase"
        const editButtons = screen.getAllByTitle('Edit Phase');
        fireEvent.click(editButtons[0]);

        expect(screen.getByTestId('add-phase-modal')).toBeInTheDocument();
        expect(screen.getByText('Edit Mode')).toBeInTheDocument();
    });

    test('handles delete phase', async () => {
        useProject.mockReturnValue({ project: mockProject });
        api.get.mockResolvedValueOnce({ data: mockPhases }); // Initial fetch

        // Mock delete response
        api.delete.mockResolvedValueOnce({ status: 200 });

        // Mock re-fetch after delete
        api.get.mockResolvedValueOnce({ data: [] });

        await act(async () => {
            customRender(<ProjectRoadmap />);
        });

        const deleteButtons = screen.getAllByTitle('Delete Phase');

        await act(async () => {
            fireEvent.click(deleteButtons[0]);
        });

        expect(window.confirm).toHaveBeenCalled();
        expect(api.delete).toHaveBeenCalledWith(expect.stringContaining('/phases/p1'));
    });

});
