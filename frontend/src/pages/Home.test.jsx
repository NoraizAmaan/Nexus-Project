import { screen } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import Home from './Home';
import { useAuth } from '../context/AuthContext';

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

// Mock Link to render as anchor tag
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: ({ to, children, className }) => <a href={to} className={className}>{children}</a>
}));

describe('Home Page', () => {
    const mockUser = { name: 'Test User', email: 'test@example.com', role: 'UniqueRole' };
    const mockUsers = [
        { id: 1, role: 'Developer' },
        { id: 2, role: 'Developer' },
        { id: 3, role: 'Admin' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders hero section with user info', () => {
        useAuth.mockReturnValue({
            user: mockUser,
            users: mockUsers
        });

        customRender(<Home />);

        expect(screen.getByText(/Welcome to NEXUS Portal/i)).toBeInTheDocument();
        expect(screen.getByText(/Logged in as/i)).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getAllByText(/UniqueRole/).length).toBeGreaterThanOrEqual(1);
    });

    test('renders stats correctly', () => {
        useAuth.mockReturnValue({
            user: mockUser,
            users: mockUsers
        });

        customRender(<Home />);

        expect(screen.getByText('Active Users')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument(); // 3 mock users

        expect(screen.getByText('Roles Supported')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); // Developer, Admin

        expect(screen.getByText('System Status')).toBeInTheDocument();
        expect(screen.getByText('Operational')).toBeInTheDocument();
    });

    test('renders correct action cards for non-admin user', () => {
        useAuth.mockReturnValue({
            user: { ...mockUser, role: 'Developer' }, // Use Developer for this specific test
            users: mockUsers
        });

        customRender(<Home />);

        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Reports')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();

        // Should NOT show User Management
        expect(screen.queryByText('User Management')).not.toBeInTheDocument();
    });

    test('renders correct action cards for admin user', () => {
        useAuth.mockReturnValue({
            user: { ...mockUser, role: 'Admin' },
            users: mockUsers
        });

        customRender(<Home />);

        expect(screen.getByText('User Management')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Reports')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();
    });
});
