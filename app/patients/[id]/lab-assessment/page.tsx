'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Alert,
  Divider
} from '@mui/material';
import { Science, Psychology } from '@mui/icons-material';

interface LabData {
  totalLeukocyte: string;
  totalNeutrophil: string;
  totalLymphocyte: string;
  totalEosinophil: string;
  totalPlatelet: string;
  igG: string;
  igE: string;
  igM: string;
  igA: string;
  antiHBS: string;
  isohemagglutinin: string;
}

export default function LabAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [patient, setPatient] = useState<any>(null);
  
  const [formData, setFormData] = useState<LabData>({
    totalLeukocyte: '',
    totalNeutrophil: '',
    totalLymphocyte: '',
    totalEosinophil: '',
    totalPlatelet: '',
    igG: '',
    igE: '',
    igM: '',
    igA: '',
    antiHBS: '',
    isohemagglutinin: ''
  });

  useEffect(() => {
    // Fetch patient data
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patients/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setPatient(data);
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };
    
    fetchPatient();
  }, [patientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // Save lab results
      const response = await fetch(`/api/patients/${patientId}/lab-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Laboratuvar sonuçları kaydedilemedi');
      }

      setSuccess('Laboratuvar sonuçları kaydedildi! Yapay zeka analizi tamamlanıyor...');
      
      // 2 saniye sonra risk assessment sonuç sayfasına yönlendir
      setTimeout(() => {
        router.push(`/patients/${patientId}/risk-result`);
      }, 2000);

    } catch (error) {
      setError('Laboratuvar sonuçları kaydedilirken hata oluştu');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Science sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h1">
            Laboratuvar Değerlendirme
          </Typography>
          {patient && (
            <Typography variant="body2" color="text.secondary">
              Dosya No: {patient.fileNumber}
            </Typography>
          )}
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              🩸 Tam Kan Sayımı
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Total Lökosit Hücre Sayısı (cells/μL)"
                name="totalLeukocyte"
                type="number"
                value={formData.totalLeukocyte}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />

              <TextField
                fullWidth
                label="Total Nötrofil Hücre Sayısı (cells/μL)"
                name="totalNeutrophil"
                type="number"
                value={formData.totalNeutrophil}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />

              <TextField
                fullWidth
                label="Total Lenfosit Hücre Sayısı (cells/μL)"
                name="totalLymphocyte"
                type="number"
                value={formData.totalLymphocyte}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />

              <TextField
                fullWidth
                label="Total Eozinofil Hücre Sayısı (cells/μL)"
                name="totalEosinophil"
                type="number"
                value={formData.totalEosinophil}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />

              <TextField
                fullWidth
                label="Total Platelet Hücre Sayısı (cells/μL)"
                name="totalPlatelet"
                type="number"
                value={formData.totalPlatelet}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />

              <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
                🧬 İmmünoglobulinler
              </Typography>
              <Divider />

              <TextField
                fullWidth
                label="IgG Düzeyi (mg/dL)"
                name="igG"
                type="number"
                value={formData.igG}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />

              <TextField
                fullWidth
                label="IgE Düzeyi (IU/mL)"
                name="igE"
                type="number"
                value={formData.igE}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />

              <TextField
                fullWidth
                label="IgM Düzeyi (mg/dL)"
                name="igM"
                type="number"
                value={formData.igM}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />

              <TextField
                fullWidth
                label="IgA Düzeyi (mg/dL)"
                name="igA"
                type="number"
                value={formData.igA}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />

              <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
                🔬 Ek Tetkikler
              </Typography>
              <Divider />

              <TextField
                fullWidth
                label="Anti-HBS Düzeyi (mIU/mL)"
                name="antiHBS"
                type="number"
                value={formData.antiHBS}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />

              <TextField
                fullWidth
                label="İzohemaglutinin Düzeyi"
                name="isohemagglutinin"
                type="number"
                value={formData.isohemagglutinin}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />

              {/* Buttons */}
              <Box display="flex" justifyContent="center" gap={2} sx={{ mt: 4 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => router.push(`/patients/${patientId}`)}
                  disabled={loading}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={<Psychology />}
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet ve Yapay Zeka Sonucunu Gör'}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </form>
    </Container>
  );
}

