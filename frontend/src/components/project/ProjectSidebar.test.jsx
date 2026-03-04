import { screen } from '@testing-library/react';
import { customRender } from '../../utils/test-utils';
import ProjectSidebar from './ProjectSidebar';
import { useProject } from '../../context/ProjectContext';
import { useLocation } from 'react-router-dom';

// Mock Dependencies
jest.mock('../../context/ProjectContext', () => ({
    useProject: jest.fn(),
    ProjectProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}));

describe('ProjectSidebar Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useLocation.mockReturnValue({ pathname: '/project-overview' });
    });

    test('renders project name correctly', () => {
        useProject.mockReturnValue({ project: { name: 'Alpha Project' } });

        customRender(<ProjectSidebar />);

        expect(screen.getByText('Alpha Project')).toBeInTheDocument();
        expect(screen.getByText('Software Project')).toBeInTheDocument();
    });

    test('renders default project name if none provided', () => {
        useProject.mockReturnValue({ project: null });

        customRender(<ProjectSidebar />);

        expect(screen.getByText('Project 007')).toBeInTheDocument();
    });

    test('renders all navigation links', () => {
        useProject.mockReturnValue({ project: { name: 'Alpha' } });
        customRender(<ProjectSidebar />);

        const links = [
            'My Projects',
            'Overview',
            'Roadmap',
            'Documents',
            'Members',
            'Settings'
        ];

        links.forEach(linkText => {
            expect(screen.getByText(linkText)).toBeInTheDocument();
        });
    });

    test('applies active styles to the current route link', () => {
        useProject.mockReturnValue({ project: { name: 'Alpha' } });
        useLocation.mockReturnValue({ pathname: '/project-overview' }); // Simulate /project-overview route

        customRender(<ProjectSidebar />);

        // The "Overview" link should be active
        const overviewLink = screen.getByText('Overview').closest('a');
        expect(overviewLink).toHaveClass('bg-indigo-50'); // Check for active class (light mode)

        // The "Members" link should NOT be active
        const membersLink = screen.getByText('Members').closest('a');
        expect(membersLink).not.toHaveClass('bg-indigo-50');
    });

    test('applies desktop layout styles by default', () => {
        useProject.mockReturnValue({ project: { name: 'Alpha' } });

        customRender(<ProjectSidebar />);
        // Desktop variant has w-64
        expect(screen.getByTestId('project-sidebar')).toHaveClass('w-64');
    });

    test('applies mobile layout styles when variant is "mobile"', () => {
        useProject.mockReturnValue({ project: { name: 'Alpha' } });

        customRender(<ProjectSidebar variant="mobile" />);
        // Mobile variant has w-full
        expect(screen.getByTestId('project-sidebar')).toHaveClass('w-full');
    });
});
