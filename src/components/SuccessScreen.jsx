import React from 'react';
import { Box, Typography } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AppHeader from './AppHeader';

const SuccessScreen = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
        <AppHeader />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 3, width: '100%' }}>
            <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'secondary.main', borderRadius: '50%', mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WbSunnyIcon sx={{ fontSize: { xs: 50, md: 60 }, color: 'black' }} />
            </Box>
            <Typography variant="h3" component="h1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                ¡Gracias!
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mt: 1 }}>
                Su voto ha sido emitido.
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 6 }}>
                La terminal se bloqueará en breve...
            </Typography>
        </Box>
    </Box>
);

export default SuccessScreen;
