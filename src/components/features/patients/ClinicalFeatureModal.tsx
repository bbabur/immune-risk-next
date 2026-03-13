'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Stack,
  Typography,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useState } from 'react';

interface ClinicalFeatureModalProps {
  open: boolean;
  onClose: () => void;
  patientId: number;
  onSuccess: () => void;
}

export default function ClinicalFeatureModal({ 
  open, 
  onClose, 
  patientId, 
  onSuccess 
}: ClinicalFeatureModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    dateRecorded: new Date().toISOString().split('T')[0],
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/patients/${patientId}/clinical-features`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Klinik özellik eklenemedi');
      }

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        dateRecorded: new Date().toISOString().split('T')[0],
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        💖 Klinik Özellik Ekle
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Kayıt Tarihi"
            type="date"
            value={formData.dateRecorded}
            onChange={(e) => handleInputChange('dateRecorded', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Box>
            <Typography variant="h6" gutterBottom>
              📈 Büyüme ve Gelişme
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.growthFailure}
                    onChange={(e) => handleInputChange('growthFailure', e.target.checked)}
                  />
                }
                label="Büyüme Geriliği"
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Boy Persentili (%)"
                  type="number"
                  value={formData.heightPercentile}
                  onChange={(e) => handleInputChange('heightPercentile', e.target.value)}
                  inputProps={{ min: 0, max: 100 }}
                />
                <TextField
                  fullWidth
                  label="Kilo Persentili (%)"
                  type="number"
                  value={formData.weightPercentile}
                  onChange={(e) => handleInputChange('weightPercentile', e.target.value)}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Box>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              🩺 Cilt Sorunları
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.chronicSkinIssue}
                    onChange={(e) => handleInputChange('chronicSkinIssue', e.target.checked)}
                  />
                }
                label="Kronik Cilt Sorunu"
              />

              {formData.chronicSkinIssue && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Cilt Sorunu Türü"
                    value={formData.skinIssueType}
                    onChange={(e) => handleInputChange('skinIssueType', e.target.value)}
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Süre (ay)"
                    type="number"
                    value={formData.skinIssueDuration}
                    onChange={(e) => handleInputChange('skinIssueDuration', e.target.value)}
                    inputProps={{ min: 0 }}
                    sx={{ flex: 1 }}
                  />
                </Box>
              )}
            </Stack>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              🦠 Diğer Klinik Özellikler
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.chronicDiarrhea}
                    onChange={(e) => handleInputChange('chronicDiarrhea', e.target.checked)}
                  />
                }
                label="Kronik İshal"
              />

              {formData.chronicDiarrhea && (
                <TextField
                  label="İshal Süresi (hafta)"
                  type="number"
                  value={formData.diarrheaDuration}
                  onChange={(e) => handleInputChange('diarrheaDuration', e.target.value)}
                  inputProps={{ min: 0 }}
                  sx={{ maxWidth: 200 }}
                />
              )}

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.bcgLymphadenopathy}
                      onChange={(e) => handleInputChange('bcgLymphadenopathy', e.target.checked)}
                    />
                  }
                  label="BCG Lenfadenopati"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.persistentThrush}
                      onChange={(e) => handleInputChange('persistentThrush', e.target.checked)}
                    />
                  }
                  label="Persistan Pamukçuk"
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.deepAbscesses}
                    onChange={(e) => handleInputChange('deepAbscesses', e.target.checked)}
                  />
                }
                label="Derin Apse"
              />

              {formData.deepAbscesses && (
                <TextField
                  fullWidth
                  label="Apse Lokalizasyonu"
                  value={formData.abscessLocation}
                  onChange={(e) => handleInputChange('abscessLocation', e.target.value)}
                />
              )}
            </Stack>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              ❤️ Konjenital Kalp Hastalığı
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.chd}
                    onChange={(e) => handleInputChange('chd', e.target.checked)}
                  />
                }
                label="Konjenital Kalp Hastalığı"
              />

              {formData.chd && (
                <TextField
                  fullWidth
                  label="KKH Türü"
                  value={formData.chdType}
                  onChange={(e) => handleInputChange('chdType', e.target.value)}
                />
              )}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          İptal
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 