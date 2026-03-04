import { screen, fireEvent } from '@testing-library/react';
import { customRender } from '../../utils/test-utils';
import AddMemberModal from './AddMemberModal';

describe('AddMemberModal Component', () => {
    const mockOnClose = jest.fn();
    const mockOnAdd = jest.fn();
    const mockDate = new Date('2025-01-01T00:00:00.000Z');

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('renders modal inputs', () => {
        customRender(<AddMemberModal onClose={mockOnClose} onAdd={mockOnAdd} />);

        expect(screen.getByText('Add Member')).toBeInTheDocument();
        expect(screen.getByLabelText('Full name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email address')).toBeInTheDocument();
        expect(screen.getByLabelText('Projects count')).toBeInTheDocument();
        expect(screen.getByLabelText('Role')).toBeInTheDocument();
        expect(screen.getByLabelText('Access expiration date')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Add')).toBeInTheDocument();
    });

    test('updates inputs and submits form', () => {
        customRender(<AddMemberModal onClose={mockOnClose} onAdd={mockOnAdd} />);

        fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Projects count'), { target: { value: '5' } });
        fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'Viewer' } });
        fireEvent.change(screen.getByLabelText('Access expiration date'), { target: { value: '2025-02-01' } });

        fireEvent.click(screen.getByText('Add'));

        // Validate onAdd call
        expect(mockOnAdd).toHaveBeenCalledTimes(1);
        const addedMember = mockOnAdd.mock.calls[0][0];

        expect(addedMember).toEqual(expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com',
            projects: 5,
            roles: ['Viewer'],
            expirationDate: '2025-02-01',
            type: 'Member',
        }));

        // onClose should be called after successful add
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('does not submit when required fields are missing', () => {
        customRender(<AddMemberModal onClose={mockOnClose} onAdd={mockOnAdd} />);

        // Only fill name
        fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'John Doe' } });

        fireEvent.click(screen.getByText('Add'));

        expect(mockOnAdd).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    test('calls onClose when Cancel is clicked', () => {
        customRender(<AddMemberModal onClose={mockOnClose} onAdd={mockOnAdd} />);

        fireEvent.click(screen.getByText('Cancel'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
