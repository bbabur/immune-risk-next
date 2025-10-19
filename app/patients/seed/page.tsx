'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Alert,
  AlertTitle,
  CircularProgress,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface SeedStatus {
  currentPatients: number;
  seedDataCount: number;
  isSeeded: boolean;
  message: string;
}

interface SeedResult {
  success: boolean;
  message: string;
  results?: {
    success: number;
    failed: number;
    errors: string[];
  };
}

export default function PatientSeedPage() {
  const router = useRouter();
  const [status, setStatus] = useState<SeedStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/patients/seed');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Status yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm(`${status?.seedDataCount || 0} hasta verisi yüklenecek. Devam etmek istiyor musunuz?`)) {
      return;
    }

    try {
      setSeeding(true);
      setResult(null);

      const response = await fetch('/api/patients/seed', {
        method: 'POST'
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Status'u yenile
        await loadStatus();
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Seed işlemi başarısız',
        results: {
          success: 0,
          failed: 0,
          errors: [error instanceof Error ? error.message : 'Bilinmeyen hata']
        }
      });
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <PeopleIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Hasta Verilerini Yükle
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ANA TABLO.xlsx dosyasındaki tüm hasta verilerini veritabanına yükleyin
        </Typography>
      </Box>

      {/* Status Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Mevcut Durum
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Mevcut Hasta Sayısı
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {status?.currentPatients || 0}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Yüklenecek Veri
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {status?.seedDataCount || 0}
              </Typography>
            </Box>
          </Box>
          
          {status?.isSeeded && (
            <Chip 
              icon={<CheckCircleIcon />}
              label="Veriler yüklenmiş görünüyor" 
              color="success" 
              sx={{ mt: 1 }}
            />
          )}
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
        <AlertTitle>Bilgi</AlertTitle>
        <List dense>
          <ListItem disablePadding>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleIcon fontSize="small" color="info" />
            </ListItemIcon>
            <ListItemText primary="200 hasta kaydı yüklenecek" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleIcon fontSize="small" color="info" />
            </ListItemIcon>
            <ListItemText primary="Demografik bilgiler, klinik özellikler ve aile öyküsü dahil" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleIcon fontSize="small" color="info" />
            </ListItemIcon>
            <ListItemText primary="İşlem birkaç dakika sürebilir" />
          </ListItem>
        </List>
      </Alert>

      {/* Seed Button */}
      <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={seeding ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
          onClick={handleSeed}
          disabled={seeding}
          fullWidth
          sx={{ py: 2 }}
        >
          {seeding ? 'Yükleniyor...' : 'Verileri Yükle'}
        </Button>

        {seeding && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Lütfen bekleyin, veriler yükleniyor...
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Result */}
      {result && (
        <Alert 
          severity={result.success ? 'success' : 'error'}
          icon={result.success ? <CheckCircleIcon /> : <ErrorIcon />}
          sx={{ mb: 3 }}
        >
          <AlertTitle>{result.message}</AlertTitle>
          
          {result.results && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                ✅ Başarılı: {result.results.success}
              </Typography>
              <Typography variant="body2">
                ❌ Başarısız: {result.results.failed}
              </Typography>
              
              {result.results.errors && result.results.errors.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Hatalar:
                  </Typography>
                  <List dense>
                    {result.results.errors.map((error, i) => (
                      <ListItem key={i} disablePadding>
                        <ListItemText 
                          primary={error}
                          primaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}

          {result.success && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push('/patients')}
              >
                Hastalara Git
              </Button>
            </Box>
          )}
        </Alert>
      )}

      {/* Warning */}
      {status && status.currentPatients > 0 && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <AlertTitle>Dikkat</AlertTitle>
          Veritabanında zaten {status.currentPatients} hasta kaydı var. 
          Seed işlemi yeni kayıtlar ekleyecektir (mevcut kayıtları silmez).
        </Alert>
      )}
    </Container>
  );
}

