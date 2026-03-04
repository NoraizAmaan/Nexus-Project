import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import ProjectDocuments from './ProjectDocuments';
import { useProject } from '../context/ProjectContext';
import documentService from '../services/documentService';

// Mocks
jest.mock('../services/documentService');
jest.mock('../context/ProjectContext', () => ({
    useProject: jest.fn(),
    ProjectProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('../components/project/ProjectLayout', () => ({ children }) => <div data-testid="project-layout">{children}</div>);

describe('ProjectDocuments Page', () => {
    const mockProject = { _id: '123', name: 'Test Project' };
    const mockDocs = [
        { _id: 'doc1', name: 'Project_Requirements.pdf', extension: 'pdf', size: 1024, createdAt: '2023-01-01T10:00:00Z' },
        { _id: 'doc2', name: 'UI_Moodboard.png', extension: 'png', size: 2048, createdAt: '2023-01-02T11:00:00Z' },
        { _id: 'doc3', name: 'Budget_Report_2026.xlsx', extension: 'xlsx', size: 512, createdAt: '2023-01-03T12:00:00Z' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn(() => true);
        documentService.getProjectDocuments.mockResolvedValue(mockDocs);
        useProject.mockReturnValue({ project: mockProject, loading: false });
    });

    test('renders documents list', async () => {
        customRender(<ProjectDocuments />);

        await waitFor(() => {
            expect(screen.getByText('Test Project / Documents')).toBeInTheDocument();
            expect(screen.getByText('Project_Requirements.pdf')).toBeInTheDocument();
            expect(screen.getByText('UI_Moodboard.png')).toBeInTheDocument();
        });
    });

    test('filters documents by type', async () => {
        customRender(<ProjectDocuments />);

        await waitFor(() => {
            expect(screen.getByText('Project_Requirements.pdf')).toBeInTheDocument();
        });

        // Click PDF filter
        fireEvent.click(screen.getByText('PDF', { selector: 'button' }));

        expect(screen.getByText('Project_Requirements.pdf')).toBeInTheDocument();
        expect(screen.queryByText('UI_Moodboard.png')).not.toBeInTheDocument();

        // Click Image filter
        fireEvent.click(screen.getByText('Image', { selector: 'button' }));

        expect(screen.queryByText('Project_Requirements.pdf')).not.toBeInTheDocument();
        expect(screen.getByText('UI_Moodboard.png')).toBeInTheDocument();
    });

    test('deletes a document', async () => {
        documentService.deleteDocument.mockResolvedValue({ success: true });
        documentService.getProjectDocuments.mockResolvedValueOnce(mockDocs)
            .mockResolvedValueOnce([mockDocs[1], mockDocs[2]]);

        customRender(<ProjectDocuments />);

        // Wait for docs to render
        await waitFor(() => {
            expect(screen.getByText('Project_Requirements.pdf')).toBeInTheDocument();
        });

        // Click delete button for first doc. The delete button has a trash icon (d="M19 7l-.867 ...")
        const deleteButtons = screen.getAllByRole('button').filter(b => b.querySelector('path')?.getAttribute('d')?.includes('M19 7'));

        if (deleteButtons.length === 0) {
            throw new Error('Delete button not found');
        }

        fireEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        await waitFor(() => {
            expect(documentService.deleteDocument).toHaveBeenCalledWith('doc1');
        });
    });

    test('uploads a document', async () => {
        documentService.uploadDocument.mockResolvedValue({ success: true });

        customRender(<ProjectDocuments />);

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });

        // Find input directly using container or selector
        const input = document.querySelector('input[type="file"]');
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(documentService.uploadDocument).toHaveBeenCalled();
        });
    });
});
