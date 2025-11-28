'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Alert,
  Chip,
  LinearProgress,
  Divider,
  Grid
} from '@mui/material';
import { Psychology, CheckCircle, Warning, Error as ErrorIcon, Info } from '@mui/icons-material';

export default function RiskResultPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<any>(null);
  const [riskResult, setRiskResult] = useState<any>(null);

  useEffect(() => {
    fetchRiskAssessment();
  }, [patientId]);

  const fetchRiskAssessment = async () => {
    try {
      setLoading(true);
      
      // Fetch patient data
      const patientRes = await fetch(`/api/patients/${patientId}`);
      if (patientRes.ok) {
        const patientData = await patientRes.json();
        setPatient(patientData);
      }

      // Fetch or calculate risk assessment
      const riskRes = await fetch(`/api/patients/${patientId}/risk-assessment`);
      if (riskRes.ok) {
        const riskData = await riskRes.json();
        setRiskResult(riskData);
      } else {
        // If no assessment exists, create one
        const createRes = await fetch(`/api/patients/${patientId}/risk-assessment`, {
          method: 'POST'
        });
        if (createRes.ok) {
          const riskData = await createRes.json();
          setRiskResult(riskData);
        }
      }
    } catch (error) {
      console.error('Error fetching risk assessment:', error);
      setError('Risk değerlendirmesi alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low':
      case 'düşük':
        return 'success';
      case 'medium':
      case 'orta':
        return 'warning';
      case 'high':
      case 'yüksek':
        return 'error';
      case 'very_high':
      case 'çok yüksek':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low':
      case 'düşük':
        return <CheckCircle />;
      case 'medium':
      case 'orta':
        return <Warning />;
      case 'high':
      case 'yüksek':
      case 'very_high':
      case 'çok yüksek':
        return <ErrorIcon />;
      default:
        return <Info />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Yapay Zeka Analizi Yapılıyor...
            </Typography>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Hasta verileri analiz ediliyor, lütfen bekleyin...
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Psychology sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h1">
            Yapay Zeka Risk Değerlendirme Sonucu
          </Typography>
          {patient && (
            <Typography variant="body2" color="text.secondary">
              Dosya No: {patient.fileNumber}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Risk Level Card */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h5" gutterBottom>
              Genel Risk Seviyesi
            </Typography>
            <Chip
              icon={getRiskIcon(riskResult?.finalRiskLevel || 'unknown')}
              label={riskResult?.finalRiskLevel || 'Değerlendiriliyor'}
              color={getRiskColor(riskResult?.finalRiskLevel || 'unknown')}
              sx={{ fontSize: '1.2rem', py: 3, px: 2 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Scores Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                🎯 Kural Tabanlı Skor
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h3" color="primary" sx={{ textAlign: 'center', my: 2 }}>
                {riskResult?.ruleBasedScore || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                JMF kriterleri ve Eldeniz çalışması baz alınarak hesaplanmıştır.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="secondary">
                🤖 Yapay Zeka Skoru
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h3" color="secondary" sx={{ textAlign: 'center', my: 2 }}>
                {riskResult?.mlScore ? `${(riskResult.mlScore * 100).toFixed(1)}%` : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tanı konulmuş ve sağlıklı hasta verileri ile eğitilmiş model tahmini.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recommendations */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            📋 Öneriler
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {riskResult?.recommendations?.map((rec: string, index: number) => (
              <Alert key={index} severity="info">
                {rec}
              </Alert>
            )) || (
              <Alert severity="info">
                Risk seviyesine göre öneriler değerlendiriliyor...
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Actions */}
      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="outlined"
          onClick={() => router.push(`/patients/${patientId}`)}
        >
          Hasta Detayına Dön
        </Button>
        <Button
          variant="contained"
          onClick={() => router.push('/patients')}
        >
          Hasta Listesine Dön
        </Button>
      </Box>
    </Container>
  );
}

