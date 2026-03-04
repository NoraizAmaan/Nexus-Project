import { screen, fireEvent, within } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import Users from './Users';
import { useAuth } from '../context/AuthContext';

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

// Mock DataGrid
jest.mock('@mui/x-data-grid', () => ({
    DataGrid: ({ rows, columns }) => (
        <div data-testid="data-grid">
            {rows.map(row => (
                <div key={row.id}>
                    {columns.map(col => (
                        <div key={col.field}>
                            {col.field === 'actions' && col.renderCell ? col.renderCell({ row }) : row[col.field]}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    ),
}));

describe('Users Page', () => {
    const mockDeleteUser = jest.fn();
    const mockUserAdmin = { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin' };
    const mockUserDev = { id: 2, name: 'Dev User', email: 'dev@example.com', role: 'Developer' };

    // We need a list of users
    const mockUsers = [
        mockUserAdmin,
        mockUserDev,
        { id: 3, name: 'Viewer User', email: 'viewer@example.com', role: 'Viewer' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock window.confirm
        window.confirm = jest.fn(() => true);
    });

    test('renders users list for Admin', () => {
        useAuth.mockReturnValue({
            user: mockUserAdmin,
            users: mockUsers,
            deleteUser: mockDeleteUser
        });

        customRender(<Users />);

        expect(screen.getByText('Users (Admin Only)')).toBeInTheDocument();

        // DataGrid renders rows. We can check for cell contents.
        // DataGrid virtualization might hide some rows, but with 3 rows and autoHeight it should render all.
        expect(screen.getByText('Admin User')).toBeInTheDocument();
        expect(screen.getByText('Dev User')).toBeInTheDocument();
        expect(screen.getByText('Viewer User')).toBeInTheDocument();
    });

    test('renders delete button only for Admin viewing other users', () => {
        useAuth.mockReturnValue({
            user: mockUserAdmin,
            users: mockUsers,
            deleteUser: mockDeleteUser
        });

        customRender(<Users />);

        // Admin should see Delete for Dev and Viewer, but NOT for Admin (themselves or other admins??)
        // Logic in Users.jsx: user.role === "Admin" && params.row.role !== "Admin"

        // So Admin row (id 1) -> No Delete
        // Dev row (id 2) -> Delete
        // Viewer row (id 3) -> Delete

        // We can find buttons by text 'Delete'.
        const deleteButtons = screen.getAllByText('Delete');
        expect(deleteButtons.length).toBeGreaterThanOrEqual(2);
    });

    test('calls deleteUser when delete button is clicked', () => {
        useAuth.mockReturnValue({
            user: mockUserAdmin,
            users: mockUsers,
            deleteUser: mockDeleteUser
        });

        customRender(<Users />);

        // Click the first delete button found (should be for Dev User or Viewer User)
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        expect(mockDeleteUser).toHaveBeenCalled();
        // We could check the ID if we knew which one was clicked. default order usually 2 or 3.
    });

    test('does not render delete buttons for Non-Admin viewer', () => {
        // Warning: Users.jsx says "Users (Admin Only)", but doesn't redirect if not admin?
        // It relies on the parent route protection or just renders the grid.
        // But the columns logic `user.role === "Admin"` hides actions.

        useAuth.mockReturnValue({
            user: mockUserDev, // Logged in as Developer
            users: mockUsers,
            deleteUser: mockDeleteUser
        });

        customRender(<Users />);

        expect(screen.getByText('Users (Admin Only)')).toBeInTheDocument(); // Title remains

        // Should find NO 'Delete' buttons
        expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });
});
