import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';

const EnableTerminalModal = ({ onConfirm, onClose }) => (
    <Dialog open onClose={onClose}>
        <DialogTitle>Registro Exitoso</DialogTitle>
        <DialogContent>
            <DialogContentText>
                El ciudadano ha sido registrado. 
                ¿Desea habilitar la terminal para la votación?
            </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose} color="inherit">Cancelar</Button>
            <Button onClick={onConfirm} variant="contained" autoFocus>
                Habilitar Terminal
            </Button>
        </DialogActions>
    </Dialog>
);

export default EnableTerminalModal;
