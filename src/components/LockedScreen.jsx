import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AppHeader from './AppHeader'; // Importa el encabezado

const LockedScreen = ({ onAdminAccess }) => {
    const [clickCount, setClickCount] = useState(0);

    const handleIconClick = () => {
        const newCount = clickCount + 1;
        if (newCount >= 5) {
            onAdminAccess();
            setClickCount(0);
        } else {
            setClickCount(newCount);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
            <AppHeader />
            <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 3, width: '100%' }}>
                <Box
                    component="img"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Coat_of_arms_of_Uruguay.svg/1200px-Coat_of_arms_of_Uruguay.svg.png"
                    alt="Escudo de Uruguay"
                    sx={{
                        width: { xs: '45%', sm: '30%', md: 192 },
                        maxWidth: 192,
                        height: 'auto',
                        mb: 4,
                        cursor: 'pointer'
                    }}
                    onClick={handleIconClick}
                />
                <Typography variant="h3" component="h2" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Sistema de Votación
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Esperando al próximo elector.
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mt: 4 }}>
                    El presidente de mesa debe habilitar el sistema.
                </Typography>
            </Box>
        </Box>
    );
};

export default LockedScreen;
