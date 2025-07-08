import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button} from '@mui/material';
import { HowToVote, CheckCircle } from '@mui/icons-material';
import AppHeader from './AppHeader';
import { API_ENDPOINTS, CURRENT_ELECTION_ID, CURRENT_ESTABLECIMIENTO_ID } from '../config';

const VotingScreen = ({ onVote, isObserved }) => {
    const [listas, setListas] = useState([]);
    const [selectedVote, setSelectedVote] = useState('');

    const votosEspeciales = [
        { id: 'blanco', nombre: 'Voto en Blanco' },
        { id: 'anulado', nombre: 'Voto Anulado' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listasRes = await fetch(`${API_ENDPOINTS.LISTAS}?eleccion_id=${CURRENT_ELECTION_ID}`);
                setListas(await listasRes.json());
            } catch (error) {
                console.error("Error fetching voting options:", error);
            }
        };
        fetchData();
    }, []);

    const handleSubmitVote = () => {
        if (!selectedVote) return;
        
        const [type, id] = selectedVote.split('-');
        const payload = {
            id_eleccion: CURRENT_ELECTION_ID,
            id_establecimiento: CURRENT_ESTABLECIMIENTO_ID,
            id_lista: type === 'lista' ? parseInt(id) : null,
            voto_en_blanco: type === 'especial' && id === 'blanco',
            voto_anulado: type === 'especial' && id === 'anulado'
        };
        onVote(payload);
    };

    const handleVoteSelection = (value) => {
        if (selectedVote === value) {
            setSelectedVote('');
        } else {
            setSelectedVote(value);
        }
    };

    const getPartyColor = (partidoNombre) => {
        const colors = {
            'Frente Amplio': '#ffebee',
            'Partido Nacional': '#e3f2fd', 
            'Partido Colorado': '#fce4ec',
            'Cabildo Abierto': '#fff3e0',
            'Partido Independiente': '#f3e5f5',
            'Identidad Soberana': '#f1f8e9',
            'Partido de la Gente': '#e8f5e8'
        };
        return colors[partidoNombre] || '#f5f5f5';
    };

    const getSelectedOption = () => {
        if (!selectedVote) return '';
        const [type, id] = selectedVote.split('-');
        
        if (type === 'lista') {
            const lista = listas.find(l => (l.id_Lista || l.id_lista) === parseInt(id));
            return lista ? `Lista ${lista.Numero || lista.numero}` : '';
        } else if (type === 'especial') {
            const voto = votosEspeciales.find(v => v.id === id);
            return voto ? voto.nombre : '';
        }
        return '';
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            height: '100vh',
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <AppHeader>
                {isObserved && (
                    <Typography 
                        variant="button" 
                        sx={{ 
                            bgcolor: 'secondary.main', 
                            color: 'primary.main', 
                            px: 2, 
                            py: 0.5, 
                            borderRadius: 4,
                            fontWeight: 'bold'
                        }}
                    >
                        VOTO OBSERVADO
                    </Typography>
                )}
            </AppHeader>

            <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'auto',
                bgcolor: 'white',
                py: { xs: 2, md: 3 },
                px: { xs: 1, md: 2 }
            }}>
                <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <HowToVote sx={{ fontSize: { xs: 32, md: 40 }, color: 'primary.main' }} />
                        <Typography 
                            variant="h2" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 'bold', 
                                color: 'primary.main',
                                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
                            }}
                        >
                            EMITA SU VOTO
                        </Typography>
                    </Box>
                    <Typography 
                        variant="h5" 
                        color="text.secondary" 
                        sx={{ 
                            fontWeight: 500, 
                            mb: 2,
                            fontSize: { xs: '1rem', md: '1.5rem' }
                        }}
                    >
                        Seleccione una única opción
                    </Typography>
                    <Box 
                        sx={{ 
                            width: 96, 
                            height: 4, 
                            bgcolor: 'secondary.main', 
                            mx: 'auto', 
                            borderRadius: 2 
                        }} 
                    />
                </Box>

                <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ flexGrow: 1, mb: { xs: 3, md: 4 } }}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: { xs: 2, md: 3 }, 
                            justifyContent: 'center',
                            alignItems: 'flex-start'
                        }}>
                            {listas.map((lista) => {
                                const id = lista.id_Lista || lista.id_lista;
                                const numero = lista.Numero || lista.numero;
                                const partido = lista.partido_nombre;
                                const value = `lista-${id}`;
                                const isSelected = selectedVote === value;

                                return (
                                    <Card
                                        key={id}
                                        onClick={() => handleVoteSelection(value)}
                                        sx={{
                                            width: 200,
                                            height: 140,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                            boxShadow: isSelected ? 8 : 2,
                                            border: 3,
                                            borderColor: isSelected ? 'primary.main' : '#e0e0e0',
                                            borderRadius: 3,
                                            bgcolor: 'white',
                                            position: 'relative'
                                        }}
                                    >
                                        <CardContent sx={{ 
                                            p: { xs: 1.5, md: 2 }, 
                                            height: '100%', 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            pt: { xs: 2, md: 2.5 }
                                        }}>
                                            <Box 
                                                sx={{ 
                                                    width: '100%', 
                                                    height: { xs: 8, md: 10 }, 
                                                    bgcolor: getPartyColor(partido), 
                                                    borderRadius: 2, 
                                                    mb: 2
                                                }} 
                                            />
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 'bold', 
                                                    color: 'primary.main', 
                                                    mb: 1,
                                                    fontSize: { xs: '1rem', md: '1.1rem' }
                                                }}
                                            >
                                                Lista {numero}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ 
                                                    lineHeight: 1.3,
                                                    fontSize: { xs: '0.75rem', md: '0.8rem' },
                                                    flexGrow: 1,
                                                    fontWeight: 'normal'
                                                }}
                                            >
                                                {partido}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    </Box>

 
                    <Box sx={{ mb: { xs: 3, md: 4 } }}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: { xs: 2, md: 3 }, 
                            justifyContent: 'center',
                            alignItems: 'flex-start'
                        }}>
                            {votosEspeciales.map((voto) => {
                                const value = `especial-${voto.id}`;
                                const isSelected = selectedVote === value;

                                return (
                                    <Card
                                        key={voto.id}
                                        onClick={() => handleVoteSelection(value)}
                                        sx={{
                                            width: 200,
                                            height: 120,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                            boxShadow: isSelected ? 8 : 2,
                                            border: 3,
                                            borderColor: isSelected ? 'primary.main' : '#e0e0e0',
                                            borderRadius: 3,
                                            bgcolor: 'white',
                                            position: 'relative',
                                            
                                        }}
                                    >
                                        <CardContent sx={{ 
                                            p: { xs: 2, md: 2.5 },
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}>
                                            <Box 
                                                sx={{ 
                                                    width: '100%', 
                                                    height: { xs: 8, md: 10 }, 
                                                    bgcolor: '#f5f5f5', 
                                                    borderRadius: 2, 
                                                    mb: 2
                                                }} 
                                            />
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 'bold', 
                                                    color: 'primary.main',
                                                    fontSize: { xs: '1rem', md: '1.1rem' },
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {voto.nombre}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* Submit Button */}
                    <Box sx={{ textAlign: 'center', pb: { xs: 2, md: 3 } }}>
                        <Button
                            onClick={handleSubmitVote}
                            disabled={!selectedVote}
                            variant="contained"
                            size="large"
                            startIcon={<HowToVote />}
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                px: { xs: 2, md: 4 },
                                py: { xs: 1.5, md: 2 },
                                fontSize: { xs: '1rem', md: '1rem' },
                                fontWeight: 'bold',
                                borderRadius: 2,
                                boxShadow: 4,
                                '&:disabled': {
                                    opacity: 0.5,
                                    cursor: 'not-allowed'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            EMITIR VOTO
                        </Button>
                        {selectedVote && (
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                    mt: 2,
                                    fontSize: { xs: '0.75rem', md: '0.875rem' }
                                }}
                            >
                                Opción seleccionada:{' '}
                                <Box 
                                    component="span" 
                                    sx={{ 
                                        fontWeight: 'bold', 
                                        color: 'primary.main' 
                                    }}
                                >
                                    {getSelectedOption()}
                                </Box>
                            </Typography>
                        )}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default VotingScreen;
