import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, LinearProgress, Avatar} from '@mui/material';
import { Groups, EmojiEvents, TrendingUp } from '@mui/icons-material';
import { API_ENDPOINTS } from '../config';

const PartyStatistics = ({ electionId }) => {
    const [partyStats, setPartyStats] = useState([]);
    const [departmentPartyStats, setDepartmentPartyStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const [partyResponse, departmentPartyResponse] = await Promise.all([
                    fetch(API_ENDPOINTS.ESTADISTICAS_PARTIDOS(electionId)),
                    fetch(API_ENDPOINTS.ESTADISTICAS_DEPARTAMENTOS_PARTIDOS(electionId))
                ]);
                
                if (!partyResponse.ok || !departmentPartyResponse.ok) {
                    throw new Error('Error al obtener estadísticas por partido');
                }
                
                const partyData = await partyResponse.json();
                const departmentPartyData = await departmentPartyResponse.json();
                
                setPartyStats(partyData.estadisticas_por_partido);
                setDepartmentPartyStats(departmentPartyData.votos_por_departamento_y_partido);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [electionId]);

    const getPartyColor = (index) => {
        const colors = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0', '#607d8b'];
        return colors[index % colors.length];
    };

    const getMaxVotes = () => {
        return Math.max(...partyStats.map(party => party.total_votos));
    };

    const getDepartmentsByParty = (partyId) => {
        return departmentPartyStats.filter(stat => stat.id_Partido === partyId);
    };

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

    const totalVotes = partyStats.reduce((sum, party) => sum + party.total_votos, 0);
    const maxVotes = getMaxVotes();

    return (
        <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Groups sx={{ mr: 1 }} />
                    Estadísticas por Partido Político
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ bgcolor: '#e3f2fd' }}>
                            <CardContent>
                                <Typography variant="h4" color="primary">
                                    {partyStats.length}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Partidos con Votos
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ bgcolor: '#e8f5e8' }}>
                            <CardContent>
                                <Typography variant="h4" color="success.main">
                                    {totalVotes}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Total Votos Válidos
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ bgcolor: '#fff3e0' }}>
                            <CardContent>
                                <Typography variant="h4" color="warning.main">
                                    {partyStats.reduce((sum, party) => sum + party.total_listas, 0)}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Total Listas
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* Ranking de partidos */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmojiEvents sx={{ mr: 1, color: 'gold' }} />
                    Ranking Nacional de Partidos
                </Typography>
                <Grid container spacing={3}>
                    {partyStats.map((party, index) => (
                        <Grid item xs={12} md={6} key={party.id_Partido}>
                            <Card sx={{ 
                                bgcolor: index === 0 ? '#e8f5e8' : 'white',
                                border: index === 0 ? '2px solid #4caf50' : '1px solid #e0e0e0'
                            }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar
                                            sx={{
                                                bgcolor: getPartyColor(index),
                                                mr: 2,
                                                width: 40,
                                                height: 40
                                            }}
                                        >
                                            {index + 1}
                                        </Avatar>
                                        <Box flexGrow={1}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {party.partido_nombre}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {party.total_listas} listas presentadas
                                            </Typography>
                                        </Box>
                                        {index === 0 && (
                                            <EmojiEvents sx={{ color: 'gold', fontSize: 30 }} />
                                        )}
                                    </Box>
                                    
                                    <Box mb={2}>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2">
                                                Votos obtenidos
                                            </Typography>
                                            <Typography variant="body2" fontWeight="bold">
                                                {party.total_votos} votos
                                            </Typography>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={(party.total_votos / maxVotes) * 100}
                                            sx={{ 
                                                height: 8, 
                                                borderRadius: 4,
                                                bgcolor: 'grey.200',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: getPartyColor(index)
                                                }
                                            }}
                                        />
                                    </Box>
                                    
                                    <Box display="flex" justifyContent="space-between">
                                        <Chip
                                            label={`${party.porcentaje_votos_validos}%`}
                                            color={index === 0 ? 'success' : 'default'}
                                            variant={index === 0 ? 'filled' : 'outlined'}
                                            size="small"
                                        />
                                        <Typography variant="caption" color="textSecondary">
                                            del total válido
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Performance por departamento */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ mr: 1 }} />
                    Performance por Departamento
                </Typography>
                
                {partyStats.map((party, partyIndex) => {
                    const departmentData = getDepartmentsByParty(party.id_Partido);
                    
                    if (departmentData.length === 0) return null;
                    
                    return (
                        <Box key={party.id_Partido} mb={4}>
                            <Typography variant="subtitle1" fontWeight="bold" mb={2} sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                color: getPartyColor(partyIndex)
                            }}>
                                <Avatar 
                                    sx={{ 
                                        bgcolor: getPartyColor(partyIndex),
                                        width: 24,
                                        height: 24,
                                        mr: 1,
                                        fontSize: 12
                                    }}
                                >
                                    {partyIndex + 1}
                                </Avatar>
                                {party.partido_nombre}
                            </Typography>
                            
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Departamento</strong></TableCell>
                                            <TableCell align="center"><strong>Votos</strong></TableCell>
                                            <TableCell align="center"><strong>% Departamento</strong></TableCell>
                                            <TableCell align="center"><strong>Performance</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {departmentData
                                            .sort((a, b) => b.total_votos - a.total_votos)
                                            .map((dept, index) => (
                                            <TableRow key={`${party.id_Partido}-${dept.id_Departamento}`}>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        {index < 3 && (
                                                            <Chip
                                                                label={index + 1}
                                                                size="small"
                                                                color={index === 0 ? 'success' : 'default'}
                                                                sx={{ mr: 1 }}
                                                            />
                                                        )}
                                                        {dept.departamento_nombre}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {dept.total_votos}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={`${dept.porcentaje_departamento || 0}%`}
                                                        size="small"
                                                        variant="outlined"
                                                        color={
                                                            parseFloat(dept.porcentaje_departamento || 0) > 30 ? 'success' :
                                                            parseFloat(dept.porcentaje_departamento || 0) > 15 ? 'warning' : 'default'
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={Math.min((dept.total_votos / party.total_votos) * 100, 100)}
                                                        sx={{ 
                                                            width: 80,
                                                            height: 6,
                                                            borderRadius: 3,
                                                            bgcolor: 'grey.200',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: getPartyColor(partyIndex)
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    );
                })}
            </Paper>
        </Box>
    );
};

export default PartyStatistics; 