import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoleDropdown from './RoleDropdown';
import '@testing-library/jest-dom';

describe('RoleDropdown Component', () => {
    test('renders with default text when no value selected', () => {
        render(<RoleDropdown value={[]} onChange={() => { }} />);
        expect(screen.getByText('Select roles')).toBeInTheDocument();
    });

    test('renders with selected values', () => {
        render(<RoleDropdown value={['Administrator']} onChange={() => { }} />);
        expect(screen.getByText('Administrator')).toBeInTheDocument();
    });

    test('opens dropdown on click', () => {
        render(<RoleDropdown value={[]} onChange={() => { }} />);
        const button = screen.getByText('Select roles');

        fireEvent.click(button);

        expect(screen.getByLabelText('Administrator')).toBeInTheDocument();
        expect(screen.getByLabelText('Developer')).toBeInTheDocument();
    });

    test('calls onChange when a role is toggled', () => {
        const onChangeMock = jest.fn();
        render(<RoleDropdown value={[]} onChange={onChangeMock} />);

        // Open dropdown
        fireEvent.click(screen.getByText('Select roles'));

        // Click Administrator option (input/label)
        const checkbox = screen.getByLabelText('Administrator');
        fireEvent.click(checkbox);

        // Verify onChange was called with the new value array
        expect(onChangeMock).toHaveBeenCalledWith(['Administrator']);
    });
});
