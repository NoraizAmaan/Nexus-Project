import React from 'react';
import { render, screen } from '../utils/test-utils';
import Layout from './Layout';
import '@testing-library/jest-dom';

// Mock Navbar to isolate Layout testing
jest.mock('./Navbar', () => () => <div data-testid="navbar">Mock Navbar</div>);

describe('Layout Component', () => {
    test('renders navbar', () => {
        render(<Layout />);
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    test('renders main content area', () => {
        // Layout renders Outlet. We need to test if it renders children properly?
        // But Outlet is from react-router.
        // test-utils usually wraps in Router.
        // We can't easily test Outlet without configuring nested routes in test.
        // However, we can check basic structure like main tag.
        render(<Layout />);
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
        expect(main).toHaveClass('min-h-screen');
    });

    test('renders footer content', () => {
        render(<Layout />);

        // Footer texts
        expect(screen.getByText('NEXUS', { selector: 'h3' })).toBeInTheDocument();
        expect(screen.getByText('Enterprise role-based access management')).toBeInTheDocument();

        // Quick Links
        expect(screen.getByText('Quick Links')).toBeInTheDocument();
        expect(screen.getByText('Dashboard', { selector: 'a' })).toBeInTheDocument();
        expect(screen.getByText('Users', { selector: 'a' })).toBeInTheDocument();
        expect(screen.getByText('Profile', { selector: 'a' })).toBeInTheDocument();

        // Contact
        expect(screen.getByText('Contact')).toBeInTheDocument();
        expect(screen.getByText('support@nexus.com')).toBeInTheDocument();

        // Copyright
        expect(screen.getByText(/© 2026 NEXUS/)).toBeInTheDocument();
    });
});
