import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const AppHeader = ({ children }) => (
    <AppBar position="static">
        <Toolbar>
            <Box
                component="img"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Coat_of_arms_of_Uruguay.svg/1200px-Coat_of_arms_of_Uruguay.svg.png"
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
