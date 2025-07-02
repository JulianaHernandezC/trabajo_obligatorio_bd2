import React, { useState } from 'react';
import {
    Button,
    TextField,
    Alert,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

const PresidentLoginModal = ({ onSuccess, onClose }) => {
    const [credencial, setCredencial] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleValidate = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:3001/api/autoridades/validar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credencial_civica: credencial }),
            });

            if (!response.ok) {
                let errorMsg = 'Credencial inválida o error del servidor.';
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                }
                throw new Error(errorMsg);
            }

            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open onClose={onClose} PaperProps={{ component: 'form', onSubmit: (e) => { e.preventDefault(); handleValidate(); } }}>
            <DialogTitle>Acceso de Administrador</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    Por favor, ingrese la credencial del Presidente de Mesa para continuar.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="president-credential"
                    label="Credencial Cívica del Presidente"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={credencial}
                    onChange={(e) => setCredencial(e.target.value)}
                    disabled={isLoading}
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Validar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PresidentLoginModal;
