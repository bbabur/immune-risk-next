'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  file_number?: string;
  age_years?: number;
  age_months?: number;
  gender: string;
  final_risk_level?: string;
  has_immune_deficiency?: boolean;
  diagnosis_type?: string;
  birth_weight?: number;
  gestational_age?: number;
  parental_consanguinity?: string | boolean;
}

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Önce login kontrolü yap
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      // Token veya user yoksa hemen login'e yönlendir
      router.replace('/login?redirect=/patients');
      return;
    }
    
    // Token var, authenticated olarak işaretle ve verileri çek
    setIsAuthenticated(true);
    fetchPatients();
  }, [router]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // 401 hatası - session expired, login'e yönlendir
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.replace('/login?redirect=/patients&expired=true');
        return;
      }
      
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

  // Henüz auth kontrolü yapılmadıysa boş göster
  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Yaş gösterimi
  const formatAge = (ageYears?: number, ageMonths?: number) => {
    if (ageYears === undefined && ageMonths === undefined) return '-';
    if (ageYears === null && ageMonths === null) return '-';
    
    const years = ageYears || 0;
    const months = ageMonths || 0;
    
    if (years === 0 && months === 0) return '0 ay';
    if (years === 0) return `${months} ay`;
    if (months === 0) return `${years} yıl`;
    return `${years} yıl ${months} ay`;
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
                    <TableCell><strong>Dosya No</strong></TableCell>
                    <TableCell><strong>Hasta</strong></TableCell>
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
                        <Chip label={patient.file_number || `#${patient.id}`} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          Hasta #{patient.id}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatAge(patient.age_years, patient.age_months)}</TableCell>
                      <TableCell>{getGenderDisplay(patient.gender)}</TableCell>
                      <TableCell>{getDiagnosisChip(patient.has_immune_deficiency, patient.diagnosis_type)}</TableCell>
                      <TableCell>
                        {patient.birth_weight ? `${patient.birth_weight}g` : '-'}
                      </TableCell>
                      <TableCell>
                        {patient.gestational_age ? `${patient.gestational_age} hafta` : '-'}
                      </TableCell>
                      <TableCell>
                        {patient.parental_consanguinity && patient.parental_consanguinity !== '0' ? (
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