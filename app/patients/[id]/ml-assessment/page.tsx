'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Box,
  Alert,
  Divider,
  CircularProgress,
  TextField,
  Paper,
  Chip
} from '@mui/material';
import { Psychology, ArrowBack, PlayArrow } from '@mui/icons-material';

interface MLFeatures {
  otit_sayisi_ge_4: number;
  sinuzit_sayisi_ge_2: number;
  iki_aydan_fazla_ab: number;
  pnomoni_ge_2: number;
  kilo_alamama: number;
  tekrarlayan_apse: number;
  pamukcuk_mantar: number;
  iv_antibiyotik: number;
  derin_enf_ge_2: number;
  aile_oykusu_boy: number;
  cinsiyet: number;
  yas: number;
  hastane_yatis: number;
  bcg_lenfadenopati: number;
  kronik_cilt: number;
  gobek_kordon_gunu: number;
  konjenital_kalp: number;
  kronik_ishal: number;
  yogun_bakim: number;
  akrabalik: number;
  aile_erken_olum: number;
}

interface PatientData {
  id: number;
  fileNumber: string;
  ageYears: number;
  ageMonths: number;
  gender: string;
  cordFallDay?: number;
  parentalConsanguinity: string;
}

const featureLabels: Record<keyof Omit<MLFeatures, 'cinsiyet' | 'yas' | 'gobek_kordon_gunu'>, string> = {
  otit_sayisi_ge_4: '1 Yıl İçinde Otit Sayısı ≥4',
  sinuzit_sayisi_ge_2: '1 Yıl İçinde Sinüzit Sayısı ≥2',
  iki_aydan_fazla_ab: '2 Aydan Fazla Oral Antibiyotik Kullanımı',
  pnomoni_ge_2: '1 Yıl İçinde ≥2 Pnömoni',
  kilo_alamama: 'Bebeğin Kilo Alamaması veya Normal Büyümemesi',
  tekrarlayan_apse: 'Tekrarlayan, Derin Cilt veya Organ Apseleri',
  pamukcuk_mantar: 'Ağızda veya Deride Kalıcı Pamukçuk veya Mantar',
  iv_antibiyotik: 'İntravenöz Antibiyotik Gerektiren Enfeksiyonlar',
  derin_enf_ge_2: 'Septisemi Dahil ≥2 Derin Enfeksiyon',
  aile_oykusu_boy: 'Ailede Doğuştan İmmün Yetmezlik Öyküsü',
  hastane_yatis: 'Hastaneye Yatış Varlığı',
  bcg_lenfadenopati: 'BCG Aşısı Sonrası Lenfadenopati',
  kronik_cilt: 'Kronik Cilt (Deri) Problemleri',
  konjenital_kalp: 'Konjenital Kalp Hastalığı',
  kronik_ishal: 'Kronik İshal',
  yogun_bakim: 'Yoğun Bakımda Yatış',
  akrabalik: 'Anne-Baba Arasında Akrabalık Varlığı',
  aile_erken_olum: 'Ailede Erken Ölüm Öyküsü',
};

