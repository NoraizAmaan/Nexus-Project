import { screen, fireEvent } from '@testing-library/react';
import { customRender } from '../../utils/test-utils';
import MembersToolbar from './MembersToolbar';

describe('MembersToolbar Component', () => {
    const mockSetSearch = jest.fn();
    const mockSetRoleFilter = jest.fn();
    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders search and filter inputs', () => {
        customRender(
            <MembersToolbar
                selectedCount={0}
                onDelete={mockOnDelete}
                search=""
                setSearch={mockSetSearch}
                roleFilter=""
                setRoleFilter={mockSetRoleFilter}
            />
        );

        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument(); // Role select
    });

    test('handles search input change', () => {
        customRender(
            <MembersToolbar
                selectedCount={0}
                onDelete={mockOnDelete}
                search=""
                setSearch={mockSetSearch}
                roleFilter=""
                setRoleFilter={mockSetRoleFilter}
            />
        );

        const searchInput = screen.getByPlaceholderText('Search');
        fireEvent.change(searchInput, { target: { value: 'Alice' } });
        expect(mockSetSearch).toHaveBeenCalledWith('Alice');
    });

    test('handles role filter change', () => {
        customRender(
            <MembersToolbar
                selectedCount={0}
                onDelete={mockOnDelete}
                search=""
                setSearch={mockSetSearch}
                roleFilter=""
                setRoleFilter={mockSetRoleFilter}
            />
        );

        const roleSelect = screen.getByRole('combobox');
        fireEvent.change(roleSelect, { target: { value: 'Developer' } });
        expect(mockSetRoleFilter).toHaveBeenCalledWith('Developer');
    });

    test('shows delete button only when items are selected', () => {
        const { rerender } = customRender(
            <MembersToolbar
                selectedCount={0}
                onDelete={mockOnDelete}
                search=""
                setSearch={mockSetSearch}
                roleFilter=""
                setRoleFilter={mockSetRoleFilter}
            />
        );

        expect(screen.queryByText(/Delete/)).not.toBeInTheDocument();

        rerender(
            <MembersToolbar
                selectedCount={2}
                onDelete={mockOnDelete}
                search=""
                setSearch={mockSetSearch}
                roleFilter=""
                setRoleFilter={mockSetRoleFilter}
            />
        );

        expect(screen.getByText('Delete (2)')).toBeInTheDocument();
    });

    test('calls onDelete when delete button is clicked', () => {
        customRender(
            <MembersToolbar
                selectedCount={1}
                onDelete={mockOnDelete}
                search=""
                setSearch={mockSetSearch}
                roleFilter=""
                setRoleFilter={mockSetRoleFilter}
            />
        );

        fireEvent.click(screen.getByText(/Delete/));
        expect(mockOnDelete).toHaveBeenCalled();
    });
});
