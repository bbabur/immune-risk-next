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
  Divider,
  CircularProgress,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Psychology, 
  ArrowBack, 
  CheckCircle, 
  Warning, 
  Error as ErrorIcon,
  Info,
  LocalHospital,
  Refresh
} from '@mui/icons-material';

interface MLResult {
  success: boolean;
  prediction: number;
  probability: number | null;
  risk_level: string;
  message: string;
  features: Record<string, number>;
  patientId: string;
  patientFileNumber: string;
  assessmentDate: string;
}

export default function MLResultPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<MLResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      // Önce session storage'dan sonucu al
      const storedResult = sessionStorage.getItem('mlResult');
      
      if (storedResult) {
        try {
          const parsed = JSON.parse(storedResult);
          setResult(parsed);
          setLoading(false);
          return;
        } catch {
          // Session storage'dan okunamadı, API'den dene
        }
      }
      
      // Session storage'da yoksa veritabanından çek
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/patients/${patientId}/ml-assessment`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // API'den gelen veriyi uygun formata çevir
          setResult({
            success: true,
            prediction: data.ml_prediction,
            probability: data.ml_probability,
            risk_level: data.ml_risk_level || data.risk_level,
            message: data.recommendation || '',
            features: data.ml_features ? JSON.parse(data.ml_features) : {},
            patientId: patientId,
            assessmentDate: data.assessment_date
          });
        } else {
          setError('ML değerlendirme sonucu bulunamadı. Lütfen değerlendirmeyi yapın.');
        }
      } catch (err) {
        setError('ML değerlendirme sonucu yüklenemedi.');
      }
      
      setLoading(false);
    };
    
    fetchResult();
  }, [patientId]);

  const getRiskColor = (riskLevel: string) => {
    if (riskLevel.includes('Çok Yüksek')) return 'error';
    if (riskLevel.includes('Yüksek')) return 'error';
    if (riskLevel.includes('Orta')) return 'warning';
    return 'success';
  };

  const getRiskBgColor = (riskLevel: string) => {
    if (riskLevel.includes('Çok Yüksek')) return '#ffebee';
    if (riskLevel.includes('Yüksek')) return '#fff3e0';
    if (riskLevel.includes('Orta')) return '#fffde7';
    return '#e8f5e9';
  };

  const getRiskIcon = (riskLevel: string) => {
    if (riskLevel.includes('Çok Yüksek')) return <ErrorIcon color="error" sx={{ fontSize: 60 }} />;
    if (riskLevel.includes('Yüksek')) return <Warning color="error" sx={{ fontSize: 60 }} />;
    if (riskLevel.includes('Orta')) return <Warning color="warning" sx={{ fontSize: 60 }} />;
    return <CheckCircle color="success" sx={{ fontSize: 60 }} />;
  };

  const getRecommendations = (riskLevel: string, prediction: number) => {
    if (prediction === 1) {
      if (riskLevel.includes('Çok Yüksek')) {
        return [
          'Acil pediatrik immünoloji konsültasyonu gereklidir',
          'Kapsamlı immünolojik değerlendirme yapılmalıdır',
          'Genetik testler planlanmalıdır',
          'Hasta yakın takibe alınmalıdır',
          'Enfeksiyon profilaksisi değerlendirilmelidir'
        ];
      } else if (riskLevel.includes('Yüksek')) {
        return [
          'Pediatrik immünoloji konsültasyonu önerilir',
          'İmmünoglobulin düzeyleri ve lenfosit alt grupları değerlendirilmelidir',
          'Aile öyküsü detaylı sorgulanmalıdır',
          '3 ay içinde kontrol muayenesi planlanmalıdır'
        ];
      } else {
        return [
          'Takip ve ek testler önerilir',
          'İmmünoglobulin düzeyleri kontrol edilmelidir',
          '6 ay içinde tekrar değerlendirme yapılmalıdır'
        ];
      }
    } else {
      return [
        'Rutin pediatrik takip önerilir',
        'Şüpheli bulgular gelişirse tekrar değerlendirme yapılabilir',
        'Aşı takvimi kontrol edilmelidir'
      ];
    }
  };

  const featureLabels: Record<string, string> = {
    otit_sayisi_ge_4: '1 Yıl İçinde Otit ≥4',
    sinuzit_sayisi_ge_2: '1 Yıl İçinde Sinüzit ≥2',
    iki_aydan_fazla_ab: '2 Ay+ Antibiyotik',
    pnomoni_ge_2: '1 Yıl İçinde Pnömoni ≥2',
    kilo_alamama: 'Kilo Alamama',
    tekrarlayan_apse: 'Tekrarlayan Apse',
    pamukcuk_mantar: 'Pamukçuk/Mantar',
    iv_antibiyotik: 'IV Antibiyotik',
    derin_enf_ge_2: 'Derin Enfeksiyon ≥2',
    aile_oykusu_boy: 'Ailede İmmün Yetmezlik',
    cinsiyet: 'Cinsiyet',
    yas: 'Yaş',
    hastane_yatis: 'Hastane Yatışı',
    bcg_lenfadenopati: 'BCG Lenfadenopati',
    kronik_cilt: 'Kronik Cilt Problemi',
    gobek_kordon_gunu: 'Göbek Kordon Günü',
    konjenital_kalp: 'Konjenital Kalp',
    kronik_ishal: 'Kronik İshal',
    yogun_bakim: 'Yoğun Bakım',
    akrabalik: 'Akrabalık',
    aile_erken_olum: 'Ailede Erken Ölüm',
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !result) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Sonuç bulunamadı'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => router.push(`/patients/${patientId}/ml-assessment`)}
        >
          Değerlendirmeyi Tekrarla
        </Button>
      </Container>
    );
  }

  const recommendations = getRecommendations(result.risk_level, result.prediction);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push(`/patients/${patientId}`)}
        >
          Hasta Sayfasına Dön
        </Button>
        <Typography variant="h4" component="h1">
          <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
          ML Değerlendirme Sonucu
        </Typography>
      </Box>

      {result.patientFileNumber && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip label={`Dosya No: ${result.patientFileNumber}`} color="primary" />
            <Chip 
              label={`Değerlendirme: ${new Date(result.assessmentDate).toLocaleString('tr-TR')}`} 
              variant="outlined" 
            />
          </Stack>
        </Paper>
      )}

      {/* Ana Sonuç Kartı */}
      <Card sx={{ mb: 3, bgcolor: getRiskBgColor(result.risk_level) }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
            <Box textAlign="center">
              {getRiskIcon(result.risk_level)}
              <Typography variant="h2" component="div" sx={{ mt: 1 }}>
                {result.prediction === 1 ? 'RİSKLİ' : 'DÜŞÜK RİSK'}
              </Typography>
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            
            <Box flex={1}>
              <Typography variant="h5" gutterBottom>
                Risk Seviyesi: <Chip 
                  label={result.risk_level} 
                  color={getRiskColor(result.risk_level) as any}
                  size="medium"
                />
              </Typography>
              
              {result.probability !== null && (
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Tahmin Olasılığı: <strong>%{(result.probability * 100).toFixed(1)}</strong>
                </Typography>
              )}
              
              <Typography variant="body1" sx={{ mt: 2 }}>
                {result.message}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Öneriler */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
            Öneriler
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {recommendations.map((rec, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Info color="primary" />
                </ListItemIcon>
                <ListItemText primary={rec} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Değerlendirmede Kullanılan Özellikler */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Değerlendirmede Kullanılan Veriler
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box display="flex" flexWrap="wrap" gap={1}>
            {Object.entries(result.features).map(([key, value]) => {
              const label = featureLabels[key] || key;
              let displayValue = value;
              
              // Özel gösterimler
              if (key === 'cinsiyet') {
                displayValue = value === 1 ? 'Erkek' : 'Kız';
              } else if (key === 'yas') {
                displayValue = `${value.toFixed(1)} yıl`;
              } else if (key === 'gobek_kordon_gunu') {
                displayValue = `${value} gün`;
              } else {
                displayValue = value === 1 ? 'Evet' : 'Hayır';
              }
              
              const isPositive = typeof value === 'number' && value === 1 && 
                !['cinsiyet', 'yas', 'gobek_kordon_gunu'].includes(key);
              
              return (
                <Chip
                  key={key}
                  label={`${label}: ${displayValue}`}
                  color={isPositive ? 'warning' : 'default'}
                  variant={isPositive ? 'filled' : 'outlined'}
                  size="small"
                />
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Aksiyon Butonları */}
      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => router.push(`/patients/${patientId}/ml-assessment`)}
        >
          Tekrar Değerlendir
        </Button>
        <Button
          variant="contained"
          onClick={() => router.push(`/patients/${patientId}`)}
        >
          Hasta Sayfasına Dön
        </Button>
      </Box>
    </Container>
  );
}

