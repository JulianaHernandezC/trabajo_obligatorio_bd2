import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import escudoUruguayo from '../assets/escudoUruguayo.png';

const AppHeader = ({ children }) => (
    <AppBar position="static">
        <Toolbar>
            <Box
                component="img"
                src={escudoUruguayo}
                alt="Escudo de Uruguay"
                sx={{ height: 32, mr: 2 }}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                VotoElectrónico UY
            </Typography>
            {children}
        </Toolbar>
    </AppBar>
);

export default AppHeader;
