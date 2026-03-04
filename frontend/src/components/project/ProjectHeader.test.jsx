import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectHeader from './ProjectHeader';

// Mock the useProject hook to provide a static project without async fetching
jest.mock('../../context/ProjectContext', () => {
    return {
        useProject: () => ({ project: { name: 'Test Project' }, loading: false }),
    };
});

describe('ProjectHeader Component', () => {
    test('renders headers and buttons', () => {
        render(<ProjectHeader count={5} onAdd={() => { }} />);
        expect(screen.getByText('Members (5)')).toBeInTheDocument();
        expect(screen.getByText('Add member')).toBeInTheDocument();
        expect(screen.getByText('Edit roles')).toBeInTheDocument();
    });

    test('calls onAdd when Add Member button is clicked', () => {
        const onAddMock = jest.fn();
        render(<ProjectHeader count={0} onAdd={onAddMock} />);
        const addButton = screen.getByText('Add member');
        fireEvent.click(addButton);
        expect(onAddMock).toHaveBeenCalled();
    });
});
