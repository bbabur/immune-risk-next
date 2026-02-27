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
  TextField,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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

// API sırasına göre tüm alanlar - main.py ile birebir eşleşir
const API_FIELD_ORDER: (keyof MLFeatures)[] = [
  'otit_sayisi_ge_4',
  'sinuzit_sayisi_ge_2',
  'iki_aydan_fazla_ab',
  'pnomoni_ge_2',
  'kilo_alamama',
  'tekrarlayan_apse',
  'pamukcuk_mantar',
  'iv_antibiyotik',
  'derin_enf_ge_2',
  'aile_oykusu_boy',
  'cinsiyet',
  'yas',
  'hastane_yatis',
  'bcg_lenfadenopati',
  'kronik_cilt',
  'gobek_kordon_gunu',
  'konjenital_kalp',
  'kronik_ishal',
  'yogun_bakim',
  'akrabalik',
  'aile_erken_olum',
];

const featureLabels: Record<keyof MLFeatures, string> = {
  otit_sayisi_ge_4: '1 Yıl İçinde Otit Sayısı (≥4 risk)',
  sinuzit_sayisi_ge_2: '1 Yıl İçinde Sinüzit Sayısı (≥2 risk)',
  iki_aydan_fazla_ab: '2 Aydan Fazla Oral Antibiyotik Kullanımı (0/1)',
  pnomoni_ge_2: '1 Yıl İçinde Pnömoni Sayısı (≥2 risk)',
  kilo_alamama: 'Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi (0/1)',
  tekrarlayan_apse: 'Tekrarlayan, Derin Cilt veya Organ Apseleri (0/1)',
  pamukcuk_mantar: 'Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu (0/1)',
  iv_antibiyotik: 'İntravenöz Antibiyotik Gerektiren Enfeksiyonlar (0/1)',
  derin_enf_ge_2: 'Septisemi Dahil ≥2 Derin Enfeksiyon (sayı girin)',
  aile_oykusu_boy: 'Ailede Doğuştan İmmün Yetmezlik oyküsü (0/1)',
  cinsiyet: 'Cinsiyet (0=Erkek, 1=Kadın)',
  yas: 'Yaş (ay)',
  hastane_yatis: 'Hastaneye Yatış Varlığı (0/1)',
  bcg_lenfadenopati: 'BCG Aşısı Sonrası Lenfadenopati (0/1)',
  kronik_cilt: 'Kronik Cilt (deri) Problemleri (0/1)',
  gobek_kordon_gunu: 'Göbek Kordonunun Düşme Günü',
  konjenital_kalp: 'Konjenital Kalp Hastalığı (0/1)',
  kronik_ishal: 'Kronik İshal (0/1)',
  yogun_bakim: 'Yoğun Bakımda Yatış (0/1)',
  akrabalik: 'Anne-Baba Arasında Akrabalık Varlığı (0/1)',
  aile_erken_olum: 'Ailede Erken Ölüm Öyküsü (0/1)',
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
        // Yaş: ay cinsinden (model Excel ile ay olarak eğitildi)
        let age = (data.ageYears ?? 0) * 12 + (data.ageMonths ?? 0);
        if (isNaN(age) || age === 0) {
          const birthDate = data.birth_date || data.birthDate;
          if (birthDate) {
            const birth = new Date(birthDate);
            const now = new Date();
            age = Math.round((now.getTime() - birth.getTime()) / (365.25 / 12 * 24 * 60 * 60 * 1000));
          }
        }
        // Cinsiyet: Model Excel ile eğitildi - 0=Erkek, 1=Kadın (YZ SONUCU ile uyumlu)
        const genderVal = String(data.gender ?? '').toLowerCase().trim();
        const isErkek = ['0', 'male', 'erkek', 'm', 'e'].includes(genderVal);
        const isKadin = ['1', 'female', 'kadın', 'kız', 'kadin', 'f', 'k'].includes(genderVal);
        const gender = isErkek ? 0 : isKadin ? 1 : 0; // Bilinmiyorsa varsayılan Erkek
        const cordDay = Number(data.cordFallDay) || 7;
        const consanguinity = (data.parentalConsanguinity === '1' || data.parentalConsanguinity === 1 || data.parentalConsanguinity === true) ? 1 : 0;
        
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
            <Chip label={`Cinsiyet: ${patient.gender === 'male' || patient.gender === 'Erkek' ? 'Erkek (0)' : 'Kadın (1)'}`} />
          </Stack>
        </Paper>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            ML Özellikleri (API sırasına göre – main.py ile birebir eşleşir)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tüm alanlar API&apos;nin beklediği formatta gönderilir.
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Stack spacing={2}>
            {API_FIELD_ORDER.map((key) => {
              const BINARY_FIELDS = [
                'iki_aydan_fazla_ab', 'kilo_alamama', 'tekrarlayan_apse', 'pamukcuk_mantar',
                'iv_antibiyotik', 'aile_oykusu_boy', 'hastane_yatis', 'bcg_lenfadenopati',
                'kronik_cilt', 'konjenital_kalp', 'kronik_ishal', 'yogun_bakim',
                'akrabalik', 'aile_erken_olum',
              ];
              const COUNT_FIELDS = ['otit_sayisi_ge_4', 'sinuzit_sayisi_ge_2', 'pnomoni_ge_2', 'derin_enf_ge_2'];

              if (key === 'cinsiyet') {
                return (
                  <FormControl key={key} fullWidth size="small">
                    <InputLabel>Cinsiyet</InputLabel>
                    <Select
                      value={features.cinsiyet}
                      label="Cinsiyet"
                      onChange={(e) => handleFeatureChange('cinsiyet', Number(e.target.value))}
                    >
                      <MenuItem value={0}>Erkek</MenuItem>
                      <MenuItem value={1}>Kadın</MenuItem>
                    </Select>
                  </FormControl>
                );
              }

              if (BINARY_FIELDS.includes(key)) {
                return (
                  <FormControl key={key} fullWidth size="small">
                    <InputLabel>{featureLabels[key]}</InputLabel>
                    <Select
                      value={features[key]}
                      label={featureLabels[key]}
                      onChange={(e) => handleFeatureChange(key, Number(e.target.value))}
                    >
                      <MenuItem value={0}>Hayır</MenuItem>
                      <MenuItem value={1}>Evet</MenuItem>
                    </Select>
                  </FormControl>
                );
              }

              return (
                <TextField
                  key={key}
                  label={featureLabels[key]}
                  type="number"
                  value={features[key]}
                  onChange={(e) => handleFeatureChange(key, parseFloat(e.target.value) || 0)}
                  inputProps={{ 
                    min: 0, 
                    max: COUNT_FIELDS.includes(key) ? 10 : undefined,
                    step: 1,
                  }}
                  fullWidth
                  size="small"
                />
              );
            })}
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

