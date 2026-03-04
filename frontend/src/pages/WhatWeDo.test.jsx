import { screen } from '@testing-library/react';
import { customRender } from '../utils/test-utils';
import WhatWeDo from './WhatWeDo';

// Mock Link to render as anchor tag
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: ({ to, children, className }) => <a href={to} className={className}>{children}</a>
}));

describe('WhatWeDo Page', () => {
    test('renders hero section correctly', () => {
        customRender(<WhatWeDo />);

        expect(screen.getByText('Empowering Productivity')).toBeInTheDocument();
        expect(screen.getByText('through Smart Management')).toBeInTheDocument();
        expect(screen.getByText('Our portal is designed to streamline your project workflows, enhance collaboration, and provide deep insights into your team\'s performance.')).toBeInTheDocument();
        expect(screen.getByText('Get Started Now')).toBeInTheDocument();
    });

    test('renders all feature sections', () => {
        customRender(<WhatWeDo />);

        expect(screen.getByText('Comprehensive User Management')).toBeInTheDocument();
        expect(screen.getByText('Dynamic Project Tracking')).toBeInTheDocument();
        expect(screen.getByText('Intelligent Reporting')).toBeInTheDocument();
        expect(screen.getByText('Integrated Help Center')).toBeInTheDocument();
    });

    test('renders CTA section', () => {
        customRender(<WhatWeDo />);

        expect(screen.getByText('Ready to optimize your workflow?')).toBeInTheDocument();
        // home.getStarted is "Get Started" in en.json
        expect(screen.getByText('Get Started')).toBeInTheDocument();
    });
});
