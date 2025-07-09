import React, { useState, useEffect } from 'react';
import {Box, Container, Typography, AppBar, Toolbar, IconButton, Tabs, Tab, Paper, Alert, CircularProgress, Chip } from '@mui/material';
import { ArrowBack, CheckCircle } from '@mui/icons-material';
import DepartmentStatistics from './DepartmentStatistics';
import PartyStatistics from './PartyStatistics';
import GeneralStatistics from './GeneralStatistics';
import DetailedStatistics from './DetailedStatistics';
import { API_ENDPOINTS, CURRENT_ELECTION_ID } from '../config';

const StatisticsDashboard = ({ onClose, isFinalResults = false }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [electionData, setElectionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchElectionData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_ENDPOINTS.ELECCIONES}/${CURRENT_ELECTION_ID}`);
                if (!response.ok) {
                    throw new Error('Error al obtener datos de la elección');
                }
                const data = await response.json();
                setElectionData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchElectionData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const tabs = [
        { label: 'Resumen General', component: GeneralStatistics },
        { label: 'Por Departamento', component: DepartmentStatistics },
        { label: 'Por Partido', component: PartyStatistics },
        { label: 'Análisis Detallado', component: DetailedStatistics }
    ];

    const CurrentComponent = tabs[currentTab].component;

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="#f5f5f5"
            >
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Cargando estadísticas...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <AppBar position="static" sx={{ 
                bgcolor: isFinalResults ? '#2e7d32' : '#25418E' // Verde para resultados finales
            }}>
                <Toolbar>
                    {onClose ? (
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={onClose}
                            sx={{ mr: 2 }}
                        >
                            <ArrowBack />
                        </IconButton>
                    ) : (
                        <CheckCircle sx={{ mr: 2, color: 'white' }} />
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {isFinalResults ? 'Resultados Finales de la Elección' : 'Estadísticas Electorales'}
                    </Typography>
                    {isFinalResults && (
                        <Chip
                            label="Votación Finalizada"
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                    )}
                    {electionData && !isFinalResults && (
                        <Typography variant="subtitle1">
                            {electionData.Nombre} - {new Date(electionData.Fecha).toLocaleDateString('es-UY')}
                        </Typography>
                    )}
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Banner de resultados finales */}
                {isFinalResults && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            🎉 Proceso de Votación Finalizado Exitosamente
                        </Typography>
                        <Typography variant="body2">
                            Los resultados mostrados a continuación son los resultados oficiales finales de la elección.
                            El proceso de votación ha sido cerrado permanentemente.
                        </Typography>
                    </Alert>
                )}

                {/* Información de la elección */}
                {electionData && (
                    <Paper sx={{ p: 3, mb: 3, bgcolor: 'white' }}>
                        <Typography variant="h5" gutterBottom>
                            {electionData.Nombre}
                            {isFinalResults && (
                                <Chip
                                    label="OFICIAL"
                                    color="success"
                                    size="small"
                                    sx={{ ml: 2 }}
                                />
                            )}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            <strong>Tipo:</strong> {electionData.TipoEleccion} | 
                            <strong> Estado:</strong> {isFinalResults ? 'Finalizada' : electionData.Estado} | 
                            <strong> Fecha:</strong> {new Date(electionData.Fecha).toLocaleDateString('es-UY')}
                            {isFinalResults && (
                                <>
                                    <br />
                                    <strong>Fecha de Cierre:</strong> {new Date().toLocaleString('es-UY')}
                                </>
                            )}
                        </Typography>
                    </Paper>
                )}

                {/* Navegación por pestañas */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs
                        value={currentTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        {tabs.map((tab, index) => (
                            <Tab key={index} label={tab.label} />
                        ))}
                    </Tabs>
                </Paper>

                {/* Contenido de la pestaña actual */}
                <CurrentComponent electionId={CURRENT_ELECTION_ID} />

                {/* Footer para resultados finales */}
                {isFinalResults && (
                    <Paper sx={{ p: 3, mt: 3, bgcolor: '#f0f8f0', textAlign: 'center' }}>
                        <Typography variant="h6" color="success.main" gutterBottom>
                            Mesa de Votación Cerrada Oficialmente
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Estos son los resultados oficiales y definitivos del proceso electoral.
                            <br />
                            Generado el {new Date().toLocaleString('es-UY')}
                        </Typography>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default StatisticsDashboard; 