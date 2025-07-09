import React, { useState, useEffect } from 'react';
import { Box,  Paper,Typography,Grid,Card,CardContent,CircularProgress,Alert,Table,  TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, FormControl, InputLabel, Select,  MenuItem, Tabs, Tab} from '@mui/material';
import { Analytics, Compare, TrendingUp, Assessment } from '@mui/icons-material';
import { API_ENDPOINTS } from '../config';

const DetailedStatistics = ({ electionId }) => {
    const [generalStats, setGeneralStats] = useState(null);
    const [departmentStats, setDepartmentStats] = useState([]);
    const [partyStats, setPartyStats] = useState([]);
    const [crossStats, setCrossStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        const fetchAllStatistics = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.RESUMEN_COMPLETO(electionId));
                if (!response.ok) {
                    throw new Error('Error al obtener estadísticas completas');
                }
                const data = await response.json();
                
                setGeneralStats(data.resumen_general);
                setDepartmentStats(data.estadisticas_departamentos);
                setPartyStats(data.estadisticas_partidos);
                setCrossStats(data.votos_departamento_partido);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllStatistics();
    }, [electionId]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const getParticipationAnalysis = () => {
        if (!generalStats) return {};
        
        const totalVotes = generalStats.total_votos;
        const validVotes = generalStats.votos_validos;
        const blankVotes = generalStats.votos_blancos;
        const nullVotes = generalStats.votos_anulados;
        
        return {
            participationRate: ((validVotes / totalVotes) * 100).toFixed(2),
            blankRate: ((blankVotes / totalVotes) * 100).toFixed(2),
            nullRate: ((nullVotes / totalVotes) * 100).toFixed(2),
            effectiveParticipation: ((validVotes / totalVotes) * 100).toFixed(2)
        };
    };

    const getDepartmentComparison = () => {
        const withVotes = departmentStats.filter(dept => dept.total_votos > 0);
        const withoutVotes = departmentStats.filter(dept => dept.total_votos === 0);
        
        return {
            withVotes: withVotes.length,
            withoutVotes: withoutVotes.length,
            topDepartment: withVotes[0] || null,
            averageVotesPerDepartment: withVotes.length > 0 ? 
                (withVotes.reduce((sum, dept) => sum + dept.total_votos, 0) / withVotes.length).toFixed(1) : 0
        };
    };

    const getPartyAnalysis = () => {
        if (partyStats.length === 0) return {};
        
        const winner = partyStats[0];
        const runnerUp = partyStats[1];
        const totalValidVotes = partyStats.reduce((sum, party) => sum + party.total_votos, 0);
        
        return {
            winner,
            runnerUp,
            margin: winner && runnerUp ? (winner.total_votos - runnerUp.total_votos) : 0,
            concentration: winner ? ((winner.total_votos / totalValidVotes) * 100).toFixed(2) : 0,
            competitiveness: partyStats.length
        };
    };

    const getDepartmentDetails = (departmentId) => {
        return crossStats.filter(stat => stat.id_Departamento == departmentId);
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

    const participation = getParticipationAnalysis();
    const departmentComparison = getDepartmentComparison();
    const partyAnalysis = getPartyAnalysis();
    const departmentsWithVotes = departmentStats.filter(dept => dept.total_votos > 0);

    return (
        <Box>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Analytics sx={{ mr: 1 }} />
                    Análisis Detallado Electoral
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Análisis avanzado de patrones de votación, participación y distribución geográfica
                </Typography>
            </Paper>

            {/* Navegación */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="Análisis de Participación" icon={<Assessment />} />
                    <Tab label="Comparativa Geográfica" icon={<Compare />} />
                    <Tab label="Análisis Competitivo" icon={<TrendingUp />} />
                </Tabs>
            </Paper>

            {selectedTab === 0 && (
                <Box>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Indicadores de Participación
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ bgcolor: '#e8f5e8' }}>
                                    <CardContent>
                                        <Typography variant="h4" color="success.main">
                                            {participation.participationRate}%
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            Tasa de Participación Válida
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ bgcolor: '#fff3e0' }}>
                                    <CardContent>
                                        <Typography variant="h4" color="warning.main">
                                            {participation.blankRate}%
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            Tasa de Voto en Blanco
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ bgcolor: '#ffebee' }}>
                                    <CardContent>
                                        <Typography variant="h4" color="error.main">
                                            {participation.nullRate}%
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            Tasa de Voto Anulado
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ bgcolor: '#e3f2fd' }}>
                                    <CardContent>
                                        <Typography variant="h4" color="primary">
                                            {departmentComparison.withVotes}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            Departamentos Activos
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Interpretación de Resultados
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1" paragraph>
                                    <strong>Participación Electoral:</strong> Con un {participation.participationRate}% de votos válidos, 
                                    la participación se considera {parseFloat(participation.participationRate) > 70 ? 'alta' : 
                                    parseFloat(participation.participationRate) > 50 ? 'moderada' : 'baja'}.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    <strong>Votos Especiales:</strong> El {(parseFloat(participation.blankRate) + parseFloat(participation.nullRate)).toFixed(2)}% 
                                    corresponde a votos en blanco y anulados, lo que indica un nivel de abstención selectiva 
                                    {parseFloat(participation.blankRate) + parseFloat(participation.nullRate) > 10 ? 'alto' : 'normal'}.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1" paragraph>
                                    <strong>Cobertura Geográfica:</strong> {departmentComparison.withVotes} de {departmentStats.length} departamentos 
                                    registraron actividad electoral ({((departmentComparison.withVotes / departmentStats.length) * 100).toFixed(1)}% del territorio).
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Promedio por Departamento:</strong> {departmentComparison.averageVotesPerDepartment} votos por departamento activo.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            )}

            {selectedTab === 1 && (
                <Box>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Distribución Geográfica del Voto
                        </Typography>
                        
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Seleccionar Departamento para Análisis</InputLabel>
                            <Select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                label="Seleccionar Departamento para Análisis"
                            >
                                <MenuItem value="">
                                    <em>Todos los departamentos</em>
                                </MenuItem>
                                {departmentsWithVotes.map((dept) => (
                                    <MenuItem key={dept.id_Departamento} value={dept.id_Departamento}>
                                        {dept.departamento_nombre} ({dept.total_votos} votos)
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {selectedDepartment ? (
                            <Box>
                                {(() => {
                                    const dept = departmentsWithVotes.find(d => d.id_Departamento == selectedDepartment);
                                    const deptParties = getDepartmentDetails(selectedDepartment);
                                    
                                    return (
                                        <Box>
                                            <Typography variant="h6" gutterBottom>
                                                Análisis: {dept?.departamento_nombre}
                                            </Typography>
                                            
                                            <Grid container spacing={3} mb={3}>
                                                <Grid item xs={6} md={3}>
                                                    <Card>
                                                        <CardContent>
                                                            <Typography variant="h5" color="primary">
                                                                {dept?.total_votos}
                                                            </Typography>
                                                            <Typography variant="body2">Total Votos</Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid item xs={6} md={3}>
                                                    <Card>
                                                        <CardContent>
                                                            <Typography variant="h5" color="success.main">
                                                                {dept?.votos_validos || 0}
                                                            </Typography>
                                                            <Typography variant="body2">Votos Válidos</Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid item xs={6} md={3}>
                                                    <Card>
                                                        <CardContent>
                                                            <Typography variant="h5" color="info.main">
                                                                {dept?.total_establecimientos}
                                                            </Typography>
                                                            <Typography variant="body2">Establecimientos</Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid item xs={6} md={3}>
                                                    <Card>
                                                        <CardContent>
                                                            <Typography variant="h5" color="secondary.main">
                                                                {deptParties.length}
                                                            </Typography>
                                                            <Typography variant="body2">Partidos</Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            </Grid>

                                            <TableContainer component={Paper}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Partido</TableCell>
                                                            <TableCell align="center">Votos</TableCell>
                                                            <TableCell align="center">% Departamento</TableCell>
                                                            <TableCell align="center">Posición</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {deptParties
                                                            .sort((a, b) => b.total_votos - a.total_votos)
                                                            .map((party, index) => (
                                                            <TableRow key={party.id_Partido}>
                                                                <TableCell>{party.partido_nombre}</TableCell>
                                                                <TableCell align="center">
                                                                    <Typography variant="body2" fontWeight="bold">
                                                                        {party.total_votos}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Chip
                                                                        label={`${party.porcentaje_departamento}%`}
                                                                        color={index === 0 ? 'success' : 'default'}
                                                                        size="small"
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Chip
                                                                        label={`#${index + 1}`}
                                                                        color={index === 0 ? 'success' : 'default'}
                                                                        variant="outlined"
                                                                        size="small"
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    );
                                })()}
                            </Box>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ranking</TableCell>
                                            <TableCell>Departamento</TableCell>
                                            <TableCell align="center">Total Votos</TableCell>
                                            <TableCell align="center">Partidos Activos</TableCell>
                                            <TableCell align="center">Establecimientos</TableCell>
                                            <TableCell align="center">% del Total Nacional</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {departmentsWithVotes.map((dept, index) => {
                                            const partiesInDept = crossStats.filter(stat => stat.id_Departamento === dept.id_Departamento);
                                            const nationalTotal = generalStats?.total_votos || 1;
                                            
                                            return (
                                                <TableRow key={dept.id_Departamento}>
                                                    <TableCell>
                                                        <Chip
                                                            label={index + 1}
                                                            color={index === 0 ? 'success' : 'default'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle2" fontWeight="bold">
                                                            {dept.departamento_nombre}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {dept.total_votos}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {partiesInDept.length}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {dept.total_establecimientos}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={`${((dept.total_votos / nationalTotal) * 100).toFixed(2)}%`}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Box>
            )}

            {selectedTab === 2 && (
                <Box>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Análisis de Competitividad Electoral
                        </Typography>
                        
                        <Grid container spacing={3} mb={3}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ bgcolor: '#e8f5e8' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Partido Ganador
                                        </Typography>
                                        {partyAnalysis.winner && (
                                            <Box>
                                                <Typography variant="h5" color="success.main">
                                                    {partyAnalysis.winner.partido_nombre}
                                                </Typography>
                                                <Typography variant="body1">
                                                    {partyAnalysis.winner.total_votos} votos ({partyAnalysis.winner.porcentaje_votos_validos}%)
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {partyAnalysis.winner.total_listas} listas presentadas
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Card sx={{ bgcolor: '#e3f2fd' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Segundo Lugar
                                        </Typography>
                                        {partyAnalysis.runnerUp && (
                                            <Box>
                                                <Typography variant="h5" color="primary">
                                                    {partyAnalysis.runnerUp.partido_nombre}
                                                </Typography>
                                                <Typography variant="body1">
                                                    {partyAnalysis.runnerUp.total_votos} votos ({partyAnalysis.runnerUp.porcentaje_votos_validos}%)
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Diferencia: {partyAnalysis.margin} votos
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h4" color="primary">
                                            {partyAnalysis.concentration}%
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            Concentración del Ganador
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h4" color="secondary">
                                            {partyAnalysis.competitiveness}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            Partidos Competitivos
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h4" color="warning.main">
                                            {partyAnalysis.margin}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            Margen de Victoria
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h4" color="info.main">
                                            {departmentComparison.withVotes}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            Departamentos Disputados
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Interpretación del Escenario Competitivo
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Concentración de Poder:</strong> El partido ganador obtuvo el {partyAnalysis.concentration}% 
                            de los votos válidos, lo que indica una victoria {parseFloat(partyAnalysis.concentration) > 50 ? 'contundente' : 
                            parseFloat(partyAnalysis.concentration) > 40 ? 'sólida' : 'ajustada'}.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Nivel de Competencia:</strong> Con {partyAnalysis.competitiveness} partidos obteniendo votos, 
                            el sistema muestra un nivel de competitividad 
                            {partyAnalysis.competitiveness > 4 ? 'alto' : partyAnalysis.competitiveness > 2 ? 'moderado' : 'bajo'}.
                        </Typography>
                        <Typography variant="body1">
                            <strong>Distribución Territorial:</strong> La disputa electoral se desarrolló en {departmentComparison.withVotes} 
                            departamentos, representando el {((departmentComparison.withVotes / departmentStats.length) * 100).toFixed(1)}% 
                            del territorio nacional.
                        </Typography>
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default DetailedStatistics; 