import { screen, fireEvent, waitFor } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import Login from './Login';
import { useAuth } from '../context/AuthContext';

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

describe('Login Page', () => {
    const mockLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        // Return object instead of boolean for new AuthContext logic
        useAuth.mockReturnValue({ login: mockLogin.mockResolvedValue({ success: false, message: 'Invalid credentials' }) });
    });

    test('renders login form correctly', () => {
        customRender(<Login />);

        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    });

    test('updates input fields', () => {
        customRender(<Login />);

        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('••••••••');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    test('validates email format', () => {
        customRender(<Login />);

        const emailInput = screen.getByPlaceholderText('you@example.com');

        // Invalid email
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();

        // Valid email
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(screen.queryByText('Invalid email format')).not.toBeInTheDocument();
    });

    test('validates password length', () => {
        customRender(<Login />);

        const passwordInput = screen.getByPlaceholderText('••••••••');

        // Short password
        fireEvent.change(passwordInput, { target: { value: '123' } });
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();

        // Valid password
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
    });

    test('disables login button if form is invalid', () => {
        customRender(<Login />);

        const loginButton = screen.getByRole('button', { name: /login/i });

        // Initially disabled (empty fields)
        expect(loginButton).toBeDisabled();

        // Fill valid data
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

        expect(loginButton).not.toBeDisabled();
    });

    test('toggles password visibility', () => {
        customRender(<Login />);

        const passwordInput = screen.getByPlaceholderText('••••••••');
        expect(passwordInput).toHaveAttribute('type', 'password');

        const toggle = passwordInput.nextSibling;
        fireEvent.click(toggle);

        expect(passwordInput).toHaveAttribute('type', 'text');

        fireEvent.click(toggle);
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('handles successful login', async () => {
        mockLogin.mockResolvedValue({ success: true }); // Login success
        jest.useFakeTimers();

        customRender(<Login />);

        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
        });

        jest.runAllTimers();
        expect(mockNavigate).toHaveBeenCalledWith('/');
        jest.useRealTimers();
    });

    test('handles failed login', async () => {
        mockLogin.mockResolvedValue({ success: false, message: 'Invalid credentials' }); // Login failed

        customRender(<Login />);

        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
            expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
        });
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
