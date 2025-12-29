'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Box,
  Alert,
  Divider,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Psychology, Save, ArrowBack, ArrowForward } from '@mui/icons-material';

interface PatientData {
  // Demografik Bilgiler
  fileNumber: string;
  ageYears: number | '';
  ageMonths: number | '';
  gender: string;
  height: number | '';
  weight: number | '';
  ethnicity: string;
  parentalConsanguinity: string;
  // Doğum Bilgileri
  birthWeight: number | '';
  gestationalAge: number | '';
  cordFallDay: number | '';
  // ML Özellikleri
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
  hastane_yatis: number;
  bcg_lenfadenopati: number;
  kronik_cilt: number;
  konjenital_kalp: number;
  kronik_ishal: number;
  yogun_bakim: number;
  aile_erken_olum: number;
}

const steps = ['Demografik Bilgiler', 'Klinik Değerlendirme', 'Kaydet & Değerlendir'];

export default function PatientRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.replace('/login?redirect=/patients/register');
      return;
    }
    
    setIsAuthenticated(true);
  }, [router]);

  const [formData, setFormData] = useState<PatientData>({
    fileNumber: '',
    ageYears: '',
    ageMonths: '',
    gender: '',
    height: '',
    weight: '',
    ethnicity: '',
    parentalConsanguinity: '0',
    birthWeight: '',
    gestationalAge: '',
    cordFallDay: '',
    // ML Özellikleri - varsayılan 0
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
    hastane_yatis: 0,
    bcg_lenfadenopati: 0,
    kronik_cilt: 0,
    konjenital_kalp: 0,
    kronik_ishal: 0,
    yogun_bakim: 0,
    aile_erken_olum: 0,
  });

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMLFeatureChange = (name: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (runML: boolean = false) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      
      // Hasta oluştur
      const response = await fetch('/api/patients/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fileNumber: formData.fileNumber,
          ageYears: formData.ageYears,
          ageMonths: formData.ageMonths,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
          ethnicity: formData.ethnicity,
          parentalConsanguinity: formData.parentalConsanguinity,
          birthWeight: formData.birthWeight,
          gestationalAge: formData.gestationalAge,
          cordFallDay: formData.cordFallDay,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.replace('/login?redirect=/patients/register&expired=true');
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Hasta kaydedilemedi');
      }

      const patientId = result.id;

      // ML değerlendirmesi yap
      if (runML) {
        const yas = (formData.ageYears || 0) + ((formData.ageMonths || 0) / 12);
        const cinsiyet = formData.gender === 'male' ? 1 : 0;
        const akrabalik = formData.parentalConsanguinity === '1' ? 1 : 0;
        const gobek_kordon_gunu = formData.cordFallDay || 7;

        const mlFeatures = {
          otit_sayisi_ge_4: formData.otit_sayisi_ge_4,
          sinuzit_sayisi_ge_2: formData.sinuzit_sayisi_ge_2,
          iki_aydan_fazla_ab: formData.iki_aydan_fazla_ab,
          pnomoni_ge_2: formData.pnomoni_ge_2,
          kilo_alamama: formData.kilo_alamama,
          tekrarlayan_apse: formData.tekrarlayan_apse,
          pamukcuk_mantar: formData.pamukcuk_mantar,
          iv_antibiyotik: formData.iv_antibiyotik,
          derin_enf_ge_2: formData.derin_enf_ge_2,
          aile_oykusu_boy: formData.aile_oykusu_boy,
          cinsiyet,
          yas,
          hastane_yatis: formData.hastane_yatis,
          bcg_lenfadenopati: formData.bcg_lenfadenopati,
          kronik_cilt: formData.kronik_cilt,
          gobek_kordon_gunu,
          konjenital_kalp: formData.konjenital_kalp,
          kronik_ishal: formData.kronik_ishal,
          yogun_bakim: formData.yogun_bakim,
          akrabalik,
          aile_erken_olum: formData.aile_erken_olum,
        };

        const mlResponse = await fetch(`/api/patients/${patientId}/ml-assessment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ features: mlFeatures }),
        });

        if (mlResponse.ok) {
          const mlResult = await mlResponse.json();
          sessionStorage.setItem('mlResult', JSON.stringify({
            ...mlResult,
            features: mlFeatures,
            patientId,
            patientFileNumber: formData.fileNumber,
            assessmentDate: new Date().toISOString()
          }));
          
          setSuccess('Hasta kaydedildi ve ML değerlendirmesi tamamlandı!');
          setTimeout(() => {
            router.push(`/patients/${patientId}/ml-result`);
          }, 1500);
          return;
        }
      }

      setSuccess('Hasta başarıyla kaydedildi!');
      setTimeout(() => {
        router.push(`/patients/${patientId}`);
      }, 1500);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Hasta kaydedilirken hata oluştu');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">Demografik Bilgiler</Typography>
            <Divider />
            
            <TextField
              fullWidth
              label="Dosya Numarası"
              name="fileNumber"
              value={formData.fileNumber}
              onChange={handleChange}
              required
            />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Yaş (Yıl)"
                name="ageYears"
                type="number"
                value={formData.ageYears}
                onChange={handleChange}
                inputProps={{ min: 0, max: 18 }}
                required
              />
              <TextField
                fullWidth
                label="Yaş (Ay)"
                name="ageMonths"
                type="number"
                value={formData.ageMonths}
                onChange={handleChange}
                inputProps={{ min: 0, max: 11 }}
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Cinsiyet</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleSelectChange}
                  label="Cinsiyet"
                >
                  <MenuItem value="male">Erkek</MenuItem>
                  <MenuItem value="female">Kız</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <FormControl fullWidth required>
              <InputLabel>Ebeveyn Akrabalığı</InputLabel>
              <Select
                name="parentalConsanguinity"
                value={formData.parentalConsanguinity}
                onChange={handleSelectChange}
                label="Ebeveyn Akrabalığı"
              >
                <MenuItem value="0">Akrabalık Yok</MenuItem>
                <MenuItem value="1">Akrabalık Var</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Doğum Bilgileri</Typography>
            <Divider />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Doğum Ağırlığı (g)"
                name="birthWeight"
                type="number"
                value={formData.birthWeight}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Gebelik Haftası"
                name="gestationalAge"
                type="number"
                value={formData.gestationalAge}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Göbek Kordonu Düşme Günü"
                name="cordFallDay"
                type="number"
                value={formData.cordFallDay}
                onChange={handleChange}
              />
            </Stack>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">Enfeksiyon Kriterleri</Typography>
            <Divider />
            
            {[
              { key: 'otit_sayisi_ge_4', label: '1 Yıl İçinde Otit Sayısı ≥4' },
              { key: 'sinuzit_sayisi_ge_2', label: '1 Yıl İçinde Sinüzit Sayısı ≥2' },
              { key: 'pnomoni_ge_2', label: '1 Yıl İçinde ≥2 Pnömoni' },
              { key: 'derin_enf_ge_2', label: 'Septisemi Dahil ≥2 Derin Enfeksiyon' },
            ].map(({ key, label }) => (
              <FormControl key={key} component="fieldset">
                <Typography variant="body1">{label}</Typography>
                <RadioGroup
                  row
                  value={(formData as any)[key]}
                  onChange={(e) => handleMLFeatureChange(key, parseInt(e.target.value))}
                >
                  <FormControlLabel value={0} control={<Radio />} label="Hayır" />
                  <FormControlLabel value={1} control={<Radio />} label="Evet" />
                </RadioGroup>
              </FormControl>
            ))}

            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Tedavi ve Hastane</Typography>
            <Divider />
            
            {[
              { key: 'iki_aydan_fazla_ab', label: '2 Aydan Fazla Oral Antibiyotik Kullanımı' },
              { key: 'iv_antibiyotik', label: 'İntravenöz Antibiyotik Gerektiren Enfeksiyonlar' },
              { key: 'hastane_yatis', label: 'Hastaneye Yatış Varlığı' },
              { key: 'yogun_bakim', label: 'Yoğun Bakımda Yatış' },
            ].map(({ key, label }) => (
              <FormControl key={key} component="fieldset">
                <Typography variant="body1">{label}</Typography>
                <RadioGroup
                  row
                  value={(formData as any)[key]}
                  onChange={(e) => handleMLFeatureChange(key, parseInt(e.target.value))}
                >
                  <FormControlLabel value={0} control={<Radio />} label="Hayır" />
                  <FormControlLabel value={1} control={<Radio />} label="Evet" />
                </RadioGroup>
              </FormControl>
            ))}

            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Klinik Özellikler</Typography>
            <Divider />
            
            {[
              { key: 'kilo_alamama', label: 'Bebeğin Kilo Alamaması veya Normal Büyümemesi' },
              { key: 'tekrarlayan_apse', label: 'Tekrarlayan, Derin Cilt veya Organ Apseleri' },
              { key: 'pamukcuk_mantar', label: 'Ağızda veya Deride Kalıcı Pamukçuk/Mantar' },
              { key: 'bcg_lenfadenopati', label: 'BCG Aşısı Sonrası Lenfadenopati' },
              { key: 'kronik_cilt', label: 'Kronik Cilt (Deri) Problemleri' },
              { key: 'konjenital_kalp', label: 'Konjenital Kalp Hastalığı' },
              { key: 'kronik_ishal', label: 'Kronik İshal' },
            ].map(({ key, label }) => (
              <FormControl key={key} component="fieldset">
                <Typography variant="body1">{label}</Typography>
                <RadioGroup
                  row
                  value={(formData as any)[key]}
                  onChange={(e) => handleMLFeatureChange(key, parseInt(e.target.value))}
                >
                  <FormControlLabel value={0} control={<Radio />} label="Hayır" />
                  <FormControlLabel value={1} control={<Radio />} label="Evet" />
                </RadioGroup>
              </FormControl>
            ))}

            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Aile Öyküsü</Typography>
            <Divider />
            
            {[
              { key: 'aile_oykusu_boy', label: 'Ailede Doğuştan İmmün Yetmezlik Öyküsü' },
              { key: 'aile_erken_olum', label: 'Ailede Erken Ölüm Öyküsü' },
            ].map(({ key, label }) => (
              <FormControl key={key} component="fieldset">
                <Typography variant="body1">{label}</Typography>
                <RadioGroup
                  row
                  value={(formData as any)[key]}
                  onChange={(e) => handleMLFeatureChange(key, parseInt(e.target.value))}
                >
                  <FormControlLabel value={0} control={<Radio />} label="Hayır" />
                  <FormControlLabel value={1} control={<Radio />} label="Evet" />
                </RadioGroup>
              </FormControl>
            ))}
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3} alignItems="center">
            <Psychology sx={{ fontSize: 80, color: 'primary.main' }} />
            <Typography variant="h5" textAlign="center">
              Hasta Kaydı ve ML Değerlendirmesi
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary">
              Hasta bilgileri kaydedilecek ve ML modeli ile risk değerlendirmesi yapılacaktır.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => handleSubmit(false)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sadece Kaydet'}
              </Button>
              <Button
                variant="contained"
                size="large"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Psychology />}
                onClick={() => handleSubmit(true)}
                disabled={loading}
              >
                {loading ? 'İşleniyor...' : 'Kaydet & ML Değerlendir'}
              </Button>
            </Box>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Yeni Hasta Kaydı
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
            >
              Geri
            </Button>
            
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
              >
                İleri
              </Button>
            ) : null}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
