import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';
import '@testing-library/jest-dom';

describe('Pagination Component', () => {
    test('renders nothing if totalPages is 1 or less', () => {
        const { container } = render(<Pagination page={1} totalPages={1} setPage={() => { }} />);
        expect(container.firstChild).toBeNull();
    });

    test('renders correct number of buttons', () => {
        render(<Pagination page={1} totalPages={3} setPage={() => { }} />);
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);
        expect(buttons[0]).toHaveTextContent('1');
        expect(buttons[1]).toHaveTextContent('2');
        expect(buttons[2]).toHaveTextContent('3');
    });

    test('calls setPage when a button is clicked', () => {
        const setPageMock = jest.fn();
        render(<Pagination page={1} totalPages={3} setPage={setPageMock} />);

        const button2 = screen.getByText('2');
        fireEvent.click(button2);

        expect(setPageMock).toHaveBeenCalledWith(2);
    });

    test('highlights the current page', () => {
        render(<Pagination page={2} totalPages={3} setPage={() => { }} />);

        const button2 = screen.getByText('2');
        expect(button2).toHaveClass('bg-indigo-600');
        expect(button2).toHaveClass('text-white');

        const button1 = screen.getByText('1');
        expect(button1).not.toHaveClass('bg-indigo-600');
    });
});
