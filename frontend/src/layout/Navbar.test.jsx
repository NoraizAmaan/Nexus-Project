import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import Navbar from './Navbar';
import '@testing-library/jest-dom';

// Mock useAuth
jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: { name: 'Test User', email: 't@a.com', role: 'Admin' },
        logout: jest.fn(),
    }),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

describe('Navbar Component', () => {
    test('renders logo and navigation links', () => {
        customRender(<Navbar />);
        const logo = screen.getByAltText('Nexus');
        expect(logo).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('What we do')).toBeInTheDocument();
        expect(screen.getByText('Reports')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
    });
});