export default function MLAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<PatientData | null>(null);
  
  const [features, setFeatures] = useState<MLFeatures>({
    otit_sayisi_ge_4: 0,
    sinuzit_sayisi_ge_2: 0,
    iki_aydan_fazla_ab: 0,
    pnomoni_ge_2: 0,
    kilo_alamama: 0,
    tekrarlayan_apse: 0,
    pamukcuk_mantar: 0,
    iv_antibiyotik: 0,
    derin_enf_ge_2: 0,
    aile_oykusu_boy: 0,
    cinsiyet: 0,
    yas: 0,
    hastane_yatis: 0,
    bcg_lenfadenopati: 0,
    kronik_cilt: 0,
    gobek_kordon_gunu: 7,
    konjenital_kalp: 0,
    kronik_ishal: 0,
    yogun_bakim: 0,
    akrabalik: 0,
    aile_erken_olum: 0,
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.replace('/login');
          return;
        }

        const response = await fetch(`/api/patients/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Hasta bilgileri alınamadı');
        }

        const data = await response.json();
        setPatient(data);
        
        // Hasta verilerinden otomatik doldurulan alanlar
        const age = data.ageYears + (data.ageMonths || 0) / 12;
        const gender = data.gender === 'male' ? 1 : 0;
        const cordDay = data.cordFallDay || 7;
        const consanguinity = data.parentalConsanguinity === '1' ? 1 : 0;
        
        setFeatures(prev => ({
          ...prev,
          cinsiyet: gender,
          yas: age,
          gobek_kordon_gunu: cordDay,
          akrabalik: consanguinity,
        }));
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId, router]);

  const handleFeatureChange = (name: keyof MLFeatures, value: number) => {
    setFeatures(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      // ML değerlendirmesi yap ve veritabanına kaydet
      const response = await fetch(`/api/patients/${patientId}/ml-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ features }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'ML değerlendirmesi yapılamadı');
      }

      // Sonucu session storage'a kaydet ve sonuç sayfasına yönlendir
      sessionStorage.setItem('mlResult', JSON.stringify({
        success: result.success,
        prediction: result.prediction,
        probability: result.probability,
        risk_level: result.risk_level,
        message: result.message,
        recommendation: result.recommendation,
        assessmentId: result.assessment?.id,
        features,
        patientId,
        patientFileNumber: patient?.fileNumber,
        assessmentDate: new Date().toISOString()
      }));
      
      router.push(`/patients/${patientId}/ml-result`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'ML değerlendirmesi yapılırken hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push(`/patients/${patientId}`)}
        >
          Geri
        </Button>
        <Typography variant="h4" component="h1">
          <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
          ML Risk Değerlendirmesi
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {patient && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip label={`Dosya No: ${patient.fileNumber}`} color="primary" />
            <Chip label={`Yaş: ${patient.ageYears} yıl ${patient.ageMonths} ay`} />
            <Chip label={`Cinsiyet: ${patient.gender === 'male' ? 'Erkek' : 'Kız'}`} />
          </Stack>
        </Paper>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Enfeksiyon Kriterleri
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Stack spacing={2}>
            {(['otit_sayisi_ge_4', 'sinuzit_sayisi_ge_2', 'pnomoni_ge_2', 'derin_enf_ge_2'] as const).map((key) => (
              <FormControl key={key} component="fieldset">
                <Typography variant="body1" sx={{ mb: 1 }}>{featureLabels[key]}</Typography>
                <RadioGroup
                  row
                  value={features[key]}
                  onChange={(e) => handleFeatureChange(key, parseInt(e.target.value))}
                >
                  <FormControlLabel value={0} control={<Radio />} label="Hayır" />
                  <FormControlLabel value={1} control={<Radio />} label="Evet" />
                </RadioGroup>
              </FormControl>
            ))}
          </Stack>

          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 4 }}>
            Tedavi ve Hastane Kriterleri
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Stack spacing={2}>
            {(['iki_aydan_fazla_ab', 'iv_antibiyotik', 'hastane_yatis', 'yogun_bakim'] as const).map((key) => (
              <FormControl key={key} component="fieldset">
                <Typography variant="body1" sx={{ mb: 1 }}>{featureLabels[key]}</Typography>
                <RadioGroup
                  row
                  value={features[key]}
                  onChange={(e) => handleFeatureChange(key, parseInt(e.target.value))}
                >
                  <FormControlLabel value={0} control={<Radio />} label="Hayır" />
                  <FormControlLabel value={1} control={<Radio />} label="Evet" />
                </RadioGroup>
              </FormControl>
            ))}
          </Stack>

          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 4 }}>
            Klinik Özellikler
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Stack spacing={2}>
            {(['kilo_alamama', 'tekrarlayan_apse', 'pamukcuk_mantar', 'bcg_lenfadenopati', 'kronik_cilt', 'konjenital_kalp', 'kronik_ishal'] as const).map((key) => (
              <FormControl key={key} component="fieldset">
                <Typography variant="body1" sx={{ mb: 1 }}>{featureLabels[key]}</Typography>
                <RadioGroup
                  row
                  value={features[key]}
                  onChange={(e) => handleFeatureChange(key, parseInt(e.target.value))}
                >
                  <FormControlLabel value={0} control={<Radio />} label="Hayır" />
                  <FormControlLabel value={1} control={<Radio />} label="Evet" />
                </RadioGroup>
              </FormControl>
            ))}
          </Stack>

          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 4 }}>
            Aile Öyküsü
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Stack spacing={2}>
            {(['aile_oykusu_boy', 'akrabalik', 'aile_erken_olum'] as const).map((key) => (
              <FormControl key={key} component="fieldset">
                <Typography variant="body1" sx={{ mb: 1 }}>{featureLabels[key]}</Typography>
                <RadioGroup
                  row
                  value={features[key]}
                  onChange={(e) => handleFeatureChange(key, parseInt(e.target.value))}
                >
                  <FormControlLabel value={0} control={<Radio />} label="Hayır" />
                  <FormControlLabel value={1} control={<Radio />} label="Evet" />
                </RadioGroup>
              </FormControl>
            ))}
          </Stack>

          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 4 }}>
            Demografik Bilgiler (Otomatik Dolduruldu)
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Yaş (Yıl)"
              type="number"
              value={features.yas}
              onChange={(e) => handleFeatureChange('yas', parseFloat(e.target.value) || 0)}
              inputProps={{ step: 0.1 }}
              fullWidth
            />
            <FormControl component="fieldset" fullWidth>
              <Typography variant="body2" sx={{ mb: 1 }}>Cinsiyet</Typography>
              <RadioGroup
                row
                value={features.cinsiyet}
                onChange={(e) => handleFeatureChange('cinsiyet', parseInt(e.target.value))}
              >
                <FormControlLabel value={0} control={<Radio />} label="Kız" />
                <FormControlLabel value={1} control={<Radio />} label="Erkek" />
              </RadioGroup>
            </FormControl>
            <TextField
              label="Göbek Kordonu Düşme Günü"
              type="number"
              value={features.gobek_kordon_gunu}
              onChange={(e) => handleFeatureChange('gobek_kordon_gunu', parseInt(e.target.value) || 7)}
              fullWidth
            />
          </Stack>

          <Box display="flex" justifyContent="center" gap={2} sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => router.push(`/patients/${patientId}`)}
              disabled={submitting}
            >
              İptal
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Değerlendiriliyor...' : 'ML Değerlendirmesini Çalıştır'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

