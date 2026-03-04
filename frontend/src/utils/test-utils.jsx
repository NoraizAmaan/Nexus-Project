import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProjectProvider } from '../context/ProjectContext';
import { ThemeProvider } from '../context/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n'; // or i18n from setupTests? Actually setupTests initializes the global one.

const AllTheProviders = ({ children }) => {
    return (
        <MemoryRouter>
            <I18nextProvider i18n={i18n}>
                <AuthProvider>
                    <ProjectProvider disableAutoFetch={true}>
                        <ThemeProvider>
                            {children}
                        </ThemeProvider>
                    </ProjectProvider>
                </AuthProvider>
            </I18nextProvider>
        </MemoryRouter>
    );
};

const customRender = (ui, options) =>
    render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender, customRender as render };
