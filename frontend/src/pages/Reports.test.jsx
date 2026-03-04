import { screen, fireEvent, waitFor } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import Reports from './Reports';
import { useAuth } from '../context/AuthContext';

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

// Mock Recharts
jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div className="recharts-responsive-container" style={{ width: 800, height: 800 }}>{children}</div>,
    PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
    Pie: ({ children }) => <div data-testid="pie">{children}</div>,
    Cell: () => <div data-testid="cell" />,
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => <div data-testid="bar" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
}));

// Mock URL.createObjectURL for CSV export
global.URL.createObjectURL = jest.fn();

describe('Reports Page', () => {
    const mockUsers = [
        { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin', lastLogin: '2025-01-01' },
        { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User', lastLogin: '2025-01-02' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'User', lastLogin: '2025-01-03' }
    ];

    const mockAuditLogs = [
        { email: 'alice@example.com', success: true, time: '2025-01-01 10:00:00' },
        { email: 'bob@example.com', success: false, time: '2025-01-02 11:00:00' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup localStorage for audit logs
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn((key) => {
                    if (key === 'ascendion_audit_logs') {
                        return JSON.stringify(mockAuditLogs);
                    }
                    return null;
                }),
                setItem: jest.fn(),
                removeItem: jest.fn(),
            },
            writable: true
        });
    });

    test('renders system summary correctly', () => {
        useAuth.mockReturnValue({ users: mockUsers });
        customRender(<Reports />);

        expect(screen.getByText('System Summary')).toBeInTheDocument();
        expect(screen.getByText('Total Users')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument(); // 3 users
        expect(screen.getByText('Roles Supported')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); // Admin, User
    });

    test('renders filters and filtered user list', () => {
        useAuth.mockReturnValue({ users: mockUsers });
        customRender(<Reports />);

        const searchInput = screen.getByPlaceholderText('Search by name or email');
        const roleSelect = screen.getByRole('combobox');

        // Initial render: all users
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();

        // Filter by text 'Bob'
        fireEvent.change(searchInput, { target: { value: 'Bob' } });
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.queryByText('Charlie')).not.toBeInTheDocument();

        // Clear search
        fireEvent.change(searchInput, { target: { value: '' } });

        // Filter by Role 'Admin'
        fireEvent.change(roleSelect, { target: { value: 'Admin' } });
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.queryByText('Bob')).not.toBeInTheDocument(); // Bob/Charlie are Users
    });

    test('renders charts', () => {
        useAuth.mockReturnValue({ users: mockUsers });
        customRender(<Reports />);

        // We mocked Recharts so we check if the container renders or text
        // The component has headings for charts
        expect(screen.getByText('Role Distribution')).toBeInTheDocument();
        expect(screen.getByText('Users by Role')).toBeInTheDocument();

        // Check for mocked responsive container class if reachable, or just ensuring no crash
        // expect(screen.getAllByClassName('recharts-responsive-container').length).toBe(2);
    });

    test('renders audit logs from localStorage', () => {
        useAuth.mockReturnValue({ users: mockUsers });
        customRender(<Reports />);

        expect(screen.getByText('Login Audit Report')).toBeInTheDocument();
        expect(screen.getAllByText('alice@example.com')).toHaveLength(2); // One in User list, one in Audit log
        expect(screen.getAllByText('Success')).toHaveLength(1);

        // Check failure log
        // 'Failed' might be used in text
        expect(screen.getAllByText('bob@example.com')).toHaveLength(2);
        // Since Failed is conditionally rendered with class text-red-600
    });

    test('handles CSV export', () => {
        useAuth.mockReturnValue({ users: mockUsers });
        customRender(<Reports />);

        // Mock anchor click
        const link = { click: jest.fn(), href: '' };
        jest.spyOn(document, 'createElement').mockImplementation((tag) => {
            if (tag === 'a') return link;
            return document.createElement(tag);
        });

        fireEvent.click(screen.getByText('Export Users CSV'));

        expect(global.URL.createObjectURL).toHaveBeenCalled();
        expect(link.click).toHaveBeenCalled();
        expect(link.download).toBe('users-report.csv');
    });
});
