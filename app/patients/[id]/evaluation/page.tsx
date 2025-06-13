'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Box, 
  Alert
} from '@mui/material';
import { Biotech, Calculate, Cancel } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface LabData {
  totalWbc: number | '';
  totalNeutrophils: number | '';
  totalLymphocytes: number | '';
  cd3TCells: number | '';
  cd4TCells: number | '';
  cd8TCells: number | '';
  cd19BCells: number | '';
  igG: number | '';
  igA: number | '';
  igM: number | '';
  igE: number | '';
  complementC3: number | '';
  complementC4: number | '';
  ch50: number | '';
  additionalNotes: string;
}

export default function EvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [labData, setLabData] = useState<LabData>({
    totalWbc: '',
    totalNeutrophils: '',
    totalLymphocytes: '',
    cd3TCells: '',
    cd4TCells: '',
    cd8TCells: '',
    cd19BCells: '',
    igG: '',
    igA: '',
    igM: '',
    igE: '',
    complementC3: '',
    complementC4: '',
    ch50: '',
    additionalNotes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleChange = (field: keyof LabData, value: any) => {
    setLabData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: Number(patientId),
          ...labData
        }),
      });

      if (response.ok) {
        // Hasta detay sayfasına yönlendir
        router.push(`/patients/${patientId}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Değerlendirme sırasında hata oluştu');
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
            <Biotech sx={{ mr: 1 }} />
            Laboratuvar Değerlendirmesi
          </Typography>
        </Box>
        
        <CardContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Bu form, hastanın immün sistem değerlendirmesi için önemli laboratuvar parametrelerini içermektedir.
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            {/* Tam Kan Sayımı */}
            <Typography variant="h6" sx={{ mb: 2 }}>Tam Kan Sayımı</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="Toplam Lökosit (WBC) (cells/mm³)"
                type="number"
                value={labData.totalWbc}
                onChange={(e) => handleChange('totalWbc', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
              <TextField
                fullWidth
                label="Nötrofil Sayısı (cells/mm³)"
                type="number"
                value={labData.totalNeutrophils}
                onChange={(e) => handleChange('totalNeutrophils', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
              <TextField
                fullWidth
                label="Lenfosit Sayısı (cells/mm³)"
                type="number"
                value={labData.totalLymphocytes}
                onChange={(e) => handleChange('totalLymphocytes', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
            </Box>

            {/* Lenfosit Alt Grupları */}
            <Typography variant="h6" sx={{ mb: 2 }}>Lenfosit Alt Grupları</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="CD3+ T Hücreleri (%)"
                type="number"
                value={labData.cd3TCells}
                onChange={(e) => handleChange('cd3TCells', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
              <TextField
                fullWidth
                label="CD4+ T Hücreleri (%)"
                type="number"
                value={labData.cd4TCells}
                onChange={(e) => handleChange('cd4TCells', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
              <TextField
                fullWidth
                label="CD8+ T Hücreleri (%)"
                type="number"
                value={labData.cd8TCells}
                onChange={(e) => handleChange('cd8TCells', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
              <TextField
                fullWidth
                label="CD19+ B Hücreleri (%)"
                type="number"
                value={labData.cd19BCells}
                onChange={(e) => handleChange('cd19BCells', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
            </Box>

            {/* İmmünoglobulinler */}
            <Typography variant="h6" sx={{ mb: 2 }}>İmmünoglobulinler</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="IgG (mg/dL)"
                type="number"
                value={labData.igG}
                onChange={(e) => handleChange('igG', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
              <TextField
                fullWidth
                label="IgA (mg/dL)"
                type="number"
                value={labData.igA}
                onChange={(e) => handleChange('igA', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
              <TextField
                fullWidth
                label="IgM (mg/dL)"
                type="number"
                value={labData.igM}
                onChange={(e) => handleChange('igM', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
              <TextField
                fullWidth
                label="IgE (IU/mL)"
                type="number"
                value={labData.igE}
                onChange={(e) => handleChange('igE', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
            </Box>

            {/* Kompleman Sistemi */}
            <Typography variant="h6" sx={{ mb: 2 }}>Kompleman Sistemi</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="Kompleman C3 (mg/dL)"
                type="number"
                value={labData.complementC3}
                onChange={(e) => handleChange('complementC3', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
              <TextField
                fullWidth
                label="Kompleman C4 (mg/dL)"
                type="number"
                value={labData.complementC4}
                onChange={(e) => handleChange('complementC4', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
              <TextField
                fullWidth
                label="CH50 (U/mL)"
                type="number"
                value={labData.ch50}
                onChange={(e) => handleChange('ch50', e.target.value ? Number(e.target.value) : '')}
                inputProps={{ step: 0.01 }}
              />
            </Box>

            {/* Ek Notlar */}
            <TextField
              fullWidth
              label="Ek Notlar"
              multiline
              rows={3}
              value={labData.additionalNotes}
              onChange={(e) => handleChange('additionalNotes', e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                component={Link}
                href={`/patients/${patientId}`}
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Calculate />}
                disabled={loading}
              >
                {loading ? 'Hesaplanıyor...' : 'Değerlendirmeyi Hesapla'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 