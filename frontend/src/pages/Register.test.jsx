import { screen, fireEvent, waitFor } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import Register from './Register';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
}));

describe('Register Page', () => {
    const mockRegister = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({ register: mockRegister });
    });

    test('renders register form correctly', () => {
        customRender(<Register />);

        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByText('Full Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    test('validates name length', () => {
        customRender(<Register />);

        const nameInput = screen.getByPlaceholderText('Your full name');

        // Short name
        fireEvent.change(nameInput, { target: { value: 'Ab' } });
        expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument();

        // Valid name
        fireEvent.change(nameInput, { target: { value: 'Abc' } });
        expect(screen.queryByText('Name must be at least 3 characters')).not.toBeInTheDocument();
    });

    test('validates email format', () => {
        customRender(<Register />);

        const emailInput = screen.getByPlaceholderText('you@example.com');

        // Invalid email
        fireEvent.change(emailInput, { target: { value: 'invalid' } });
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();

        // Valid email
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(screen.queryByText('Invalid email format')).not.toBeInTheDocument();
    });

    test('validates password length', () => {
        customRender(<Register />);

        const passwordInput = screen.getByPlaceholderText('••••••••');

        // Short password
        fireEvent.change(passwordInput, { target: { value: '123' } });
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();

        // Valid password
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
    });

    test('disables register button if form is invalid', () => {
        customRender(<Register />);

        const registerButton = screen.getByRole('button', { name: /register/i });

        // Initially disabled
        expect(registerButton).toBeDisabled();

        // Fill valid data
        fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

        expect(registerButton).not.toBeDisabled();
    });

    test('toggles password visibility', () => {
        customRender(<Register />);

        const passwordInput = screen.getByPlaceholderText('••••••••');
        expect(passwordInput).toHaveAttribute('type', 'password');

        const toggle = passwordInput.nextSibling;
        fireEvent.click(toggle);

        expect(passwordInput).toHaveAttribute('type', 'text');

        fireEvent.click(toggle);
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('handles successful registration', async () => {
        mockRegister.mockResolvedValue({ success: true }); // Mock success object
        jest.useFakeTimers();

        customRender(<Register />);

        fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            });
            expect(screen.getByText(/User registered successfully/i)).toBeInTheDocument();
        });

        jest.runAllTimers();

        expect(mockNavigate).toHaveBeenCalledWith('/login');

        jest.useRealTimers();
    });

    test('handles failed registration', async () => {
        mockRegister.mockResolvedValue({ success: false, message: 'User already exists' }); // Mock failure object

        customRender(<Register />);

        fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalled();
            expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
        });
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
