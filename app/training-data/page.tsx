'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Alert,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import {
  Storage as StorageIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

interface TrainingPatient {
  id: number;
  patientCode: string;
  ageMonths: number;
  gender: string;
  hasImmuneDeficiency: boolean;
  diagnosisType: string | null;
  ruleBasedScore: number | null;
  finalRiskLevel: string | null;
  sourceFile: string | null;
}

export default function TrainingDataPage() {
  const [trainingData, setTrainingData] = useState<TrainingPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);

  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/training-data');
      if (response.ok) {
        const data = await response.json();
        setTrainingData(data);
      }
    } catch (error) {
      console.error('Training data yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm('200 eğitim verisi yüklenecek. Devam edilsin mi?')) return;

    try {
      setSeeding(true);
      setSeedResult(null);

      const response = await fetch('/api/training-data/seed', {
        method: 'POST'
      });

      const data = await response.json();
      setSeedResult(data);

      if (data.success) {
        await loadTrainingData();
      }
    } catch (error) {
      setSeedResult({
        success: false,
        message: 'Seed işlemi başarısız',
      });
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PsychologyIcon sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Model Eğitim Datası
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          AI/ML modeli için kullanılan anonimleştirilmiş eğitim veri seti
        </Typography>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Toplam Kayıt
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {trainingData.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              İmmün Yetmezlik
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {trainingData.filter(p => p.hasImmuneDeficiency).length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Kaynak
            </Typography>
            <Typography variant="h6">
              ANA TABLO.xlsx
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Seed Button */}
      {trainingData.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
          <StorageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Henüz eğitim verisi yüklenmemiş
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            200 anonimleştirilmiş hasta kaydını model eğitimi için yükleyin
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={seeding ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            onClick={handleSeed}
            disabled={seeding}
          >
            {seeding ? 'Yükleniyor...' : 'Eğitim Verisini Yükle'}
          </Button>
        </Paper>
      )}

      {/* Seed Result */}
      {seedResult && (
        <Alert 
          severity={seedResult.success ? 'success' : 'error'}
          icon={seedResult.success ? <CheckCircleIcon /> : undefined}
          sx={{ mb: 3 }}
        >
          {seedResult.message}
          {seedResult.results && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                ✅ Başarılı: {seedResult.results.success} | ❌ Başarısız: {seedResult.results.failed}
              </Typography>
            </Box>
          )}
        </Alert>
      )}

      {/* Data Table */}
      {trainingData.length > 0 && (
        <Paper>
          <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              📊 Eğitim Veri Seti ({trainingData.length} kayıt)
            </Typography>
            {trainingData.length < 200 && (
              <Button
                variant="outlined"
                size="small"
                sx={{ bgcolor: 'white', color: 'secondary.main' }}
                startIcon={<CloudUploadIcon />}
                onClick={handleSeed}
                disabled={seeding}
              >
                Veri Yükle
              </Button>
            )}
          </Box>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Kod</strong></TableCell>
                  <TableCell><strong>Yaş (Ay)</strong></TableCell>
                  <TableCell><strong>Cinsiyet</strong></TableCell>
                  <TableCell><strong>Tanı</strong></TableCell>
                  <TableCell><strong>Risk Puanı</strong></TableCell>
                  <TableCell><strong>Risk Seviyesi</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainingData.slice(0, 100).map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>
                      <Chip label={patient.patientCode} size="small" color="secondary" variant="outlined" />
                    </TableCell>
                    <TableCell>{patient.ageMonths} ay</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>
                      <Chip 
                        label={patient.hasImmuneDeficiency ? 'İmmün Yetmezlik' : 'Normal'} 
                        size="small" 
                        color={patient.hasImmuneDeficiency ? 'error' : 'success'}
                      />
                    </TableCell>
                    <TableCell>{patient.ruleBasedScore || '-'}</TableCell>
                    <TableCell>{patient.finalRiskLevel || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {trainingData.length > 100 && (
            <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100' }}>
              <Typography variant="body2" color="text.secondary">
                İlk 100 kayıt gösteriliyor. Toplam: {trainingData.length}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Info */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Not:</strong> Bu veri seti AI/ML modelinin eğitimi için kullanılır. 
          Tüm veriler anonimleştirilmiştir ve hasta kodları (P001, P002, vb.) ile tanımlanır.
        </Typography>
      </Alert>
    </Container>
  );
}

