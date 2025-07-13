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
  Alert,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Chip,
  Avatar,
  LinearProgress,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  PersonAdd, 
  Save, 
  Person, 
  MonitorWeight, 
  BabyChangingStation, 
  ArrowBack,
  ExpandMore,
  ExpandLess,
  Check,
  Male,
  Female,
  Height,
  Scale,
  FamilyRestroom,
  LocationOn,
  CalendarMonth,
  LocalHospital
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/NotificationProvider';
import Link from 'next/link';

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
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    physical: true,
    medical: true
  });

  const handleChange = (field: keyof PatientFormData, value: any) => {
    if (field === 'age') {
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
          birthDate: birthDate.toISOString().split('T')[0],
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
        
        showNotification(
          `✅ ${formData.firstName} ${formData.lastName} başarıyla kaydedildi!`, 
          'success'
        );
        
        // Import the notification function
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('patient-added', {
            detail: { patientName: `${formData.firstName} ${formData.lastName}` }
          }));
        }
        
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getCompletionPercentage = () => {
    const requiredFields = ['firstName', 'lastName', 'age', 'gender'];
    const optionalFields = ['ethnicity', 'height', 'weight', 'birthWeight', 'gestationalAge', 'cordFallDay'];
    
    const completedRequired = requiredFields.filter(field => formData[field as keyof PatientFormData]).length;
    const completedOptional = optionalFields.filter(field => formData[field as keyof PatientFormData]).length;
    
    return Math.round(((completedRequired / requiredFields.length) * 70) + ((completedOptional / optionalFields.length) * 30));
  };

  const isFormValid = () => {
    return formData.firstName && formData.lastName && formData.gender && formData.age >= 0 && formData.age <= 18;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/patients"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Hasta Listesine Dön
        </Button>
        
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)', 
          color: 'white',
          borderRadius: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
              color: '#1976d2'
            }}>
              <PersonAdd sx={{ fontSize: 50 }} />
            </Avatar>
          </Box>
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Yeni Hasta Kaydı
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Hasta bilgilerini eksiksiz olarak doldurun
          </Typography>
        </Paper>
      </Box>

      {/* Progress Bar */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Form Tamamlama Durumu
            </Typography>
            <Chip 
              label={`${getCompletionPercentage()}% Tamamlandı`}
              color={getCompletionPercentage() === 100 ? 'success' : 'primary'}
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={getCompletionPercentage()} 
            sx={{ 
              height: 8, 
              borderRadius: 1,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #42a5f5 0%, #1976d2 100%)',
              }
            }} 
          />
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Kişisel Bilgiler */}
        <Card sx={{ mb: 3, boxShadow: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 2, 
              backgroundColor: '#f5f5f5',
              cursor: 'pointer'
            }}
            onClick={() => toggleSection('personal')}
          >
            <Person sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Kişisel Bilgiler
            </Typography>
            <IconButton>
              {expandedSections.personal ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandedSections.personal}>
            <CardContent>
                             <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                <TextField
                  fullWidth
                  required
                  label="Ad"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="Soyad"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  required
                  label="Yaş (Yıl)"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  inputProps={{ min: 0, max: 18 }}
                  helperText="0-18 yaş arası"
                  InputProps={{
                    startAdornment: <CalendarMonth sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
                <FormControl fullWidth required>
                  <InputLabel>Cinsiyet</InputLabel>
                  <Select
                    value={formData.gender}
                    label="Cinsiyet"
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Seçiniz</em>
                    </MenuItem>
                    <MenuItem value="male">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Male sx={{ mr: 1, color: 'blue' }} />
                        Erkek
                      </Box>
                    </MenuItem>
                    <MenuItem value="female">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Female sx={{ mr: 1, color: 'pink' }} />
                        Kız
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Etnik Köken"
                  value={formData.ethnicity}
                  onChange={(e) => handleChange('ethnicity', e.target.value)}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Box>
            </CardContent>
          </Collapse>
        </Card>

        {/* Fiziksel Bilgiler */}
        <Card sx={{ mb: 3, boxShadow: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 2, 
              backgroundColor: '#f5f5f5',
              cursor: 'pointer'
            }}
            onClick={() => toggleSection('physical')}
          >
            <MonitorWeight sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Fiziksel Bilgiler
            </Typography>
            <IconButton>
              {expandedSections.physical ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandedSections.physical}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Boy (cm)"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleChange('height', e.target.value ? Number(e.target.value) : '')}
                    inputProps={{ step: 0.1 }}
                    InputProps={{
                      startAdornment: <Height sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
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
                    InputProps={{
                      startAdornment: <Scale sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
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
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FamilyRestroom sx={{ mr: 1, color: 'text.secondary' }} />
                        Ebeveyn Akrabalığı
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Collapse>
        </Card>

        {/* Doğum Bilgileri */}
        <Card sx={{ mb: 3, boxShadow: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 2, 
              backgroundColor: '#f5f5f5',
              cursor: 'pointer'
            }}
            onClick={() => toggleSection('medical')}
          >
            <BabyChangingStation sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Doğum Bilgileri
            </Typography>
            <IconButton>
              {expandedSections.medical ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandedSections.medical}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Doğum Ağırlığı (g)"
                    type="number"
                    value={formData.birthWeight}
                    onChange={(e) => handleChange('birthWeight', e.target.value ? Number(e.target.value) : '')}
                    InputProps={{
                      startAdornment: <Scale sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Gebelik Haftası"
                    type="number"
                    value={formData.gestationalAge}
                    onChange={(e) => handleChange('gestationalAge', e.target.value ? Number(e.target.value) : '')}
                    InputProps={{
                      startAdornment: <CalendarMonth sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Göbek Kordonu Düşme Günü"
                    type="number"
                    value={formData.cordFallDay}
                    onChange={(e) => handleChange('cordFallDay', e.target.value ? Number(e.target.value) : '')}
                    InputProps={{
                      startAdornment: <LocalHospital sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Collapse>
        </Card>

        {/* Submit Button */}
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Hazır mısınız?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hasta bilgilerini kontrol edin ve kaydedin
                </Typography>
              </Box>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={loading ? <LinearProgress size={20} /> : <Save />}
                disabled={loading || !isFormValid()}
                sx={{ 
                  px: 4, 
                  py: 2,
                  background: 'linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                {loading ? 'Kaydediliyor...' : 'Hastayı Kaydet'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
} 