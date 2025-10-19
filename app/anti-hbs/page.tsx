'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Alert,
  AlertTitle,
  Chip,
  CircularProgress,
  Button,
  Divider,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Vaccines as VaccinesIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

interface AntiHbsReference {
  id: number;
  ageGroupName: string;
  minAgeMonths: number;
  maxAgeMonths: number | null;
  expectedMinValue: number | null;
  expectedMaxValue: number | null;
  typicalRange: string;
  seroprotectionThreshold: number;
  seroprotectionRate: string;
  description: string;
  sourceReference: string;
  isBoosterResponse: boolean;
}

export default function AntiHbsPage() {
  const [references, setReferences] = useState<AntiHbsReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    loadReferences();
  }, []);

  const loadReferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/anti-hbs');
      
      if (!response.ok) {
        throw new Error('Veriler yüklenemedi');
      }
      
      const data = await response.json();
      setReferences(data);
      
      // Eğer veri yoksa, seed işlemini öner
      if (data.length === 0) {
        setError('Referans verileri bulunamadı. Lütfen "Verileri Yükle" butonuna tıklayın.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    try {
      setSeeding(true);
      setError(null);
      
      const response = await fetch('/api/anti-hbs/seed', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Veri yükleme başarısız');
      }
      
      // Verileri yeniden yükle
      await loadReferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri yükleme hatası');
    } finally {
      setSeeding(false);
    }
  };

  // Normal referanslar ve booster referansı ayır
  const normalReferences = references.filter(ref => !ref.isBoosterResponse);
  const boosterReference = references.find(ref => ref.isBoosterResponse);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <VaccinesIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Anti-HBs (mIU/mL) — Aşılı Hastada Yaşa Göre Beklenen Değerler
          </Typography>
        </Box>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <AlertTitle>Koruyucu Eşik Değeri</AlertTitle>
          <Typography variant="body2">
            <strong>Anti-HBs ≥10 mIU/mL</strong> → Koruyucu seviye. Bu, WHO ve diğer kılavuzların ortak kabulüdür.
          </Typography>
        </Alert>
      </Box>

      {/* Error veya seed button */}
      {error && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleSeedData}
              disabled={seeding}
            >
              {seeding ? 'Yükleniyor...' : 'Verileri Yükle'}
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Seed button */}
      {references.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleSeedData}
            disabled={seeding}
            startIcon={seeding ? <CircularProgress size={16} /> : null}
          >
            {seeding ? 'Veriler Yenileniyor...' : 'Verileri Yenile'}
          </Button>
        </Box>
      )}

      {/* Ana Tablo - Normal Yaş Grupları */}
      {normalReferences.length > 0 && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Yaş Grubu</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipik Beklenen Anti-HBs Aralığı (mIU/mL)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Seroproteksiyon Oranı</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Açıklama</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Kaynak</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {normalReferences.map((reference) => (
                <TableRow key={reference.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {reference.ageGroupName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {reference.minAgeMonths} - {reference.maxAgeMonths || '∞'} ay
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {reference.typicalRange}
                    </Typography>
                    {reference.expectedMinValue !== null && reference.expectedMaxValue !== null && (
                      <Chip 
                        label={`${reference.expectedMinValue} - ${reference.expectedMaxValue} mIU/mL`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={reference.seroprotectionRate}
                      color={
                        reference.seroprotectionRate.includes('90') || reference.seroprotectionRate.includes('99') 
                          ? 'success' 
                          : reference.seroprotectionRate.includes('70') || reference.seroprotectionRate.includes('85')
                          ? 'info'
                          : 'warning'
                      }
                      icon={
                        reference.seroprotectionRate.includes('90') || reference.seroprotectionRate.includes('99')
                          ? <CheckCircleIcon />
                          : <WarningIcon />
                      }
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                      Eşik: ≥{reference.seroprotectionThreshold} mIU/mL
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {reference.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={reference.sourceReference}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Booster Bilgisi */}
      {boosterReference && (
        <Card sx={{ mb: 4, bgcolor: 'success.light', color: 'success.contrastText' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                {boosterReference.ageGroupName}
              </Typography>
            </Box>
            <Divider sx={{ my: 2, bgcolor: 'success.dark', opacity: 0.3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Tipik Aralık:
                </Typography>
                <Typography variant="body2">
                  {boosterReference.typicalRange}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Seroproteksiyon:
                </Typography>
                <Typography variant="body2">
                  {boosterReference.seroprotectionRate}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Kaynak:
                </Typography>
                <Typography variant="body2">
                  {boosterReference.sourceReference}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {boosterReference.description}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Klinik Yorumlar */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InfoIcon sx={{ fontSize: 28, mr: 1, color: 'info.main' }} />
          <Typography variant="h6" fontWeight="bold">
            Kısa, Pratik Yorumlar (Klinisyen Yönlendirmesi)
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="success" icon={<CheckCircleIcon />}>
            <AlertTitle>Koruyucu Eşik</AlertTitle>
            <Typography variant="body2">
              <strong>Anti-HBs ≥10 mIU/mL → koruyucu.</strong> Bu, WHO ve diğer kılavuzların ortak kabulüdür.
            </Typography>
          </Alert>

          <Alert severity="info">
            <AlertTitle>Zamanla Düşme Normaldir</AlertTitle>
            <Typography variant="body2">
              Primer seri sonrası yıl içinde yüksek titrelere ulaşılır; yıllarla antikor düzeyleri düşebilir. 
              Düşük/negatif anti-HBs saptansa da aşılanmış kişide bağışıklık hafızası (anamnestic yanıt) 
              korunuyorsa klinik koruma devam eder. Büyük gözlemsel ve uzun dönem çalışmalar bunu destekler.
            </Typography>
          </Alert>

          <Alert severity="warning">
            <AlertTitle>Hafıza Yanıtı</AlertTitle>
            <Typography variant="body2">
              Düşük titreli veya negatif anti-HBs olan aşılı kişilerde, virüs maruziyeti veya booster dozu 
              sonrasında hızlı anamnestic (hafıza) yanıt gözlenir. Bu, uzun vadeli korumanın devam ettiğini gösterir.
            </Typography>
          </Alert>
        </Box>
      </Paper>

      {/* Dipnot */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Not:</strong> Bu değerler literatür taramalarına dayanmaktadır ve popülasyonlar arasında 
          değişkenlik gösterebilir. Bireysel değerlendirme için klinik bağlam ve hasta öyküsü göz önünde 
          bulundurulmalıdır. Kaynak referanslar ilgili literatürden derlenmiştir.
        </Typography>
      </Box>
    </Container>
  );
}

