import { screen, fireEvent } from '@testing-library/react';
import { customRender } from '../../utils/test-utils';
import ProjectTabs from './ProjectTabs';

describe('ProjectTabs Component', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all tabs', () => {
        customRender(<ProjectTabs active="All" onChange={mockOnChange} />);

        // The component appends 's' to each tab name
        expect(screen.getByText('Alls')).toBeInTheDocument();
        expect(screen.getByText('Members')).toBeInTheDocument();
        expect(screen.getByText('Groups')).toBeInTheDocument();
    });

    test('applies active style to selected tab', () => {
        customRender(<ProjectTabs active="Member" onChange={mockOnChange} />);

        const memberTab = screen.getByText('Members');
        const groupTab = screen.getByText('Groups');

        // Check for active class
        expect(memberTab).toHaveClass('border-indigo-600');
        expect(groupTab).not.toHaveClass('border-indigo-600');
    });

    test('calls onChange when a tab is clicked', () => {
        customRender(<ProjectTabs active="All" onChange={mockOnChange} />);

        fireEvent.click(screen.getByText('Groups'));
        expect(mockOnChange).toHaveBeenCalledWith('Group');
    });
});
