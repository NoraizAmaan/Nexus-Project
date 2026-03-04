import { screen, fireEvent } from '@testing-library/react';
import { customRender } from '../../utils/test-utils';
import AddProjectModal from './AddProjectModal';

describe('AddProjectModal Component', () => {
    const mockOnClose = jest.fn();
    const mockOnAdd = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders form inputs correctly', () => {
        customRender(<AddProjectModal onClose={mockOnClose} onAdd={mockOnAdd} />);

        expect(screen.getByText('New Project')).toBeInTheDocument();
        expect(screen.getByLabelText('Project Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
        expect(screen.getByLabelText('Privacy')).toBeInTheDocument();
        expect(screen.getByText('Create Project')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('updates inputs and submits valid data', () => {
        customRender(<AddProjectModal onClose={mockOnClose} onAdd={mockOnAdd} />);

        fireEvent.change(screen.getByLabelText('Project Name'), { target: { value: 'My New Project' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'A cool project description' } });
        fireEvent.change(screen.getByLabelText('Privacy'), { target: { value: 'Public' } });

        fireEvent.click(screen.getByText('Create Project'));

        expect(mockOnAdd).toHaveBeenCalledWith({
            name: 'My New Project',
            description: 'A cool project description',
            status: 'Active',
            privacy: 'Public',
        });
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('does not submit when required fields are empty', () => {
        customRender(<AddProjectModal onClose={mockOnClose} onAdd={mockOnAdd} />);

        // Only set name, leave description empty
        fireEvent.change(screen.getByLabelText('Project Name'), { target: { value: 'My New Project' } });

        fireEvent.click(screen.getByText('Create Project'));

        expect(mockOnAdd).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    test('closes modal on cancel', () => {
        customRender(<AddProjectModal onClose={mockOnClose} onAdd={mockOnAdd} />);

        fireEvent.click(screen.getByText('Cancel'));
        expect(mockOnClose).toHaveBeenCalled();
    });
});
