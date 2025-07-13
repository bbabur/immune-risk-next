'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Card, 
  CardContent,
  Typography,
  Box,
  Stack,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Save, Cancel, People } from '@mui/icons-material';

const relationshipOptions = [
  { value: 'Kardeş', label: 'Kardeş' },
  { value: 'Anne', label: 'Anne' },
  { value: 'Baba', label: 'Baba' },
  { value: 'Amca/Dayı', label: 'Amca/Dayı' },
  { value: 'Hala/Teyze', label: 'Hala/Teyze' },
  { value: 'Kuzen', label: 'Kuzen' },
  { value: 'Büyükanne', label: 'Büyükanne' },
  { value: 'Büyükbaba', label: 'Büyükbaba' },
  { value: 'Diğer', label: 'Diğer' }
];

interface FamilyHistoryForm {
  familyIeiHistory: boolean;
  ieiRelationship: string;
  ieiType: string;
  familyEarlyDeath: boolean;
  earlyDeathAge: string;
  earlyDeathRelationship: string;
  earlyDeathCause: string;
  otherConditions: string;
}

export default function AddFamilyHistoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [patientName, setPatientName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FamilyHistoryForm>({
    familyIeiHistory: false,
    ieiRelationship: '',
    ieiType: '',
    familyEarlyDeath: false,
    earlyDeathAge: '',
    earlyDeathRelationship: '',
    earlyDeathCause: '',
    otherConditions: ''
  });

  useEffect(() => {
    // Hasta bilgilerini getir
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

  const handleChange = (field: keyof FamilyHistoryForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/patients/${params.id}/family-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familyIeiHistory: formData.familyIeiHistory,
          ieiRelationship: formData.familyIeiHistory ? formData.ieiRelationship : null,
          ieiType: formData.familyIeiHistory ? formData.ieiType : null,
          familyEarlyDeath: formData.familyEarlyDeath,
          earlyDeathAge: formData.familyEarlyDeath ? parseInt(formData.earlyDeathAge) : null,
          earlyDeathRelationship: formData.familyEarlyDeath ? formData.earlyDeathRelationship : null,
          earlyDeathCause: formData.familyEarlyDeath ? formData.earlyDeathCause : null,
          otherConditions: formData.otherConditions || null
        }),
      });

      if (response.ok) {
        router.push(`/patients/${params.id}`);
      } else {
        const error = await response.json();
        console.error('Aile öyküsü kaydedilemedi:', error);
      }
    } catch (error) {
      console.error('Bağlantı hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card sx={{ boxShadow: 3 }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People />
            Aile Öyküsü Ekle - {patientName || `Hasta #${params.id}`}
          </Typography>
        </Box>

        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* İmmün Yetmezlik Öyküsü */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box flex={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.familyIeiHistory}
                        onChange={(e) => handleChange('familyIeiHistory', e.target.checked)}
                      />
                    }
                    label="Ailede İmmün Yetmezlik Öyküsü"
                  />
                </Box>
                <Box flex={1}>
                  <FormControl fullWidth disabled={!formData.familyIeiHistory}>
                    <InputLabel>İlgili Akraba</InputLabel>
                    <Select
                      value={formData.ieiRelationship}
                      label="İlgili Akraba"
                      onChange={(e) => handleChange('ieiRelationship', e.target.value)}
                    >
                      <MenuItem value="">Seçiniz</MenuItem>
                      {relationshipOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <TextField
                    fullWidth
                    label="İmmün Yetmezlik Türü"
                    value={formData.ieiType}
                    onChange={(e) => handleChange('ieiType', e.target.value)}
                    disabled={!formData.familyIeiHistory}
                  />
                </Box>
              </Stack>

              <Divider />

              {/* Erken Ölüm */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box flex={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.familyEarlyDeath}
                        onChange={(e) => handleChange('familyEarlyDeath', e.target.checked)}
                      />
                    }
                    label="Ailede Erken Ölüm"
                  />
                </Box>
                <Box flex={0.5}>
                  <TextField
                    fullWidth
                    label="Ölüm Yaşı"
                    type="number"
                    value={formData.earlyDeathAge}
                    onChange={(e) => handleChange('earlyDeathAge', e.target.value)}
                    disabled={!formData.familyEarlyDeath}
                    inputProps={{ min: 0 }}
                  />
                </Box>
                <Box flex={1}>
                  <FormControl fullWidth disabled={!formData.familyEarlyDeath}>
                    <InputLabel>İlgili Akraba</InputLabel>
                    <Select
                      value={formData.earlyDeathRelationship}
                      label="İlgili Akraba"
                      onChange={(e) => handleChange('earlyDeathRelationship', e.target.value)}
                    >
                      <MenuItem value="">Seçiniz</MenuItem>
                      {relationshipOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <TextField
                    fullWidth
                    label="Ölüm Nedeni"
                    value={formData.earlyDeathCause}
                    onChange={(e) => handleChange('earlyDeathCause', e.target.value)}
                    disabled={!formData.familyEarlyDeath}
                  />
                </Box>
              </Stack>

              <Divider />

              {/* Diğer Hastalıklar */}
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ailede Diğer Önemli Hastalıklar"
                value={formData.otherConditions}
                onChange={(e) => handleChange('otherConditions', e.target.value)}
              />

              {/* Butonlar */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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