'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Alert,
  TextField
} from '@mui/material';
import { MedicalServices, Save } from '@mui/icons-material';
import { useNotification } from './NotificationProvider';

interface DiagnosisUpdateFormProps {
  patientId: number;
  patientName: string;
  currentDiagnosis?: {
    hasImmuneDeficiency: boolean;
    diagnosisType?: string;
    diagnosisDate?: string;
  };
  onUpdate?: () => void;
}

export default function DiagnosisUpdateForm({
  patientId,
  patientName,
  currentDiagnosis,
  onUpdate
}: DiagnosisUpdateFormProps) {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    hasImmuneDeficiency: currentDiagnosis?.hasImmuneDeficiency || false,
    diagnosisType: currentDiagnosis?.diagnosisType || '',
    diagnosisDate: currentDiagnosis?.diagnosisDate || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/patients/${patientId}/diagnosis`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Bildirim göster
        const diagnosisText = formData.hasImmuneDeficiency ? 'Pozitif' : 'Negatif';
        showNotification(
          `🩺 ${patientName} için tanı güncellendi: ${diagnosisText}`,
          'info'
        );
        
        // Custom event dispatch
        window.dispatchEvent(new CustomEvent('patient-diagnosed'));
        
        if (onUpdate) {
          onUpdate();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Tanı güncellenirken hata oluştu');
      }
    } catch (error: any) {
      setError('Bağlantı hatası oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mt: 3 }}>
      <Box sx={{ bgcolor: 'info.main', color: 'white', p: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MedicalServices />
          Tanı Bilgileri Güncelle
        </Typography>
      </Box>
      
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>İmmün Yetmezlik Durumu</InputLabel>
            <Select
              value={formData.hasImmuneDeficiency ? 'true' : 'false'}
              label="İmmün Yetmezlik Durumu"
              onChange={(e) => setFormData({
                ...formData,
                hasImmuneDeficiency: e.target.value === 'true'
              })}
            >
              <MenuItem value="false">Negatif</MenuItem>
              <MenuItem value="true">Pozitif</MenuItem>
            </Select>
          </FormControl>

          {formData.hasImmuneDeficiency && (
            <TextField
              fullWidth
              label="Tanı Tipi"
              value={formData.diagnosisType}
              onChange={(e) => setFormData({
                ...formData,
                diagnosisType: e.target.value
              })}
              placeholder="Örn: SCID, CVID, XLA"
            />
          )}

          <TextField
            fullWidth
            label="Tanı Tarihi"
            type="date"
            value={formData.diagnosisDate}
            onChange={(e) => setFormData({
              ...formData,
              diagnosisDate: e.target.value
            })}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="info"
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? 'Güncelleniyor...' : 'Tanıyı Güncelle'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
} 