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
import { useNotification } from '@/components/NotificationProvider';

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
  const { showNotification } = useNotification();
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
    if (field === 'age') {
      // Yaş için özel doğrulama (0-18 arası)
      value = Math.max(0, Math.min(18, Number(value)));
    }
    
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
      // Form doğrulama
      if (!formData.firstName || !formData.lastName) {
        throw new Error('Ad ve soyad alanları zorunludur.');
      }
      if (!formData.gender) {
        throw new Error('Cinsiyet seçimi zorunludur.');
      }
      if (formData.age < 0 || formData.age > 18) {
        throw new Error('Yaş 0-18 arasında olmalıdır.');
      }

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
          ethnicity: formData.ethnicity || null,
          birthWeight: formData.birthWeight ? Number(formData.birthWeight) : null,
          gestationalAge: formData.gestationalAge ? Number(formData.gestationalAge) : null,
          cordFallDay: formData.cordFallDay ? Number(formData.cordFallDay) : null,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Bildirim göster
        showNotification(
          `✅ ${formData.firstName} ${formData.lastName} başarıyla kaydedildi!`, 
          'success'
        );
        
        // Custom event dispatch
        window.dispatchEvent(new CustomEvent('patient-added'));
        
        router.push(`/patients/${result.id}/evaluation`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Hasta kaydı sırasında hata oluştu');
      }
    } catch (error: any) {
      setError(error.message || 'Bağlantı hatası oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card sx={{ boxShadow: 3 }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAdd />
            Yeni Hasta Kaydı
          </Typography>
        </Box>
        
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Ad Soyad */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Ad"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Soyad"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Yaş, Cinsiyet, Etnik Köken */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Yaş (Yıl)"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  inputProps={{ min: 0, max: 18 }}
                  helperText="0-18 yaş arası"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Cinsiyet</InputLabel>
                  <Select
                    value={formData.gender}
                    label="Cinsiyet"
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <MenuItem value="">Seçiniz</MenuItem>
                    <MenuItem value="male">Erkek</MenuItem>
                    <MenuItem value="female">Kız</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Etnik Köken"
                  value={formData.ethnicity}
                  onChange={(e) => handleChange('ethnicity', e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Boy, Kilo, Ebeveyn Akrabalığı */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Boy (cm)"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value ? Number(e.target.value) : '')}
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Kilo (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value ? Number(e.target.value) : '')}
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.parentalConsanguinity}
                      onChange={(e) => handleChange('parentalConsanguinity', e.target.checked)}
                    />
                  }
                  label="Ebeveyn Akrabalığı"
                />
              </Grid>
            </Grid>

            {/* Doğum Bilgileri */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Doğum Ağırlığı (g)"
                  type="number"
                  value={formData.birthWeight}
                  onChange={(e) => handleChange('birthWeight', e.target.value ? Number(e.target.value) : '')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Gebelik Haftası"
                  type="number"
                  value={formData.gestationalAge}
                  onChange={(e) => handleChange('gestationalAge', e.target.value ? Number(e.target.value) : '')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Göbek Kordonu Düşme Günü"
                  type="number"
                  value={formData.cordFallDay}
                  onChange={(e) => handleChange('cordFallDay', e.target.value ? Number(e.target.value) : '')}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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