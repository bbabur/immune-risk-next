'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { ArrowBack, Save } from '@mui/icons-material';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  fileNumber: string;
  gender: string;
  height?: number;
  weight?: number;
  ethnicity?: string;
  parentalConsanguinity?: string;
  birthWeight?: number;
  gestationalAge?: number;
  cordFallDay?: number;
  birthType?: string;
  breastfeedingMonths?: number;
}

interface UpdateData {
  height: number | '';
  weight: number | '';
  ethnicity: string;
  parentalConsanguinity: string;
  birthWeight: number | '';
  gestationalAge: number | '';
  cordFallDay: number | '';
  birthType: string;
  breastfeedingMonths: number | '';
}

export default function UpdatePatientInfoPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [formData, setFormData] = useState<UpdateData>({
    height: '',
    weight: '',
    ethnicity: '',
    parentalConsanguinity: '0',
    birthWeight: '',
    gestationalAge: '',
    cordFallDay: '',
    birthType: '',
    breastfeedingMonths: '',
  });

  useEffect(() => {
    // Login kontrolü
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.replace('/login?redirect=/patients/' + params.id + '/update-info');
      return;
    }
    
    setIsAuthenticated(true);
    fetchPatient();
  }, [params.id, router]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/patients/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.replace('/login?redirect=/patients/' + params.id + '/update-info&expired=true');
        return;
      }

      if (!response.ok) {
        throw new Error('Hasta bilgileri alınamadı');
      }

      const data = await response.json();
      setPatient(data);

      // Form verilerini doldur
      setFormData({
        height: data.height || '',
        weight: data.weight || '',
        ethnicity: data.ethnicity || '',
        parentalConsanguinity: data.parentalConsanguinity || data.parental_consanguinity || '0',
        birthWeight: data.birthWeight || data.birth_weight || '',
        gestationalAge: data.gestationalAge || data.gestational_age || '',
        cordFallDay: data.cordFallDay || data.cord_fall_day || '',
        birthType: data.birthType || data.birth_type || '',
        breastfeedingMonths: data.breastfeedingMonths || data.breastfeeding_months || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hasta bilgileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const type = e.target.type;

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
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/patients/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.replace('/login?redirect=/patients/' + params.id + '/update-info&expired=true');
        return;
      }

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Güncelleme başarısız');
      }

      setSuccess('Hasta bilgileri başarıyla güncellendi! Yönlendiriliyorsunuz...');
      
      setTimeout(() => {
        router.push(`/patients/${params.id}`);
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Güncelleme başarısız');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Hasta bulunamadı</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => router.back()}>
          Geri
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Hasta Bilgilerini Güncelle
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {patient.firstName} {patient.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dosya No: {patient.fileNumber} | Cinsiyet: {patient.gender}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Fiziksel Ölçümler */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                Fiziksel Ölçümler
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <TextField
                  label="Boy (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ step: 0.1, min: 0 }}
                />
                <TextField
                  label="Kilo (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ step: 0.1, min: 0 }}
                />
              </Box>
            </Box>

            {/* Demografik Bilgiler */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                Demografik Bilgiler
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <TextField
                  label="Etnik Köken"
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleChange}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Ebeveyn Akrabalığı</InputLabel>
                  <Select
                    name="parentalConsanguinity"
                    value={formData.parentalConsanguinity}
                    label="Ebeveyn Akrabalığı"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="0">Yok</MenuItem>
                    <MenuItem value="1">1. Derece</MenuItem>
                    <MenuItem value="2">2. Derece</MenuItem>
                    <MenuItem value="3">3. Derece</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Doğum Bilgileri */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                Doğum Bilgileri
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <TextField
                  label="Doğum Kilosu (gram)"
                  name="birthWeight"
                  type="number"
                  value={formData.birthWeight}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="Gestasyon Yaşı (hafta)"
                  name="gestationalAge"
                  type="number"
                  value={formData.gestationalAge}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 0, max: 50 }}
                />
                <TextField
                  label="Doğum Şekli"
                  name="birthType"
                  value={formData.birthType}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Normal, Sezaryen"
                />
                <TextField
                  label="Anne Sütü Süresi (ay)"
                  name="breastfeedingMonths"
                  type="number"
                  value={formData.breastfeedingMonths}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="Göbek Düşme Günü"
                  name="cordFallDay"
                  type="number"
                  value={formData.cordFallDay}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Box>
            </Box>

            {/* Butonlar */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                disabled={saving}
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                disabled={saving}
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

