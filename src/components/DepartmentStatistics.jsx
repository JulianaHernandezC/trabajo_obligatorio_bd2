import React, { useState, useEffect } from 'react';
import { Box, Paper,Typography,Grid, Card, CardContent, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead,  TableRow,  Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,  IconButton, Collapse} from '@mui/material';
import { LocationOn, ExpandMore, ExpandLess, Visibility, ArrowUpward } from '@mui/icons-material';
import { API_ENDPOINTS } from '../config';

const DepartmentStatistics = ({ electionId }) => {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [departmentDetails, setDepartmentDetails] = useState(null);
    const [departmentRanking, setDepartmentRanking] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [expandedDepartments, setExpandedDepartments] = useState(new Set());

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.ESTADISTICAS_DEPARTAMENTOS(electionId));
                if (!response.ok) {
                    throw new Error('Error al obtener estadísticas por departamento');
                }
                const data = await response.json();
                setStatistics(data.estadisticas_por_departamento);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [electionId]);

    const handleViewDetails = async (department) => {
        setSelectedDepartment(department);
        setDetailsLoading(true);
        
        try {
            const [detailsResponse, rankingResponse] = await Promise.all([
                fetch(API_ENDPOINTS.ESTADISTICAS_DEPARTAMENTO_DETALLE(electionId, department.id_Departamento)),
                fetch(API_ENDPOINTS.RANKING_PARTIDOS_DEPARTAMENTO(electionId, department.id_Departamento))
            ]);
            
            if (!detailsResponse.ok || !rankingResponse.ok) {
                throw new Error('Error al obtener detalles del departamento');
            }
            
            const detailsData = await detailsResponse.json();
            const rankingData = await rankingResponse.json();
            
            setDepartmentDetails(detailsData);
            setDepartmentRanking(rankingData);
        } catch (err) {
            setError(err.message);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleCloseDetails = () => {
        setSelectedDepartment(null);
        setDepartmentDetails(null);
        setDepartmentRanking(null);
    };

    const toggleExpanded = (departmentId) => {
        const newExpanded = new Set(expandedDepartments);
        if (newExpanded.has(departmentId)) {
            newExpanded.delete(departmentId);
        } else {
            newExpanded.add(departmentId);
        }
        setExpandedDepartments(newExpanded);
    };

    const getDepartmentWithVotes = () => statistics.filter(dept => dept.total_votos > 0);
    const getDepartmentWithoutVotes = () => statistics.filter(dept => dept.total_votos === 0);

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

    const departmentsWithVotes = getDepartmentWithVotes();
    const departmentsWithoutVotes = getDepartmentWithoutVotes();

    return (
        <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ mr: 1 }} />
                    Estadísticas por Departamento
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ bgcolor: '#e3f2fd' }}>
                            <CardContent>
                                <Typography variant="h4" color="primary">
                                    {statistics.length}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Total Departamentos
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ bgcolor: '#e8f5e8' }}>
                            <CardContent>
                                <Typography variant="h4" color="success.main">
                                    {departmentsWithVotes.length}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Con Participación
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ bgcolor: '#fff3e0' }}>
                            <CardContent>
                                <Typography variant="h4" color="warning.main">
                                    {departmentsWithoutVotes.length}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Sin Participación
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {departmentsWithVotes.length > 0 && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowUpward sx={{ mr: 1, color: 'success.main' }} />
                        Departamentos con Participación Electoral
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Pos.</strong></TableCell>
                                    <TableCell><strong>Departamento</strong></TableCell>
                                    <TableCell align="center"><strong>Total Votos</strong></TableCell>
                                    <TableCell align="center"><strong>Válidos</strong></TableCell>
                                    <TableCell align="center"><strong>Blancos</strong></TableCell>
                                    <TableCell align="center"><strong>Anulados</strong></TableCell>
                                    <TableCell align="center"><strong>Establecimientos</strong></TableCell>
                                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {departmentsWithVotes.map((dept, index) => (
                                    <TableRow key={dept.id_Departamento}>
                                        <TableCell>
                                            <Chip
                                                label={index + 1}
                                                size="small"
                                                color={index === 0 ? 'success' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {dept.departamento_nombre}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="h6" color="primary">
                                                {dept.total_votos}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={dept.votos_validos || 0}
                                                color="success"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={dept.votos_blancos || 0}
                                                color="warning"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={dept.votos_anulados || 0}
                                                color="error"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {dept.total_establecimientos}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                startIcon={<Visibility />}
                                                size="small"
                                                onClick={() => handleViewDetails(dept)}
                                            >
                                                Ver Detalles
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {departmentsWithoutVotes.length > 0 && (
                <Paper sx={{ p: 3 }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => toggleExpanded('without-votes')}
                    >
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                            Departamentos sin Participación ({departmentsWithoutVotes.length})
                        </Typography>
                        <IconButton>
                            {expandedDepartments.has('without-votes') ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </Box>
                    <Collapse in={expandedDepartments.has('without-votes')}>
                        <Box mt={2}>
                            <Grid container spacing={2}>
                                {departmentsWithoutVotes.map((dept) => (
                                    <Grid item xs={12} sm={6} md={4} key={dept.id_Departamento}>
                                        <Card sx={{ bgcolor: '#f5f5f5' }}>
                                            <CardContent>
                                                <Typography variant="subtitle2">
                                                    {dept.departamento_nombre}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {dept.total_establecimientos} establecimientos
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Collapse>
                </Paper>
            )}

            <Dialog
                open={!!selectedDepartment}
                onClose={handleCloseDetails}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    Detalles de {selectedDepartment?.departamento_nombre}
                </DialogTitle>
                <DialogContent>
                    {detailsLoading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box>
                            {/* Ranking de partidos */}
                            {departmentRanking && departmentRanking.ranking_partidos.length > 0 && (
                                <Paper sx={{ p: 2, mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Ranking de Partidos
                                    </Typography>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Partido</TableCell>
                                                <TableCell align="center">Votos</TableCell>
                                                <TableCell align="center">%</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {departmentRanking.ranking_partidos.map((partido, index) => (
                                                <TableRow key={partido.id_Partido}>
                                                    <TableCell>
                                                        <Chip
                                                            label={index + 1}
                                                            size="small"
                                                            color="primary"
                                                            sx={{ mr: 1 }}
                                                        />
                                                        {partido.partido_nombre}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {partido.total_votos}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {partido.porcentaje_departamento}%
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            )}

                            {departmentDetails && (
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Detalles por Establecimiento
                                    </Typography>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Circuito</TableCell>
                                                <TableCell>Establecimiento</TableCell>
                                                <TableCell align="center">Total</TableCell>
                                                <TableCell align="center">Válidos</TableCell>
                                                <TableCell align="center">Blancos</TableCell>
                                                <TableCell align="center">Anulados</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {departmentDetails.estadisticas_detalladas.map((est, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        Circuito {est.circuito_numero}
                                                    </TableCell>
                                                    <TableCell>
                                                        {est.establecimiento_nombre}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {est.total_votos}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {est.votos_validos || 0}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {est.votos_blancos || 0}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {est.votos_anulados || 0}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DepartmentStatistics; 