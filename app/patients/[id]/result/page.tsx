import { Typography, Paper, Box, Card, CardContent, CardHeader, Alert, Chip, Stack, Button } from '@mui/material';
import { Assessment, Download, Print, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

export default function ResultPage({ params }: { params: { id: string } }) {
  // Sample data - this would come from API/database
  const patient = {
    id: params.id,
    name: "Ahmet Yılmaz",
    age: 8,
    gender: "Erkek"
  };

  const riskAssessment = {
    primaryScore: 85,
    secondaryScore: 72,
    ruleScore: 78,
    mlScore: 81,
    totalScore: 79,
    riskLevel: "Yüksek Risk"
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Düşük Risk':
        return 'success';
      case 'Orta Risk':
        return 'warning';
      case 'Yüksek Risk':
        return 'error';
      default:
        return 'info';
    }
  };

  const getRecommendations = (level: string) => {
    switch (level) {
      case 'Düşük Risk':
        return [
          'Rutin takip önerilir',
          '6 ayda bir kontrol',
          'Aşı takvimine uyum',
          'Beslenme önerilerine dikkat'
        ];
      case 'Orta Risk':
        return [
          '3 ayda bir takip önerilir',
          'İmmünoglobulin düzeyleri kontrol edilmeli',
          'Enfeksiyon gelişiminde erken müdahale',
          'Profilaktik tedavi değerlendirilmeli'
        ];
      case 'Yüksek Risk':
        return [
          'Aylık takip gereklidir',
          'İmmünoloji uzmanına acil konsültasyon',
          'IVIG tedavisi değerlendirilmeli',
          'Profilaktik antibiyotik tedavisi',
          'Canlı aşılardan kaçınılmalı'
        ];
      default:
        return ['Detaylı değerlendirme gereklidir'];
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assessment /> Risk Değerlendirme Sonucu
      </Typography>

      <Stack spacing={3}>
        {/* Patient Info */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Hasta Bilgileri
          </Typography>
          <Typography variant="body1">
            <strong>Ad Soyad:</strong> {patient.name}
          </Typography>
          <Typography variant="body1">
            <strong>Yaş:</strong> {patient.age}
          </Typography>
          <Typography variant="body1">
            <strong>Cinsiyet:</strong> {patient.gender}
          </Typography>
          <Typography variant="body1">
            <strong>Hasta ID:</strong> {patient.id}
          </Typography>
        </Paper>

        {/* Risk Scores */}
        <Card>
          <CardHeader title="Risk Skorları" />
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Primer İmmün Yetmezlik Skoru:</Typography>
                <Chip label={`${riskAssessment.primaryScore}/100`} color="info" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Sekonder İmmün Yetmezlik Skoru:</Typography>
                <Chip label={`${riskAssessment.secondaryScore}/100`} color="info" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Kural Tabanlı Skor:</Typography>
                <Chip label={`${riskAssessment.ruleScore}/100`} color="info" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Makine Öğrenmesi Skoru:</Typography>
                <Chip label={`${riskAssessment.mlScore}/100`} color="info" />
              </Box>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 2,
                  pt: 2,
                  borderTop: 1,
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6">Toplam Risk Skoru:</Typography>
                <Chip 
                  label={`${riskAssessment.totalScore}/100`} 
                  color={getRiskColor(riskAssessment.riskLevel)} 
                  size="medium"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Risk Level */}
        <Card>
          <CardHeader title="Risk Seviyesi" />
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Chip 
                label={riskAssessment.riskLevel}
                color={getRiskColor(riskAssessment.riskLevel)}
                size="medium"
                sx={{ fontSize: '1.2rem', py: 1, px: 2 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader title="Öneriler" />
          <CardContent>
            <Stack spacing={1}>
              {getRecommendations(riskAssessment.riskLevel).map((recommendation, index) => (
                <Alert key={index} severity="info" sx={{ justifyContent: 'flex-start' }}>
                  {recommendation}
                </Alert>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Actions */}
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              component={Link} 
              href={`/patients/${params.id}`}
              variant="outlined" 
              startIcon={<ArrowBack />}
            >
              Hasta Sayfasına Dön
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Print />}
              onClick={() => window.print()}
            >
              Yazdır
            </Button>
            <Button 
              variant="contained" 
              color="secondary"
              startIcon={<Download />}
            >
              PDF İndir
            </Button>
          </Stack>
        </Paper>

        {/* Notes */}
        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Önemli:</strong> Bu sonuçlar sadece risk değerlendirmesi amaçlıdır. 
            Kesin tanı ve tedavi kararları için mutlaka uzman hekime başvurunuz.
          </Typography>
        </Alert>
      </Stack>
    </div>
  );
} 