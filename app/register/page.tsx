'use client';

import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Box, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';
import { PersonAdd, Save } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface PatientFormData {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  ethnicity: string;
  height: number | '';
  weight: number | '';
  parentalConsanguinity: boolean;
  birthWeight: number | '';
  gestationalAge: number | '';
  cordFallDay: number | '';
}

export default function RegisterPatientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    age: 0,
    gender: '',
    ethnicity: '',
    height: '',
    weight: '',
    parentalConsanguinity: false,
    birthWeight: '',
    gestationalAge: '',
    cordFallDay: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleChange = (field: keyof PatientFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Yaştan doğum tarihini hesapla
      const currentDate = new Date();
      const birthDate = new Date(currentDate.getFullYear() - formData.age, currentDate.getMonth(), currentDate.getDate());

      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: birthDate.toISOString().split('T')[0], // YYYY-MM-DD format
          gender: formData.gender,
          parentalConsanguinity: formData.parentalConsanguinity,
          height: formData.height ? Number(formData.height) : null,
          weight: formData.weight ? Number(formData.weight) : null,
          ethnicity: formData.ethnicity,
          birthWeight: formData.birthWeight ? Number(formData.birthWeight) : null,
          gestationalAge: formData.gestationalAge ? Number(formData.gestationalAge) : null,
          cordFallDay: formData.cordFallDay ? Number(formData.cordFallDay) : null,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Değerlendirme sayfasına yönlendir
        router.push(`/patients/${result.id}/evaluation`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Hasta kaydı sırasında hata oluştu');
      }
    } catch (error) {
      setError('Bağlantı hatası oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card sx={{ boxShadow: 3 }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonAdd sx={{ mr: 1 }} />
            Yeni Hasta Kaydı
          </Typography>
        </Box>
        
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            {/* Ad Soyad */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="Ad"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
              <TextField
                fullWidth
                label="Soyad"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </Box>

            {/* Yaş, Cinsiyet, Etnik Köken */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="Yaş (Yıl)"
                type="number"
                value={formData.age}
                onChange={(e) => {
                  const value = Math.max(0, Math.min(18, Number(e.target.value)));
                  handleChange('age', value);
                }}
                inputProps={{ min: 0, max: 18 }}
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Cinsiyet</InputLabel>
                <Select
                  value={formData.gender}
                  label="Cinsiyet"
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <MenuItem value="male">Erkek</MenuItem>
                  <MenuItem value="female">Kız</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Etnik Köken"
                value={formData.ethnicity}
                onChange={(e) => handleChange('ethnicity', e.target.value)}
              />
            </Box>

            {/* Boy, Kilo, Ebeveyn Akrabalığı */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'end' } }}>
              <TextField
                fullWidth
                label="Boy (cm)"
                type="number"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.1 }}
              />
              <TextField
                fullWidth
                label="Kilo (kg)"
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.parentalConsanguinity}
                    onChange={(e) => handleChange('parentalConsanguinity', e.target.checked)}
                  />
                }
                label="Ebeveyn Akrabalığı"
                sx={{ minWidth: 200 }}
              />
            </Box>

            {/* Doğum Bilgileri */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="Doğum Ağırlığı (g)"
                type="number"
                value={formData.birthWeight}
                onChange={(e) => handleChange('birthWeight', e.target.value ? Number(e.target.value) : '')}
              />
              <TextField
                fullWidth
                label="Gebelik Haftası"
                type="number"
                value={formData.gestationalAge}
                onChange={(e) => handleChange('gestationalAge', e.target.value ? Number(e.target.value) : '')}
              />
              <TextField
                fullWidth
                label="Göbek Kordonu Düşme Günü"
                type="number"
                value={formData.cordFallDay}
                onChange={(e) => handleChange('cordFallDay', e.target.value ? Number(e.target.value) : '')}
              />
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 