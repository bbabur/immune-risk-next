'use client';

import { useState, useEffect } from 'react';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Container,
  Box,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip
} from '@mui/material';
import { PersonAdd, Visibility, Assessment, Male, Female, Upload } from '@mui/icons-material';
import Link from 'next/link';

interface Patient {
  id: number;
  firstName?: string;
  lastName?: string;
  birthDate: string;
  gender: string;
  finalRiskLevel?: string;
  hasImmuneDeficiency?: boolean;
  diagnosisType?: string;
  birthWeight?: number;
  gestationalAge?: number;
  parentalConsanguinity?: boolean;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || `API Hatası: ${response.status}`);
      }
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setError(`Hasta verileri yüklenirken hata oluştu: ${errorMessage}`);
      console.error('Error fetching patients:', {
        error,
        timestamp: new Date().toISOString(),
        url: '/api/patients'
      });
    } finally {
      setLoading(false);
    }
  };

  // KVKK - İsim maskeleme
  const maskName = (firstName?: string, lastName?: string) => {
    const first = firstName || '';
    const last = lastName || '';
    
    if (!first && !last) return 'Anonim Hasta';
    
    const maskString = (str: string) => {
      if (str.length <= 1) return str;
      return str.charAt(0) + '***';
    };
    
    return `${maskString(first)} ${maskString(last)}`.trim();
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getGenderDisplay = (gender: string) => {
    const genderLower = gender.toLowerCase();
    if (genderLower === 'male' || genderLower === 'erkek' || genderLower === 'm') {
      return (
        <Box display="flex" alignItems="center" gap={1}>
          <Male color="primary" fontSize="small" />
          <span>Erkek</span>
        </Box>
      );
    } else if (genderLower === 'female' || genderLower === 'kız' || genderLower === 'f') {
      return (
        <Box display="flex" alignItems="center" gap={1}>
          <Female color="error" fontSize="small" />
          <span>Kız</span>
        </Box>
      );
    } else {
      return <span>Belirtilmemiş</span>;
    }
  };

  const getRiskLevelChip = (riskLevel?: string) => {
    if (!riskLevel) {
      return <Chip label="Değerlendirilmemiş" size="small" color="default" />;
    }

    if (riskLevel.includes('Düşük')) {
      return <Chip label={riskLevel} size="small" color="success" />;
    } else if (riskLevel.includes('Orta')) {
      return <Chip label={riskLevel} size="small" color="warning" />;
    } else if (riskLevel.includes('Yüksek')) {
      return <Chip label={riskLevel} size="small" color="error" />;
    } else {
      return <Chip label={riskLevel} size="small" color="default" />;
    }
  };

  const getDiagnosisChip = (hasImmuneDeficiency?: boolean, diagnosisType?: string) => {
    if (hasImmuneDeficiency === null || hasImmuneDeficiency === undefined) {
      return <Chip label="Tanı Yok" size="small" color="default" />;
    } else if (hasImmuneDeficiency) {
      return (
        <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5}>
          <Chip label="İmmün Yetmezlik" size="small" color="error" />
          {diagnosisType && (
            <Typography variant="caption" color="text.secondary">
              ({diagnosisType})
            </Typography>
          )}
        </Box>
      );
    } else {
      return <Chip label="Normal İmmün Sistem" size="small" color="success" />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error"
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchPatients();
              }}
            >
              TEKRAR DENE
            </Button>
          }
        >
          <AlertTitle>Hasta Verileri Yüklenirken Hata Oluştu</AlertTitle>
          {error}
          <br />
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            İnternet bağlantınızı kontrol edin veya sayfayı yenileyin.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3}>
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            👥 Hasta Listesi
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              href="/patients/import"
              variant="outlined"
              sx={{ bgcolor: 'white', color: 'primary.main', borderColor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
              startIcon={<Upload />}
            >
              Excel İçe Aktar
            </Button>
            <Button
              component={Link}
              href="/patients/register"
              variant="contained"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
              startIcon={<PersonAdd />}
            >
              Yeni Hasta Ekle
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ p: 2 }}>
          {patients.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Henüz kayıtlı hasta bulunmamaktadır.
              </Typography>
              <Button
                component={Link}
                href="/patients/register"
                variant="contained"
                startIcon={<PersonAdd />}
              >
                Yeni Hasta Ekle
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Hasta No</strong></TableCell>
                    <TableCell><strong>Kimlik</strong></TableCell>
                    <TableCell><strong>Yaş</strong></TableCell>
                    <TableCell><strong>Cinsiyet</strong></TableCell>
                    <TableCell><strong>Tanı</strong></TableCell>
                    <TableCell><strong>Doğum Kilosu</strong></TableCell>
                    <TableCell><strong>Gestasyon</strong></TableCell>
                    <TableCell><strong>Akrabalık</strong></TableCell>
                    <TableCell><strong>İşlemler</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id} hover>
                      <TableCell>
                        <Chip label={`#${patient.id}`} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {maskName(patient.firstName, patient.lastName)}
                        </Typography>
                      </TableCell>
                      <TableCell>{calculateAge(patient.birthDate)} yaş</TableCell>
                      <TableCell>{getGenderDisplay(patient.gender)}</TableCell>
                      <TableCell>{getDiagnosisChip(patient.hasImmuneDeficiency, patient.diagnosisType)}</TableCell>
                      <TableCell>
                        {patient.birthWeight ? `${patient.birthWeight}g` : '-'}
                      </TableCell>
                      <TableCell>
                        {patient.gestationalAge ? `${patient.gestationalAge} hafta` : '-'}
                      </TableCell>
                      <TableCell>
                        {patient.parentalConsanguinity ? (
                          <Chip label="Var" size="small" color="warning" />
                        ) : (
                          <Chip label="Yok" size="small" color="default" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          component={Link}
                          href={`/patients/${patient.id}`}
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<Visibility />}
                        >
                          Detay
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Container>
  );
} 