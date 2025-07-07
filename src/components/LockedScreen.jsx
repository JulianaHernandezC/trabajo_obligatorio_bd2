import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Person } from '@mui/icons-material';
import AppHeader from './AppHeader'; // Importa el encabezado
import escudoUruguayo from '../assets/escudoUruguayo.png';

const LockedScreen = ({ onAdminAccess }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
            <AppHeader>
                <Button
                    variant="contained"
                    startIcon={<Person />}
                    onClick={onAdminAccess}
                    sx={{
                        bgcolor: 'secondary.main',
                        color: 'primary.main',
                        '&:hover': {
                            bgcolor: 'secondary.dark',
                        },
                    }}
                >
                    Presidente de Mesa
                </Button>
            </AppHeader>
            <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 3, width: '100%' }}>
                <Box
                    component="img"
                    src={escudoUruguayo}
                    alt="Escudo de Uruguay"
                    sx={{
                        width: { xs: '45%', sm: '30%', md: 192 },
                        maxWidth: 192,
                        height: 'auto',
                        mb: 4,
                    }}
                />
                <Typography variant="h3" component="h2" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Sistema de Votación
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Esperando al próximo elector.
                </Typography>
            </Box>
        </Box>
    );
};

export default LockedScreen;
