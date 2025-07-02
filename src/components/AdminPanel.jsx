import React, { useState } from 'react';
import {
    Modal,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Avatar,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const AdminPanel = ({ onRegistrationSuccess, onNotFound, onClose }) => {
    const [credencial, setCredencial] = useState('');
    const [citizen, setCitizen] = useState(null);
    const [isObserved, setIsObserved] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setCitizen(null);
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/api/ciudadanos/buscar?credencial=${credencial}`);
            if (!response.ok) {
                throw new Error('Ciudadano no encontrado');
            }
            const data = await response.json();
            setCitizen(data);
        } catch (err) {
            setError(err.message);
            onNotFound();
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!citizen) return;

        setIsRegistering(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/registrar-votante', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_ciudadano: citizen.id_ciudadano, id_eleccion: 1 }),
            });

            if (response.status === 409) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Este ciudadano ya ha sido registrado y no puede volver a votar.");
            }

            if (!response.ok) {
                throw new Error('Ocurrió un error al registrar al ciudadano.');
            }

            onRegistrationSuccess(isObserved);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <Modal open onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ p: 0, width: '100%', maxWidth: 500, m: 2, outline: 'none', borderRadius: 2 }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>Panel de Administración</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Busque al ciudadano por su credencial para registrar su participación.
                    </Typography>
                    <form onSubmit={handleSearch}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                fullWidth
                                id="credencial"
                                label="Buscar Credencial Cívica del Votante"
                                variant="outlined"
                                value={credencial}
                                onChange={(e) => setCredencial(e.target.value)}
                                disabled={isLoading}
                                placeholder="Ej: BBB456"
                            />
                            <Button type="submit" variant="contained" disabled={isLoading} sx={{ px: 4, height: '56px' }}>
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Buscar'}
                            </Button>
                        </Box>
                    </form>

                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                    {citizen && (
                        <Paper variant="outlined" sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{citizen.nombre} {citizen.apellido}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        CI: {citizen.ci} | Credencial: {citizen.credencial_civica}
                                    </Typography>
                                </Box>
                            </Box>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isObserved}
                                        onChange={(e) => setIsObserved(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Marcar como Voto Observado"
                                sx={{ mt: 1, width: '100%', ml: 0 }}
                            />
                        </Paper>
                    )}
                </Box>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
                    <Button onClick={onClose} variant="text" color="inherit">Cancelar</Button>
                    <Button onClick={handleRegister} variant="contained" color="success" disabled={!citizen || isRegistering}>
                        {isRegistering ? <CircularProgress size={24} color="inherit" /> : 'Registrar Voto'}
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default AdminPanel;
