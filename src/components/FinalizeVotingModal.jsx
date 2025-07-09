import React from 'react';
import { Dialog,DialogTitle,DialogContent,DialogActions,DialogContentText,Button,Box, Typography, Alert} from '@mui/material';
import { Assessment, Warning } from '@mui/icons-material';

const FinalizeVotingModal = ({ open, onConfirm, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                pb: 2,
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <Warning sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6" component="span">
                    Finalizar Proceso de Votación
                </Typography>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Esta acción cerrará definitivamente el proceso de votación
                </Alert>
                
                <DialogContentText component="div">
                    <Typography variant="body1" paragraph>
                        ¿Está seguro de que desea finalizar el proceso de votación?
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary" paragraph>
                        Al confirmar esta acción:
                    </Typography>
                    
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        <li>
                            <Typography variant="body2" color="textSecondary">
                                Se cerrará permanentemente la mesa de votación
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2" color="textSecondary">
                                No se podrán registrar más votos
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2" color="textSecondary">
                                Se mostrarán las estadísticas finales del proceso
                            </Typography>
                        </li>
                    </Box>
                </DialogContentText>
            </DialogContent>
            
            <DialogActions sx={{ 
                p: 3, 
                borderTop: 1, 
                borderColor: 'divider',
                justifyContent: 'space-between'
            }}>
                <Button 
                    onClick={onClose} 
                    variant="outlined"
                    color="inherit"
                    size="large"
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={onConfirm} 
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<Assessment />}
                    sx={{
                        bgcolor: '#25418E',
                        '&:hover': {
                            bgcolor: '#25418E'
                        }
                    }}
                >
                    Finalizar y Ver Estadísticas
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FinalizeVotingModal; 