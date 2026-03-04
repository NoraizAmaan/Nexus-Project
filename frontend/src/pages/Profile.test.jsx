import { screen, fireEvent } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import Profile from './Profile';
import { useAuth } from '../context/AuthContext';

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

describe('Profile Page', () => {
    const mockLogout = jest.fn();
    const mockUser = {
        name: 'Test Administrator',
        email: 'admin@example.com',
        role: 'Admin'
    };
    const mockUsers = [
        { id: 1 }, { id: 2 }, { id: 3 }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders profile info correctly for Admin', () => {
        useAuth.mockReturnValue({
            user: mockUser,
            users: mockUsers,
            logout: mockLogout
        });

        customRender(<Profile />);

        expect(screen.getByText('My Profile')).toBeInTheDocument();
        expect(screen.getByText('Test Administrator')).toBeInTheDocument();
        expect(screen.getByText('admin@example.com')).toBeInTheDocument();
        expect(screen.getAllByText('Admin')).toHaveLength(2);

        // Admin Stats should be visible
        expect(screen.getByText('Admin Overview')).toBeInTheDocument();
        expect(screen.getByText(/You are managing 3 active users across the platform/)).toBeInTheDocument();
    });

    test('renders profile info correctly for Non-Admin', () => {
        useAuth.mockReturnValue({
            user: { ...mockUser, role: 'Developer', name: 'Dev User' },
            users: mockUsers,
            logout: mockLogout
        });

        customRender(<Profile />);

        expect(screen.getByText('Dev User')).toBeInTheDocument();
        expect(screen.getAllByText(/Developer/)).toHaveLength(2);

        // Admin Stats should NOT be visible
        expect(screen.queryByText('Admin Statistics')).not.toBeInTheDocument();
    });

    test('renders no active session message if user is null', () => {
        useAuth.mockReturnValue({
            user: null,
            users: [],
            logout: mockLogout
        });

        customRender(<Profile />);

        expect(screen.getByText('No active session')).toBeInTheDocument();
    });

    test('calls logout on button click', () => {
        useAuth.mockReturnValue({
            user: mockUser,
            users: mockUsers,
            logout: mockLogout
        });

        customRender(<Profile />);

        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);

        expect(mockLogout).toHaveBeenCalled();
    });
});
