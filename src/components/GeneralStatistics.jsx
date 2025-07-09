import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { BarChart, PieChart } from '@mui/icons-material';
import { API_ENDPOINTS } from '../config';

const GeneralStatistics = ({ electionId }) => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.RESUMEN_COMPLETO(electionId));
                if (!response.ok) {
                    throw new Error('Error al obtener estadísticas');
                }
                const data = await response.json();
                setStatistics(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [electionId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 3 }}>
                {error}
            </Alert>
        );
    }

    const { resumen_general, votos_especiales, estadisticas_partidos, estadisticas_departamentos } = statistics;

    return (
        <Box>
            {/* Resumen General */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <BarChart sx={{ mr: 1 }} />
                    Resumen General
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#e3f2fd' }}>
                            <CardContent>
                                <Typography variant="h4" color="primary">
                                    {resumen_general.total_votos}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Total de Votos
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#e8f5e8' }}>
                            <CardContent>
                                <Typography variant="h4" color="success.main">
                                    {resumen_general.votos_validos}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Votos Válidos
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#fff3e0' }}>
                            <CardContent>
                                <Typography variant="h4" color="warning.main">
                                    {resumen_general.votos_blancos}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Votos en Blanco
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#ffebee' }}>
                            <CardContent>
                                <Typography variant="h4" color="error.main">
                                    {resumen_general.votos_anulados}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Votos Anulados
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <PieChart sx={{ mr: 1 }} />
                    Resultados por Partido Político
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Partido</strong></TableCell>
                                <TableCell align="center"><strong>Votos</strong></TableCell>
                                <TableCell align="center"><strong>Listas</strong></TableCell>
                                <TableCell align="center"><strong>Porcentaje</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {estadisticas_partidos.map((partido, index) => (
                                <TableRow key={partido.id_Partido}>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <Chip
                                                label={index + 1}
                                                size="small"
                                                color="primary"
                                                sx={{ mr: 1 }}
                                            />
                                            {partido.partido_nombre}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="h6" color="primary">
                                            {partido.total_votos}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        {partido.total_listas}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={`${partido.porcentaje_votos_validos}%`}
                                            color={index === 0 ? 'success' : 'default'}
                                            variant={index === 0 ? 'filled' : 'outlined'}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Participación por Departamento (Top 5)
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Departamento</strong></TableCell>
                                <TableCell align="center"><strong>Total Votos</strong></TableCell>
                                <TableCell align="center"><strong>Válidos</strong></TableCell>
                                <TableCell align="center"><strong>Blancos</strong></TableCell>
                                <TableCell align="center"><strong>Anulados</strong></TableCell>
                                <TableCell align="center"><strong>Establecimientos</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {estadisticas_departamentos.slice(0, 5).map((depto, index) => (
                                <TableRow key={depto.id_Departamento}>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <Chip
                                                label={index + 1}
                                                size="small"
                                                color="secondary"
                                                sx={{ mr: 1 }}
                                            />
                                            {depto.departamento_nombre}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="h6" color="primary">
                                            {depto.total_votos}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        {depto.votos_validos || 0}
                                    </TableCell>
                                    <TableCell align="center">
                                        {depto.votos_blancos || 0}
                                    </TableCell>
                                    <TableCell align="center">
                                        {depto.votos_anulados || 0}
                                    </TableCell>
                                    <TableCell align="center">
                                        {depto.total_establecimientos}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="caption" color="textSecondary">
                    Última actualización: {new Date(statistics.timestamp).toLocaleString('es-UY')}
                </Typography>
            </Paper>
        </Box>
    );
};

export default GeneralStatistics; 