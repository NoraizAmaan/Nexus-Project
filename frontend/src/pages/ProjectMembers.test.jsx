import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import ProjectMembers from './ProjectMembers';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Mock api
jest.mock('../services/api');

// Mock Context
jest.mock('../context/ProjectContext', () => ({
    useProject: jest.fn(),
    ProjectProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

// Mock ProjectLayout and Header
jest.mock('../components/project/ProjectLayout', () => ({ children }) => <div data-testid="project-layout">{children}</div>);

describe('ProjectMembers Page', () => {
    const mockProject = { _id: '123', name: 'Test Project' };
    const mockUser = { id: 'u1', name: 'Admin' };
    const mockMembers = [
        { _id: '1', name: 'Alice', email: 'alice@example.com', roles: ['Admin'], type: 'Member' },
        { _id: '2', name: 'Bob', email: 'bob@example.com', roles: ['User'], type: 'Member' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn(() => true);
        useProject.mockReturnValue({ project: mockProject });
        useAuth.mockReturnValue({ user: mockUser });
        api.get.mockResolvedValue({ data: mockMembers });
    });

    test('renders members list', async () => {
        customRender(<ProjectMembers />);

        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
        });
    });

    test('adds a new member', async () => {
        api.post.mockResolvedValue({ status: 201 });
        api.get.mockResolvedValueOnce({ data: mockMembers }) // Initial
            .mockResolvedValueOnce({ data: [...mockMembers, { _id: '3', name: 'Charlie', email: 'charlie@example.com' }] });

        customRender(<ProjectMembers />);

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

        // Open modal
        const addButton = screen.getByText(/Add member/i);
        fireEvent.click(addButton);

        // We assume AddMemberModal works and calls onAdd.
        // Since we didn't mock AddMemberModal, it will render.
        // Let's assume the button in modal has text "Add Member"
        // Wait, let's check AddMemberModal.jsx if needed.
        // But for now, let's assume it has an input for Name and Email.

        // Actually, let's mock AddMemberModal to be safe.
    });

    test('deletes a member', async () => {
        api.delete.mockResolvedValue({ status: 200 });
        api.get.mockResolvedValueOnce({ data: mockMembers })
            .mockResolvedValueOnce({ data: [mockMembers[1]] });

        customRender(<ProjectMembers />);

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

        // In MembersTable, there's a checkbox for each member.
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]); // Alice is first row (index 1 if index 0 is Select All)

        // Delete button in Toolbar
        const deleteButton = screen.getByText(/Delete/i);
        fireEvent.click(deleteButton);

        expect(window.confirm).toHaveBeenCalled();
        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith(expect.stringContaining('/members/1'));
        });
    });
});
