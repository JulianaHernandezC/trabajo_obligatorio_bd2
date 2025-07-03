import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';

const EnableTerminalModal = ({ onEnable, onClose }) => (
    <Dialog open onClose={onClose}>
        <DialogTitle>Registro Exi
            toso</DialogTitle>
        <DialogContent>
            <DialogContentText>
                El ciudadano ha sido registrado. ¿Desea habilitar la terminal para la votación?
            </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose} color="inherit">Cancelar</Button>
            <Button onClick={onEnable} variant="contained" autoFocus>
                Habilitar Terminal
            </Button>
        </DialogActions>
    </Dialog>
);

export default EnableTerminalModal;
