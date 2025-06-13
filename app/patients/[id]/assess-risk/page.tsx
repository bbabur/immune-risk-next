import { Typography, Paper, Box, TextField, Button, Card, CardContent, CardHeader, Alert, Stack } from '@mui/material';
import { BarChart, Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';

export default function AssessRisk({ params }: { params: { id: string } }) {
  // Örnek veriler - gerçek uygulamada API'den gelecek
  const patient = { id: params.id, name: 'Ahmet Yılmaz' };
  const primaryScore = 25;
  const secondaryScore = 15;
  const ruleScore = 40;
  const mlScore = 35;
  const mlProbability = 0.25;
  const totalScore = 42;
  const riskLevel = 'Orta Risk';

  const getRiskColor = () => {
    if (riskLevel.includes('Düşük')) return '#d1e7dd';
    if (riskLevel.includes('Orta')) return '#fff3cd';
    if (riskLevel.includes('Yüksek')) return '#f8d7da';
    if (riskLevel.includes('Çok Yüksek')) return '#dc3545';
    return '#f8f9fa';
  };

  const getRecommendation = () => {
    if (riskLevel.includes('Düşük')) {
      return 'Rutin pediatrik takip önerilir.';
    } else if (riskLevel.includes('Orta')) {
      return 'İmmünoglobulin seviyeleri, tam kan sayımı ve tam lenfosit alt grup analizi önerilir. 3 ay içinde tekrar değerlendirme yapılmalıdır.';
    } else if (riskLevel.includes('Yüksek')) {
      return 'Pediatrik immünoloji konsültasyonu önerilir. Kapsamlı immün değerlendirme (hücresel ve humoral immünite) yapılmalıdır.';
    } else {
      return 'Acil pediatrik immünoloji konsültasyonu gereklidir. Kapsamlı immünolojik değerlendirme, genetik testler ve yakın takip önerilir.';
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BarChart /> Risk Değerlendirmesi - {patient.name}
      </Typography>

      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Card sx={{ flex: 1 }}>
            <CardHeader title="Kural Tabanlı Değerlendirme" />
            <CardContent>
              <Typography>Birincil kriterler skoru: <strong>{primaryScore}</strong></Typography>
              <Typography>İkincil kriterler skoru: <strong>{secondaryScore}</strong></Typography>
              <Typography>Toplam kural puanı: <strong>{ruleScore}</strong></Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardHeader title="ML Modeli Değerlendirmesi" />
            <CardContent>
              {mlScore !== null ? (
                <>
                  <Typography>Model skoru: <strong>{mlScore}</strong></Typography>
                  <Typography>İmmün yetmezlik olasılığı: <strong>{(mlProbability * 100).toFixed(2)}%</strong></Typography>
                </>
              ) : (
                <Alert severity="warning">
                  ML modeli henüz eğitilmemiş veya yeterli veri yok.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Stack>

        <Card sx={{ backgroundColor: getRiskColor() }}>
          <CardHeader title="Sonuç" />
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1" component="div">{totalScore}</Typography>
                <Typography variant="h6">Toplam Risk Puanı</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" gutterBottom>Risk Seviyesi: {riskLevel}</Typography>
                <Typography variant="body1">
                  {riskLevel.includes('Düşük') && 'Rutin takip önerilir. Hasta düşük risk grubundadır.'}
                  {riskLevel.includes('Orta') && 'Takip ve ek testler önerilir. Hasta orta risk grubundadır.'}
                  {riskLevel.includes('Yüksek') && !riskLevel.includes('Çok') && 'Detaylı klinik değerlendirme gerekli. Hasta yüksek risk grubundadır.'}
                  {riskLevel.includes('Çok Yüksek') && (
                    <strong>Acil uzman değerlendirmesi gerekiyor! Hasta çok yüksek risk grubundadır.</strong>
                  )}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Paper sx={{ p: 3 }}>
          <Box component="form" noValidate autoComplete="off">
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
              <TextField
                label="Değerlendiren"
                name="assessed_by"
                defaultValue="Sistem"
                placeholder="İsminizi girin"
                variant="outlined"
                sx={{ minWidth: 200 }}
              />
              <TextField
                fullWidth
                label="Öneriler"
                name="recommendation"
                multiline
                rows={3}
                defaultValue={getRecommendation()}
                placeholder="Değerlendirme sonucu önerilerinizi yazın"
                variant="outlined"
              />
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button component={Link} href={`/patients/${params.id}`} variant="outlined" color="primary">
                <Cancel /> İptal
              </Button>
              <Button type="submit" variant="contained" color="primary">
                <Save /> Değerlendirmeyi Kaydet
              </Button>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </div>
  );
} 