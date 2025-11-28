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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Box,
  Alert,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress
} from '@mui/material';
import { Assessment, Science } from '@mui/icons-material';

interface ClinicalData {
  otitisCount: string;
  sinusitisCount: string;
  prolongedAntibiotics: string;
  pneumoniaCount: string;
  failureToThrive: string;
  deepAbscesses: string;
  persistentThrush: string;
  ivAntibiotics: string;
  deepInfectionsCount: string;
  familyIeiHistory: string;
  hospitalization: string;
  bcgLymphadenopathy: string;
  chronicSkinIssue: string;
  cordFallDay: string;
  chd: string;
  chronicDiarrhea: string;
  icuAdmission: string;
  familyEarlyDeath: string;
}

export default function ClinicalAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [patient, setPatient] = useState<any>(null);
  
  const [formData, setFormData] = useState<ClinicalData>({
    otitisCount: '0',
    sinusitisCount: '0',
    prolongedAntibiotics: 'no',
    pneumoniaCount: '0',
    failureToThrive: 'no',
    deepAbscesses: 'no',
    persistentThrush: 'no',
    ivAntibiotics: 'no',
    deepInfectionsCount: '0',
    familyIeiHistory: 'no',
    hospitalization: 'no',
    bcgLymphadenopathy: 'no',
    chronicSkinIssue: 'no',
    cordFallDay: '',
    chd: 'no',
    chronicDiarrhea: 'no',
    icuAdmission: 'no',
    familyEarlyDeath: 'no'
  });

  useEffect(() => {
    // Fetch patient data
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patients/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setPatient(data);
          
          // Pre-fill cord fall day if exists
          if (data.cordFallDay) {
            setFormData(prev => ({
              ...prev,
              cordFallDay: data.cordFallDay.toString()
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };
    
    fetchPatient();
  }, [patientId]);

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      // Save clinical assessment
      const response = await fetch(`/api/patients/${patientId}/clinical-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Klinik değerlendirme kaydedilemedi');
      }

      setSuccess('Klinik değerlendirme kaydedildi! Laboratuvar değerlendirme sayfasına yönlendiriliyorsunuz...');
      
      // 2 saniye sonra laboratuvar sayfasına yönlendir
      setTimeout(() => {
        router.push(`/patients/${patientId}/lab-assessment`);
      }, 2000);

    } catch (error) {
      setError('Klinik değerlendirme kaydedilirken hata oluştu');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Count options (0-10+)
  const countOptions = [
    { value: '0', label: '0' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10 veya daha fazla' }
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Assessment sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h1">
            Klinik Değerlendirme
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
              📋 JMF Kriterleri ve Klinik Bulgular
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack spacing={3}>
              {/* Otitis */}
              <FormControl fullWidth>
                <InputLabel>1 yıl içinde otit sayısı</InputLabel>
                <Select
                  name="otitisCount"
                  value={formData.otitisCount}
                  onChange={handleSelectChange}
                  label="1 yıl içinde otit sayısı"
                >
                  {countOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Sinusitis */}
              <FormControl fullWidth>
                <InputLabel>1 yıl içinde sinüzit sayısı</InputLabel>
                <Select
                  name="sinusitisCount"
                  value={formData.sinusitisCount}
                  onChange={handleSelectChange}
                  label="1 yıl içinde sinüzit sayısı"
                >
                  {countOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Prolonged Antibiotics */}
              <FormControl fullWidth>
                <InputLabel>Az etkili ≥2 ay antibiyotik kullanımı</InputLabel>
                <Select
                  name="prolongedAntibiotics"
                  value={formData.prolongedAntibiotics}
                  onChange={handleSelectChange}
                  label="Az etkili ≥2 ay antibiyotik kullanımı"
                >
                  <MenuItem value="no">2 ay ve üzeri antibiyotik kullanımı yok</MenuItem>
                  <MenuItem value="yes">2 ay ve üzeri antibiyotik kullanımı var</MenuItem>
                </Select>
              </FormControl>

              {/* Pneumonia */}
              <FormControl fullWidth>
                <InputLabel>1 yıl içinde ≥2 pnömoni</InputLabel>
                <Select
                  name="pneumoniaCount"
                  value={formData.pneumoniaCount}
                  onChange={handleSelectChange}
                  label="1 yıl içinde ≥2 pnömoni"
                >
                  {countOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Failure to Thrive */}
              <FormControl fullWidth>
                <InputLabel>Bir bebeğin kilo alamaması veya normal büyümemesi</InputLabel>
                <Select
                  name="failureToThrive"
                  value={formData.failureToThrive}
                  onChange={handleSelectChange}
                  label="Bir bebeğin kilo alamaması veya normal büyümemesi"
                >
                  <MenuItem value="no">Mevcut Değil</MenuItem>
                  <MenuItem value="yes">Mevcut</MenuItem>
                </Select>
              </FormControl>

              {/* Deep Abscesses */}
              <FormControl fullWidth>
                <InputLabel>Tekrarlayan, derin cilt veya organ apseleri</InputLabel>
                <Select
                  name="deepAbscesses"
                  value={formData.deepAbscesses}
                  onChange={handleSelectChange}
                  label="Tekrarlayan, derin cilt veya organ apseleri"
                >
                  <MenuItem value="no">Mevcut Değil</MenuItem>
                  <MenuItem value="yes">Mevcut</MenuItem>
                </Select>
              </FormControl>

              {/* Persistent Thrush */}
              <FormControl fullWidth>
                <InputLabel>Ağızda veya deride kalıcı pamukçuk ya da mantar enfeksiyonu</InputLabel>
                <Select
                  name="persistentThrush"
                  value={formData.persistentThrush}
                  onChange={handleSelectChange}
                  label="Ağızda veya deride kalıcı pamukçuk ya da mantar enfeksiyonu"
                >
                  <MenuItem value="no">Mevcut Değil</MenuItem>
                  <MenuItem value="yes">Mevcut</MenuItem>
                </Select>
              </FormControl>

              {/* IV Antibiotics */}
              <FormControl fullWidth>
                <InputLabel>İntravenöz antibiyotik gerektiren enfeksiyonlar</InputLabel>
                <Select
                  name="ivAntibiotics"
                  value={formData.ivAntibiotics}
                  onChange={handleSelectChange}
                  label="İntravenöz antibiyotik gerektiren enfeksiyonlar"
                >
                  <MenuItem value="no">Mevcut Değil</MenuItem>
                  <MenuItem value="yes">Mevcut</MenuItem>
                </Select>
              </FormControl>

              {/* Deep Infections */}
              <FormControl fullWidth>
                <InputLabel>Septisemi dâhil ≥2 derin enfeksiyon</InputLabel>
                <Select
                  name="deepInfectionsCount"
                  value={formData.deepInfectionsCount}
                  onChange={handleSelectChange}
                  label="Septisemi dâhil ≥2 derin enfeksiyon"
                >
                  {countOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Family IEI History */}
              <FormControl fullWidth>
                <InputLabel>Ailede doğuştan immün yetmezlik öyküsü</InputLabel>
                <Select
                  name="familyIeiHistory"
                  value={formData.familyIeiHistory}
                  onChange={handleSelectChange}
                  label="Ailede doğuştan immün yetmezlik öyküsü"
                >
                  <MenuItem value="no">Mevcut Değil</MenuItem>
                  <MenuItem value="yes">Mevcut</MenuItem>
                </Select>
              </FormControl>

              {/* Hospitalization */}
              <FormControl fullWidth>
                <InputLabel>Hastaneye yatış varlığı</InputLabel>
                <Select
                  name="hospitalization"
                  value={formData.hospitalization}
                  onChange={handleSelectChange}
                  label="Hastaneye yatış varlığı"
                >
                  <MenuItem value="no">Mevcut Değil</MenuItem>
                  <MenuItem value="yes">Mevcut</MenuItem>
                </Select>
              </FormControl>

              {/* BCG Lymphadenopathy */}
              <FormControl fullWidth>
                <InputLabel>BCG aşısı sonrası lenfadenopati</InputLabel>
                <Select
                  name="bcgLymphadenopathy"
                  value={formData.bcgLymphadenopathy}
                  onChange={handleSelectChange}
                  label="BCG aşısı sonrası lenfadenopati"
                >
                  <MenuItem value="no">Mevcut Değil</MenuItem>
                  <MenuItem value="yes">Mevcut</MenuItem>
                </Select>
              </FormControl>

              {/* Chronic Skin Issue */}
              <FormControl fullWidth>
                <InputLabel>Kronik cilt (deri) problemleri</InputLabel>
                <Select
                  name="chronicSkinIssue"
                  value={formData.chronicSkinIssue}
                  onChange={handleSelectChange}
                  label="Kronik cilt (deri) problemleri"
                >
                  <MenuItem value="no">Mevcut Değil</MenuItem>
                  <MenuItem value="yes">Mevcut</MenuItem>
                </Select>
              </FormControl>

              {/* Cord Fall Day */}
              <TextField
                fullWidth
                label="Göbek kordonunun düşme günü"
                name="cordFallDay"
                type="number"
                value={formData.cordFallDay}
                onChange={handleChange}
                inputProps={{ min: 0, max: 30 }}
                helperText="0-30 gün arası"
              />

              {/* CHD */}
              <FormControl fullWidth>
                <InputLabel>Konjenital kalp hastalığı</InputLabel>
                <Select
                  name="chd"
                  value={formData.chd}
                  onChange={handleSelectChange}
                  label="Konjenital kalp hastalığı"
                >
                  <MenuItem value="no">Mevcut Değil</MenuItem>
                  <MenuItem value="yes">Mevcut</MenuItem>
                </Select>
              </FormControl>

              {/* Chronic Diarrhea */}
              <FormControl fullWidth>
                <InputLabel>Kronik ishal</InputLabel>
                <Select
                  name="chronicDiarrhea"
                  value={formData.chronicDiarrhea}
                  onChange={handleSelectChange}
                  label="Kronik ishal"
                >
                  <MenuItem value="no">Mevcut Değil</MenuItem>
                  <MenuItem value="yes">Mevcut</MenuItem>
                </Select>
              </FormControl>

              {/* ICU Admission */}
              <FormControl fullWidth>
                <InputLabel>Yoğun bakımda yatış</InputLabel>
                <Select
                  name="icuAdmission"
                  value={formData.icuAdmission}
                  onChange={handleSelectChange}
                  label="Yoğun bakımda yatış"
                >
                  <MenuItem value="no">Mevcut Değil</MenuItem>
                  <MenuItem value="yes">Mevcut</MenuItem>
                </Select>
              </FormControl>

              {/* Family Early Death */}
              <FormControl fullWidth>
                <InputLabel>Ailede erken ölüm öyküsü</InputLabel>
                <Select
                  name="familyEarlyDeath"
                  value={formData.familyEarlyDeath}
                  onChange={handleSelectChange}
                  label="Ailede erken ölüm öyküsü"
                >
                  <MenuItem value="no">Mevcut Değil</MenuItem>
                  <MenuItem value="yes">Mevcut</MenuItem>
                </Select>
              </FormControl>

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
                  startIcon={<Science />}
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet ve Yapay Zeka Analizi Yap'}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </form>
    </Container>
  );
}

