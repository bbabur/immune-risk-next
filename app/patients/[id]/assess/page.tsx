'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Divider,
  Stack,
  Chip
} from '@mui/material';

interface Patient {
  id: number;
  name: string;
  birth_date: string;
  gender: string;
  height: number;
  weight: number;
  ethnicity: string;
  consanguinity: boolean;
  family_history: string;
  diagnosis: string;
  symptoms: string;
  hospitalizations: string;
  infections: string;
  vaccinations: string;
  lab_results: string;
  treatments: string;
}

interface RiskAssessment {
  clinical_score: number;
  genetic_score: number;
  total_score: number;
  risk_level: string;
  recommendations: string[];
}

export default function RiskAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchPatientAndAssess();
    }
  }, [params.id]);

  const fetchPatientAndAssess = async () => {
    try {
      setLoading(true);
      
      // Hasta bilgilerini al
      const patientResponse = await fetch(`/api/patients/${params.id}`);
      if (!patientResponse.ok) {
        throw new Error('Hasta bulunamadı');
      }
      const patientData = await patientResponse.json();
      setPatient(patientData);
      
      // Risk değerlendirmesi yap
      const risk = calculateRiskAssessment(patientData);
      setAssessment(risk);
      
    } catch (error) {
      setError('Hasta verileri yüklenirken hata oluştu');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskAssessment = (patient: Patient): RiskAssessment => {
    let clinical_score = 0;
    let genetic_score = 0;

    // Klinik skorlama
    if (patient.infections && patient.infections.length > 50) {
      clinical_score += 3; // Çok enfeksiyon geçmişi
    }
    if (patient.hospitalizations && patient.hospitalizations.length > 50) {
      clinical_score += 2; // Hastane yatış geçmişi
    }
    if (patient.symptoms && patient.symptoms.length > 50) {
      clinical_score += 2; // Çok semptom
    }

    // Genetik skorlama
    if (patient.consanguinity) {
      genetic_score += 3; // Akrabalık var
    }
    if (patient.family_history && patient.family_history.length > 20) {
      genetic_score += 2; // Aile geçmişi var
    }

    const total_score = clinical_score + genetic_score;
    
    let risk_level = 'Düşük Risk';
    let recommendations: string[] = [];

    if (total_score >= 7) {
      risk_level = 'Yüksek Risk';
      recommendations = [
        'Acil immünoloji konsültasyonu önerilir',
        'Kapsamlı immün sistem değerlendirmesi yapılmalı',
        'Genetik danışmanlık alınmalı',
        'Düzenli takip programına alınmalı'
      ];
    } else if (total_score >= 4) {
      risk_level = 'Orta Risk';
      recommendations = [
        'İmmünoloji konsültasyonu önerilir',
        'İlave laboratuvar testleri yapılmalı',
        '6 aylık takip önerilir',
        'Aşı takvimi gözden geçirilmeli'
      ];
    } else {
      risk_level = 'Düşük Risk';
      recommendations = [
        'Rutin takip yeterli',
        'Yıllık kontrol önerilir',
        'Aşı takvimine uyulmalı',
        'Enfeksiyon durumunda erken başvuru'
      ];
    }

    return {
      clinical_score,
      genetic_score,
      total_score,
      risk_level,
      recommendations
    };
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

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Yüksek Risk':
        return 'error';
      case 'Orta Risk':
        return 'warning';
      default:
        return 'success';
    }
  };

  if (loading) return <Typography>Yükleniyor...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!patient || !assessment) return <Alert severity="error">Veri bulunamadı</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Risk Değerlendirmesi - {patient.name}
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Hasta Özeti */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Hasta Özeti
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Typography><strong>İsim:</strong> {patient.name}</Typography>
              <Typography><strong>Yaş:</strong> {calculateAge(patient.birth_date)} yaş</Typography>
              <Typography><strong>Cinsiyet:</strong> {patient.gender === 'M' ? 'Erkek' : 'Kadın'}</Typography>
              <Typography><strong>Tanı:</strong> {patient.diagnosis || 'Belirlenmemiş'}</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Risk Skorları */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Risk Skorları
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Box flex={1}>
                <Typography variant="subtitle1" gutterBottom>
                  Klinik Skor
                </Typography>
                <Typography variant="h3" color="primary">
                  {assessment.clinical_score}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Semptom, enfeksiyon ve hastane geçmişi
                </Typography>
              </Box>
              
              <Box flex={1}>
                <Typography variant="subtitle1" gutterBottom>
                  Genetik Skor
                </Typography>
                <Typography variant="h3" color="secondary">
                  {assessment.genetic_score}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Aile geçmişi ve akrabalık
                </Typography>
              </Box>
              
              <Box flex={1}>
                <Typography variant="subtitle1" gutterBottom>
                  Toplam Skor
                </Typography>
                <Typography variant="h3" color="text.primary">
                  {assessment.total_score}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Genel risk skoru
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Risk Seviyesi */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Risk Seviyesi
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                label={assessment.risk_level}
                color={getRiskColor(assessment.risk_level)}
                size="medium"
                sx={{ fontSize: '1.2rem', px: 2, py: 1, minHeight: '40px' }}
              />
              <Typography variant="body1">
                Bu hastanın primer immün yetmezlik riski "{assessment.risk_level}" olarak değerlendirilmiştir.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Öneriler */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Öneriler
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {assessment.recommendations.map((recommendation, index) => (
                <Box key={index} display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main'
                    }}
                  />
                  <Typography>{recommendation}</Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        <Button
          variant="outlined"
          onClick={() => router.push(`/patients/${params.id}`)}
        >
          Hasta Detayına Dön
        </Button>
        <Button
          variant="contained"
          onClick={() => router.push(`/patients/${params.id}/evaluation`)}
        >
          Laboratuvar Değerlendirme
        </Button>
      </Box>
    </Container>
  );
} 