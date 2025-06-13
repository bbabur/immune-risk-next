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
  firstName: string;
  lastName: string;
  age: number | '';
  gender: string;
  height: number | '';
  weight: number | '';
  ethnicity: string;
  parentalConsanguinity: boolean;
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
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    ethnicity: '',
    parentalConsanguinity: false,
    birthWeight: '',
    gestationalAge: '',
    cordFallDay: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
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
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Hasta kaydedilemedi');
      }

      const result = await response.json();
      setSuccess('Hasta başarıyla kaydedildi!');
      
      // 2 saniye sonra hasta detay sayfasına yönlendir
      setTimeout(() => {
        router.push(`/patients/${result.id}`);
      }, 2000);

    } catch (error) {
      setError('Hasta kaydedilirken hata oluştu');
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
              {/* Ad Soyad */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Ad"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Soyad"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Stack>

              {/* Yaş, Cinsiyet, Etnik Köken */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Yaş (Yıl)"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 18 }}
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

                <TextField
                  fullWidth
                  label="Etnik Köken"
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleChange}
                />
              </Stack>

              {/* Boy, Kilo, Akrabalık */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Boy (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  inputProps={{ step: 0.1 }}
                />

                <TextField
                  fullWidth
                  label="Kilo (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  inputProps={{ step: 0.1 }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 200 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="parentalConsanguinity"
                        checked={formData.parentalConsanguinity}
                        onChange={handleChange}
                      />
                    }
                    label="Ebeveyn Akrabalığı"
                  />
                </Box>
              </Stack>

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