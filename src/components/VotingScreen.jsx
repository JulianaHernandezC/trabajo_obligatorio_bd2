import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button
} from '@mui/material';
import AppHeader from './AppHeader';

const VotingScreen = ({ onVote, isObserved }) => {
    const [listas, setListas] = useState([]);
    const [papeletas, setPapeletas] = useState([]);
    const [selection, setSelection] = useState(null);
    const ELECTION_ID = 1;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [listasRes, papeletasRes] = await Promise.all([
                    fetch(`http://localhost:3001/api/listas?eleccion_id=${ELECTION_ID}`),
                    fetch(`http://localhost:3001/api/papeletas`)
                ]);
                setListas(await listasRes.json());
                setPapeletas(await papeletasRes.json());
            } catch (error) {
                console.error("Error fetching voting options:", error);
            }
        };
        fetchData();
    }, []);

    const handleSelect = (type, id) => {
        setSelection({ type, id });
    };

    const handleSubmitVote = () => {
        if (!selection) return;
        const payload = {
            id_eleccion: ELECTION_ID,
            id_establecimiento: 1, // Esto debería ser dinámico en una aplicación real
            observado: isObserved,
            id_lista: selection.type === 'lista' ? selection.id : null,
            id_papeleta: selection.type === 'papeleta' ? selection.id : null,
        };
        onVote(payload);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppHeader>
                {isObserved && <Typography variant="button" sx={{ bgcolor: 'secondary.main', color: 'black', px: 2, py: 0.5, borderRadius: 4 }}>VOTO OBSERVADO</Typography>}
            </AppHeader>
            <Container component="main" sx={{ py: 4, flexGrow: 1 }}>
                <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                    EMITA SU VOTO
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Seleccione una única opción.
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {[...listas, ...papeletas].map((option) => {
                        const isLista = !!option.partido_nombre;
                        const type = isLista ? 'lista' : 'papeleta';
                        const id = isLista ? option.id_lista : option.id_papeleta;
                        const isSelected = selection?.type === type && selection?.id === id;

                        return (
                            <Grid item xs={12} sm={6} md={4} key={`${type}-${id}`}>
                                <Paper
                                    onClick={() => handleSelect(type, id)}
                                    variant="outlined"
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        borderColor: isSelected ? 'primary.main' : 'divider',
                                        borderWidth: 2,
                                        transform: isSelected ? 'scale(1.05)' : 'none',
                                        transition: 'all 0.2s ease-in-out',
                                        bgcolor: isSelected ? 'primary.light' : 'background.paper',
                                    }}
                                >
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {isLista ? `Lista ${option.numero}` : option.nombre_opcion}
                                    </Typography>
                                    {isLista && <Typography color="text.secondary">{option.partido_nombre}</Typography>}
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
                <Box sx={{ mt: 5, textAlign: 'center' }}>
                    <Button
                        onClick={handleSubmitVote}
                        disabled={!selection}
                        variant="contained"
                        size="large"
                        sx={{ fontSize: '1.2rem', px: 8, py: 1.5 }}
                    >
                        Emitir Voto
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default VotingScreen;
