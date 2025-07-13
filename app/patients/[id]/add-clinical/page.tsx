'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Divider,
  Alert,
  Stack
} from '@mui/material';
import { Save, Cancel, Brightness3 } from '@mui/icons-material';

interface ClinicalFeatureForm {
  // Büyüme ve gelişme
  growthFailure: boolean;
  heightPercentile: string;
  weightPercentile: string;

  // Cilt sorunları
  chronicSkinIssue: boolean;
  skinIssueType: string;
  skinIssueDuration: string;

  // Diğer klinik özellikler
  chronicDiarrhea: boolean;
  diarrheaDuration: string;
  bcgLymphadenopathy: boolean;
  persistentThrush: boolean;
  deepAbscesses: boolean;
  abscessLocation: string;

  // Konjenital kalp hastalığı
  chd: boolean;
  chdType: string;
}

export default function AddClinicalFeaturePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [patientName, setPatientName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ClinicalFeatureForm>({
    growthFailure: false,
    heightPercentile: '',
    weightPercentile: '',
    chronicSkinIssue: false,
    skinIssueType: '',
    skinIssueDuration: '',
    chronicDiarrhea: false,
    diarrheaDuration: '',
    bcgLymphadenopathy: false,
    persistentThrush: false,
    deepAbscesses: false,
    abscessLocation: '',
    chd: false,
    chdType: ''
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patients/${params.id}`);
        if (response.ok) {
          const patient = await response.json();
          setPatientName(`${patient.firstName || ''} ${patient.lastName || ''}`);
        }
      } catch (error) {
        console.error('Hasta bilgileri alınamadı:', error);
      }
    };

    fetchPatient();
  }, [params.id]);

  const handleChange = (field: keyof ClinicalFeatureForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/patients/${params.id}/clinical-features`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          growthFailure: formData.growthFailure,
          heightPercentile: formData.heightPercentile ? parseFloat(formData.heightPercentile) : null,
          weightPercentile: formData.weightPercentile ? parseFloat(formData.weightPercentile) : null,
          chronicSkinIssue: formData.chronicSkinIssue,
          skinIssueType: formData.chronicSkinIssue ? formData.skinIssueType : null,
          skinIssueDuration: formData.chronicSkinIssue ? parseInt(formData.skinIssueDuration) : null,
          chronicDiarrhea: formData.chronicDiarrhea,
          diarrheaDuration: formData.chronicDiarrhea ? parseInt(formData.diarrheaDuration) : null,
          bcgLymphadenopathy: formData.bcgLymphadenopathy,
          persistentThrush: formData.persistentThrush,
          deepAbscesses: formData.deepAbscesses,
          abscessLocation: formData.deepAbscesses ? formData.abscessLocation : null,
          chd: formData.chd,
          chdType: formData.chd ? formData.chdType : null
        }),
      });

      if (response.ok) {
        router.push(`/patients/${params.id}`);
      } else {
        const error = await response.json();
        setError(error.error || 'Klinik özellikler kaydedilemedi');
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
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Brightness3 />
            Klinik Özellikler Ekle - {patientName || `Hasta #${params.id}`}
          </Typography>
        </Box>

        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Büyüme ve Gelişme */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Büyüme ve Gelişme
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.growthFailure}
                        onChange={(e) => handleChange('growthFailure', e.target.checked)}
                      />
                    }
                    label="Büyüme Geriliği"
                  />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Boy Persentili"
                      type="number"
                      value={formData.heightPercentile}
                      onChange={(e) => handleChange('heightPercentile', e.target.value)}
                      disabled={!formData.growthFailure}
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                    />
                    <TextField
                      fullWidth
                      label="Kilo Persentili"
                      type="number"
                      value={formData.weightPercentile}
                      onChange={(e) => handleChange('weightPercentile', e.target.value)}
                      disabled={!formData.growthFailure}
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                    />
                  </Stack>
                </Stack>
              </Box>

              <Divider />

              {/* Cilt Sorunları */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Cilt Sorunları
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.chronicSkinIssue}
                        onChange={(e) => handleChange('chronicSkinIssue', e.target.checked)}
                      />
                    }
                    label="Kronik Cilt Problemi"
                  />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Cilt Problemi Türü"
                      value={formData.skinIssueType}
                      onChange={(e) => handleChange('skinIssueType', e.target.value)}
                      disabled={!formData.chronicSkinIssue}
                    />
                    <TextField
                      fullWidth
                      label="Süre (Ay)"
                      type="number"
                      value={formData.skinIssueDuration}
                      onChange={(e) => handleChange('skinIssueDuration', e.target.value)}
                      disabled={!formData.chronicSkinIssue}
                      inputProps={{ min: 0 }}
                    />
                  </Stack>
                </Stack>
              </Box>

              <Divider />

              {/* Diğer Klinik Özellikler */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Diğer Klinik Özellikler
                </Typography>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Box flex={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.chronicDiarrhea}
                            onChange={(e) => handleChange('chronicDiarrhea', e.target.checked)}
                          />
                        }
                        label="Kronik İshal"
                      />
                      {formData.chronicDiarrhea && (
                        <TextField
                          fullWidth
                          label="Süre (Ay)"
                          type="number"
                          value={formData.diarrheaDuration}
                          onChange={(e) => handleChange('diarrheaDuration', e.target.value)}
                          sx={{ mt: 1 }}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    </Box>
                    <Box flex={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.bcgLymphadenopathy}
                            onChange={(e) => handleChange('bcgLymphadenopathy', e.target.checked)}
                          />
                        }
                        label="BCG Lenfadenopati"
                      />
                    </Box>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Box flex={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.persistentThrush}
                            onChange={(e) => handleChange('persistentThrush', e.target.checked)}
                          />
                        }
                        label="Persistan Pamukçuk"
                      />
                    </Box>
                    <Box flex={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.deepAbscesses}
                            onChange={(e) => handleChange('deepAbscesses', e.target.checked)}
                          />
                        }
                        label="Derin Apse"
                      />
                      {formData.deepAbscesses && (
                        <TextField
                          fullWidth
                          label="Apse Lokasyonu"
                          value={formData.abscessLocation}
                          onChange={(e) => handleChange('abscessLocation', e.target.value)}
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </Stack>
                </Stack>
              </Box>

              <Divider />

              {/* Konjenital Kalp Hastalığı */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Konjenital Kalp Hastalığı
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.chd}
                        onChange={(e) => handleChange('chd', e.target.checked)}
                      />
                    }
                    label="Konjenital Kalp Hastalığı"
                  />
                  {formData.chd && (
                    <TextField
                      fullWidth
                      label="Hastalık Türü"
                      value={formData.chdType}
                      onChange={(e) => handleChange('chdType', e.target.value)}
                    />
                  )}
                </Stack>
              </Box>

              {/* Butonlar */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => router.push(`/patients/${params.id}`)}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 