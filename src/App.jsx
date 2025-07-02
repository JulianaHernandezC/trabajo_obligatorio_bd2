import React, { useState, useCallback } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import LockedScreen from './components/LockedScreen';
import PresidentLoginModal from './components/PresidentLoginModal';
import AdminPanel from './components/AdminPanel';

const theme = createTheme({
    palette: {
        primary: {
            main: '#25418E',
        },
        secondary: {
            main: '#FFD500',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

export default function App() {
    const [appState, setAppState] = useState('locked');
    const [isObserved, setIsObserved] = useState(false);

    const resetToLocked = useCallback(() => {
        setAppState('locked');
        setIsObserved(false);
    }, []);

    const handleRegistrationSuccess = (observed) => {
        setIsObserved(observed);
        setAppState('confirmEnable');
    };

    const handleVote = async (payload) => {
        try {
            const response = await fetch('http://localhost:3001/api/votar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error('Error al emitir el voto');
            }
            setAppState('success');
            setTimeout(resetToLocked, 4000);
        } catch (error) {
            alert(error.message);
            setAppState('voting');
        }
    };

    const renderState = () => {
        switch (appState) {
            case 'locked':
                return <LockedScreen onAdminAccess={() => setAppState('presidentLogin')} />;
            case 'presidentLogin':
                return (
                    <PresidentLoginModal
                        onSuccess={() => setAppState('admin')}
                        onClose={resetToLocked}
                    />
                );
            case 'admin':
                return (
                    <AdminPanel
                        onRegistrationSuccess={handleRegistrationSuccess}
                        onNotFound={() => {}}
                        onClose={resetToLocked}
                    />
                );
            default:
                return <LockedScreen onAdminAccess={() => setAppState('admin')} />;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {renderState()}
        </ThemeProvider>
    );
}
