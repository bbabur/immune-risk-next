'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Patient {
  id: number;
  firstName?: string;
  lastName?: string;
  birthDate: Date;
  gender: string;
  diagnosisType?: string;
  diagnosisDate?: Date;
  hasImmuneDeficiency?: boolean;
}

interface DiagnosisData {
  hasImmuneDeficiency: boolean;
  diagnosisType: string;
  diagnosisDate: Date | null;
}

// Turkish diagnosis types exactly like Flask version
const diagnosisTypes = [
  { value: '', label: 'Seçiniz' },
  { value: 'SCID', label: 'Ağır Kombine İmmün Yetmezlik (SCID)' },
  { value: 'CVID', label: 'Yaygın Değişken İmmün Yetmezlik (CVID)' },
  { value: 'XLA', label: 'X\'e Bağlı Agamaglobulinemi (XLA)' },
  { value: 'CGD', label: 'Kronik Granülomatöz Hastalık (CGD)' },
  { value: 'WAS', label: 'Wiskott-Aldrich Sendromu (WAS)' },
  { value: 'AT', label: 'Ataksi Telanjiektazi (AT)' },
  { value: 'HIGM', label: 'Hiper IgM Sendromu (HIGM)' },
  { value: 'LAD', label: 'Lökosit Adezyon Defekti (LAD)' },
  { value: 'DiGeorge', label: 'DiGeorge Sendromu' },
  { value: 'Other', label: 'Diğer' },
];

export default function UpdateDiagnosis() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData>({
    hasImmuneDeficiency: false,
    diagnosisType: '',
    diagnosisDate: null,
  });

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/patients/${patientId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient data');
      }

      const data = await response.json();
      setPatient(data);

      // Populate existing diagnosis data if available
      setDiagnosisData({
        hasImmuneDeficiency: data.hasImmuneDeficiency || false,
        diagnosisType: data.diagnosisType || '',
        diagnosisDate: data.diagnosisDate ? new Date(data.diagnosisDate) : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/patients/${patientId}/diagnosis`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagnosisData),
      });

      if (!response.ok) {
        throw new Error('Failed to update diagnosis');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/patients/${patientId}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update diagnosis');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/patients/${patientId}`);
  };

  const handleImmuneDeficiencyChange = (checked: boolean) => {
    setDiagnosisData(prev => ({
      ...prev,
      hasImmuneDeficiency: checked,
      // Clear other fields if unchecked, like in Flask version
      diagnosisType: checked ? prev.diagnosisType : '',
      diagnosisDate: checked ? prev.diagnosisDate : null,
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !patient) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            🩺 Tanı Güncelle - {' '}
            {patient?.firstName || patient?.lastName ? 
              `${patient.firstName || ''} ${patient.lastName || ''}` : 
              `Hasta #${patient?.id}`
            }
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Tanı bilgileri başarıyla güncellendi! Yönlendiriliyor...
            </Alert>
          )}

          <Box component="form" sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
              {/* Has Immune Deficiency Checkbox */}
              <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={diagnosisData.hasImmuneDeficiency}
                      onChange={(e) => handleImmuneDeficiencyChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="İmmün Yetmezlik Tanısı"
                  sx={{ mb: 2 }}
                />
              </Box>

              {/* Diagnosis Type Select */}
              <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <FormControl fullWidth disabled={!diagnosisData.hasImmuneDeficiency}>
                  <InputLabel>Tanı Türü</InputLabel>
                  <Select
                    value={diagnosisData.diagnosisType}
                    onChange={(e) => setDiagnosisData(prev => ({ ...prev, diagnosisType: e.target.value }))}
                    label="Tanı Türü"
                  >
                    {diagnosisTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Diagnosis Date */}
              <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <DatePicker
                  label="Tanı Tarihi"
                  value={diagnosisData.diagnosisDate}
                  onChange={(date) => setDiagnosisData(prev => ({ ...prev, diagnosisDate: date }))}
                  disabled={!diagnosisData.hasImmuneDeficiency}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true 
                    } 
                  }}
                />
              </Box>
            </Box>

            {/* Info Alert */}
            <Alert severity="info" sx={{ mb: 3 }}>
              ℹ️ Tanı bilgilerini güncellemek, sistemdeki makine öğrenmesi modelinin eğitilmesine katkı sağlar.
            </Alert>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={saving}
                startIcon={<span>✖️</span>}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : <span>💾</span>}
              >
                {saving ? 'Güncelleniyor...' : 'Güncelle'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
} 