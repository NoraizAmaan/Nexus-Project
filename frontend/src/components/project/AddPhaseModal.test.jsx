import { screen, fireEvent, waitFor } from '@testing-library/react';
import { customRender } from '../../utils/test-utils';
import AddPhaseModal from './AddPhaseModal';
import api from '../../services/api';

// Mock api
jest.mock('../../services/api');

// Mock ResizeObserver which is used by HeadlessUI Dialog
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

describe('AddPhaseModal Component', () => {
    const mockOnClose = jest.fn();
    const mockOnAdd = jest.fn();
    const projectId = 'proj-123';

    beforeEach(() => {
        jest.clearAllMocks();
        api.post.mockResolvedValue({ status: 201 });
        api.put.mockResolvedValue({ status: 200 });
    });

    test('renders nothing when isOpen is false', () => {
        customRender(
            <AddPhaseModal
                isOpen={false}
                onClose={mockOnClose}
                onAdd={mockOnAdd}
                projectId={projectId}
            />
        );
        expect(screen.queryByText('Add New Phase')).not.toBeInTheDocument();
    });

    test('renders modal when isOpen is true', () => {
        customRender(
            <AddPhaseModal
                isOpen={true}
                onClose={mockOnClose}
                onAdd={mockOnAdd}
                projectId={projectId}
            />
        );
        expect(screen.getByText('Add New Phase')).toBeInTheDocument();
        expect(screen.getByText('Phase Title')).toBeInTheDocument();
        expect(screen.getByText('Date / Quarter')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Key Tasks (comma separated)')).toBeInTheDocument();
    });

    test('submits form with valid data', async () => {
        customRender(
            <AddPhaseModal
                isOpen={true}
                onClose={mockOnClose}
                onAdd={mockOnAdd}
                projectId={projectId}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('Phase 1: Planning'), { target: { value: 'Phase 1' } });
        fireEvent.change(screen.getByPlaceholderText('Q1 2026'), { target: { value: 'Q1 2025' } });
        fireEvent.change(screen.getByPlaceholderText('Description of the phase...'), { target: { value: 'Test Description' } });
        fireEvent.change(screen.getByPlaceholderText('Task 1, Task 2, Task 3'), { target: { value: 'Task A, Task B' } });

        fireEvent.click(screen.getByText('Add Phase'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                "/phases",
                expect.objectContaining({
                    title: "Phase 1"
                })
            );
            expect(mockOnAdd).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    test('pre-fills data on edit mode', async () => {
        const initialData = {
            _id: 'phase-1',
            title: 'Existing Phase',
            date: 'Q2 2025',
            status: 'In Progress',
            description: 'Existing Description',
            tasks: ['Task X'],
        };

        customRender(
            <AddPhaseModal
                isOpen={true}
                onClose={mockOnClose}
                onAdd={mockOnAdd}
                initialData={initialData} // Pass initialData to trigger edit mode
                projectId={projectId}
            />
        );

        expect(screen.getByText('Edit Phase')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Phase')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Q2 2025')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument();
            expect(screen.getByDisplayValue('In Progress')).toBeInTheDocument();
        });
    });
});
