'use client';

import { useState } from 'react';
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
  Checkbox,
  Stack,
  Box,
  Alert,
  Divider
} from '@mui/material';

interface PatientData {
  fileNumber: string;
  ageYears: number | '';
  ageMonths: number | '';
  gender: string;
  height: number | '';
  weight: number | '';
  ethnicity: string;
  parentalConsanguinity: string;
  birthWeight: number | '';
  gestationalAge: number | '';
  cordFallDay: number | '';
}

export default function PatientRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
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
    cordFallDay: ''
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/patients/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Hasta kaydedilemedi');
      }

      setSuccess('Hasta başarıyla kaydedildi! Klinik değerlendirme sayfasına yönlendiriliyorsunuz...');
      
      // 2 saniye sonra klinik değerlendirme sayfasına yönlendir
      setTimeout(() => {
        router.push(`/patients/${result.id}/clinical-assessment`);
      }, 2000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Hasta kaydedilirken hata oluştu');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Yeni Hasta Kaydı
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Demografik Bilgiler
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack spacing={3}>
              {/* Dosya Numarası */}
              <TextField
                fullWidth
                label="Dosya Numarası"
                name="fileNumber"
                value={formData.fileNumber}
                onChange={handleChange}
                required
                helperText="Hastanın benzersiz dosya numarası"
              />

              {/* Yaş (Yıl ve Ay), Cinsiyet */}
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

              {/* Etnik Köken (opsiyonel) */}
              <TextField
                fullWidth
                label="Etnik Köken (Opsiyonel)"
                name="ethnicity"
                value={formData.ethnicity}
                onChange={handleChange}
              />

              {/* Boy, Kilo (opsiyonel) */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Boy (cm) - Opsiyonel"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  inputProps={{ step: 0.1 }}
                />

                <TextField
                  fullWidth
                  label="Kilo (kg) - Opsiyonel"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  inputProps={{ step: 0.1 }}
                />
              </Stack>

              {/* Ebeveyn Akrabalığı */}
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
                  <MenuItem value="2">Akrabalık Yok, Aynı Köyden</MenuItem>
                </Select>
              </FormControl>

              {/* Doğum Bilgileri */}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Doğum Bilgileri
              </Typography>
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

              {/* Butonlar */}
              <Box display="flex" justifyContent="center" gap={2} sx={{ mt: 4 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => router.push('/patients')}
                  disabled={loading}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Kaydediliyor...' : 'Hasta Kaydet'}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </form>
    </Container>
  );
} 