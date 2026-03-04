import { screen, fireEvent } from '@testing-library/react';
import { customRender } from '../../utils/test-utils';
import MembersTable from './MembersTable';

const mockMembers = [
    {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        projects: 2,
        expiresIn: 'In 12 months',
        roles: ['admin'],
        expirationDate: '2025-01-01',
    },
    {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        projects: 1,
        expiresIn: 'In 2 years',
        roles: ['editor'],
        expirationDate: '2026-05-20',
    },
];

describe('MembersTable Component', () => {
    const mockSetSelected = jest.fn();
    const mockOnUpdate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders members correctly', () => {
        customRender(
            <MembersTable
                members={mockMembers}
                selected={[]}
                setSelected={mockSetSelected}
                onUpdate={mockOnUpdate}
            />
        );

        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
        expect(screen.getByText('alice@example.com')).toBeInTheDocument();
        expect(screen.getByText('Bob Smith')).toBeInTheDocument();
        expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });

    test('handles individual row selection', () => {
        customRender(
            <MembersTable
                members={mockMembers}
                selected={['1']}
                setSelected={mockSetSelected}
                onUpdate={mockOnUpdate}
            />
        );

        const checkboxes = screen.getAllByRole('checkbox');
        // Index 0: Select All, Index 1: Alice (checked), Index 2: Bob (unchecked)

        expect(checkboxes[1]).toBeChecked();
        expect(checkboxes[2]).not.toBeChecked();

        // Click Bob's checkbox
        fireEvent.click(checkboxes[2]);
        expect(mockSetSelected).toHaveBeenCalledTimes(1);
    });

    test('handles select all', () => {
        customRender(
            <MembersTable
                members={mockMembers}
                selected={[]}
                setSelected={mockSetSelected}
                onUpdate={mockOnUpdate}
            />
        );

        const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(selectAllCheckbox);

        // Expect all IDs to be selected
        expect(mockSetSelected).toHaveBeenCalledWith(['1', '2']);
    });

    test('handles date change', () => {
        customRender(
            <MembersTable
                members={mockMembers}
                selected={[]}
                setSelected={mockSetSelected}
                onUpdate={mockOnUpdate}
            />
        );

        // Find date input for the first row
        const aliceDateInput = screen.getByDisplayValue('2025-01-01');
        fireEvent.change(aliceDateInput, { target: { value: '2025-02-01' } });

        expect(mockOnUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
            expirationDate: '2025-02-01'
        }));
    });
});
