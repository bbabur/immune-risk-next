'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Alert,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Storage as StorageIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Psychology as PsychologyIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  DeleteSweep as DeleteSweepIcon,
  Download as DownloadIcon,
  TableView as TableViewIcon,
} from '@mui/icons-material';

interface TrainingPatient {
  id: number;
  patientCode: string;
  ageMonths: number;
  gender: string;
  birthWeight: number | null;
  gestationalAge: number | null;
  birthType: string | null;
  breastfeedingMonths: number | null;
  cordFallDay: number | null;
  parentalConsanguinity: boolean;
  clinicalFeatures: any;
  infections: any;
  hospitalizations: any;
  familyHistory: any;
  hasImmuneDeficiency: boolean;
  diagnosisType: string | null;
  ruleBasedScore: number | null;
  finalRiskLevel: string | null;
  sourceFile: string | null;
}

export default function TrainingDataPage() {
  const [trainingData, setTrainingData] = useState<TrainingPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<TrainingPatient | null>(null);

  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/training-data');
      if (response.ok) {
        const data = await response.json();
        setTrainingData(data);
      }
    } catch (error) {
      console.error('Training data yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    // Önce mevcut veriyi kontrol et
    if (trainingData.length > 0) {
      alert(`Veritabanında zaten ${trainingData.length} kayıt var. Silmek için "Tümünü Sil" butonunu kullanın.`);
      return;
    }

    if (!confirm('200 eğitim verisi yüklenecek. Devam edilsin mi?')) return;

    try {
      setSeeding(true);
      setSeedResult(null);

      const response = await fetch('/api/training-data/seed', {
        method: 'POST'
      });

      const data = await response.json();
      setSeedResult(data);

      if (data.success) {
        await loadTrainingData();
      }
    } catch (error) {
      setSeedResult({
        success: false,
        message: 'Seed işlemi başarısız',
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) return;

    try {
      setDeleting(id);
      const response = await fetch(`/api/training-data/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadTrainingData();
      } else {
        alert('Silme işlemi başarısız');
      }
    } catch (error) {
      alert('Hata oluştu');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(`TÜM ${trainingData.length} KAYIT SİLİNECEK! Emin misiniz?`)) return;
    if (!confirm('Bu işlem geri alınamaz. Devam edilsin mi?')) return;

    try {
      setLoading(true);
      const response = await fetch('/api/training-data', {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadTrainingData();
        alert('Tüm kayıtlar silindi');
      } else {
        alert('Silme işlemi başarısız');
      }
    } catch (error) {
      alert('Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient: TrainingPatient) => {
    setEditingPatient(patient);
    setEditDialogOpen(true);
  };

  const handleUpdatePatient = async () => {
    if (!editingPatient) return;

    try {
      const response = await fetch(`/api/training-data/${editingPatient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPatient)
      });

      if (response.ok) {
        await loadTrainingData();
        setEditDialogOpen(false);
        setEditingPatient(null);
        alert('Kayıt güncellendi');
      }
    } catch (error) {
      alert('Güncelleme başarısız');
    }
  };

  const handleExportCSV = () => {
    // CSV headers
    const headers = [
      'Dosya No', 'Yaş (Ay)', 'Cinsiyet', 'Doğum Kilosu', 'Gestasyon', 
      'Doğum Şekli', 'Anne Sütü (Ay)', 'Göbek Düşme', 'Akrabalık',
      'Tanı', 'Risk Seviyesi', 'Puan'
    ];

    // Convert data to CSV format
    const csvContent = [
      headers.join(','),
      ...trainingData.map(p => [
        p.patientCode,
        p.ageMonths,
        p.gender,
        p.birthWeight || '',
        p.gestationalAge || '',
        p.birthType || '',
        p.breastfeedingMonths || '',
        p.cordFallDay || '',
        p.parentalConsanguinity ? 'Evet' : 'Hayır',
        p.diagnosisType || '',
        p.finalRiskLevel || '',
        p.ruleBasedScore || ''
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `training-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PsychologyIcon sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Model Eğitim Datası
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          AI/ML modeli için kullanılan anonimleştirilmiş eğitim veri seti
        </Typography>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Toplam Kayıt
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {trainingData.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              İmmün Yetmezlik
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {trainingData.filter(p => p.hasImmuneDeficiency).length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Kaynak
            </Typography>
            <Typography variant="h6">
              ANA TABLO.xlsx
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Seed Button */}
      {trainingData.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
          <StorageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Henüz eğitim verisi yüklenmemiş
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            200 anonimleştirilmiş hasta kaydını model eğitimi için yükleyin
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={seeding ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            onClick={handleSeed}
            disabled={seeding}
          >
            {seeding ? 'Yükleniyor...' : 'Eğitim Verisini Yükle'}
          </Button>
        </Paper>
      )}

      {/* Seed Result */}
      {seedResult && (
        <Alert 
          severity={seedResult.success ? 'success' : 'error'}
          icon={seedResult.success ? <CheckCircleIcon /> : undefined}
          sx={{ mb: 3 }}
        >
          {seedResult.message}
          {seedResult.results && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                ✅ Başarılı: {seedResult.results.success} | ❌ Başarısız: {seedResult.results.failed}
              </Typography>
            </Box>
          )}
        </Alert>
      )}

      {/* Data Table */}
      {trainingData.length > 0 && (
        <Paper>
          <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              📊 Eğitim Veri Seti ({trainingData.length} kayıt)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{ bgcolor: 'white', color: 'success.main', borderColor: 'white' }}
                startIcon={<DownloadIcon />}
                onClick={handleExportCSV}
              >
                CSV İndir
              </Button>
              {trainingData.length < 200 && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ bgcolor: 'white', color: 'secondary.main' }}
                  startIcon={<CloudUploadIcon />}
                  onClick={handleSeed}
                  disabled={seeding}
                >
                  Veri Yükle
                </Button>
              )}
              {trainingData.length > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ bgcolor: 'white', color: 'error.main', borderColor: 'white', '&:hover': { borderColor: 'error.light' } }}
                  startIcon={<DeleteSweepIcon />}
                  onClick={handleDeleteAll}
                >
                  Tümünü Sil
                </Button>
              )}
            </Box>
          </Box>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'primary.light' }}><strong>Dosya No</strong></TableCell>
                  <TableCell><strong>Yaş</strong></TableCell>
                  <TableCell><strong>Cins.</strong></TableCell>
                  <TableCell><strong>Doğum Kilo</strong></TableCell>
                  <TableCell><strong>Gest.</strong></TableCell>
                  <TableCell><strong>Doğum Şekli</strong></TableCell>
                  <TableCell><strong>Anne Sütü</strong></TableCell>
                  <TableCell><strong>Göbek Düşme</strong></TableCell>
                  <TableCell><strong>Akrabalık</strong></TableCell>
                  <TableCell><strong>Büyüme Ger.</strong></TableCell>
                  <TableCell><strong>Cilt Prob.</strong></TableCell>
                  <TableCell><strong>İshal</strong></TableCell>
                  <TableCell><strong>BCG Lap</strong></TableCell>
                  <TableCell><strong>Pamukçuk</strong></TableCell>
                  <TableCell><strong>Abse</strong></TableCell>
                  <TableCell><strong>Kalp</strong></TableCell>
                  <TableCell><strong>Enfeksiyon</strong></TableCell>
                  <TableCell><strong>Hastane</strong></TableCell>
                  <TableCell><strong>Aile Öyküsü</strong></TableCell>
                  <TableCell><strong>Tanı</strong></TableCell>
                  <TableCell><strong>Risk</strong></TableCell>
                  <TableCell><strong>İşlem</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainingData.map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell sx={{ bgcolor: 'primary.light', fontWeight: 'bold' }}>
                      <Chip 
                        label={patient.patientCode} 
                        size="small" 
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>{patient.ageMonths}ay</TableCell>
                    <TableCell>{patient.gender === 'Erkek' ? 'E' : patient.gender === 'Kadın' ? 'K' : '-'}</TableCell>
                    <TableCell>{patient.birthWeight ? `${patient.birthWeight}g` : '-'}</TableCell>
                    <TableCell>{patient.gestationalAge ? `${patient.gestationalAge}hf` : '-'}</TableCell>
                    <TableCell>{patient.birthType || '-'}</TableCell>
                    <TableCell>{patient.breastfeedingMonths ? `${patient.breastfeedingMonths}ay` : '-'}</TableCell>
                    <TableCell>{patient.cordFallDay ? `${patient.cordFallDay}gün` : '-'}</TableCell>
                    <TableCell>
                      {patient.parentalConsanguinity ? (
                        <Chip label="✓" size="small" color="warning" />
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                    <TableCell>{patient.clinicalFeatures?.growthFailure ? '✓' : '-'}</TableCell>
                    <TableCell>{patient.clinicalFeatures?.chronicSkinIssue ? '✓' : '-'}</TableCell>
                    <TableCell>{patient.clinicalFeatures?.chronicDiarrhea ? '✓' : '-'}</TableCell>
                    <TableCell>{patient.clinicalFeatures?.bcgLymphadenopathy ? '✓' : '-'}</TableCell>
                    <TableCell>{patient.clinicalFeatures?.persistentThrush ? '✓' : '-'}</TableCell>
                    <TableCell>{patient.clinicalFeatures?.deepAbscesses ? '✓' : '-'}</TableCell>
                    <TableCell>{patient.clinicalFeatures?.chd ? '✓' : '-'}</TableCell>
                    <TableCell>{patient.infections?.hasInfections ? '✓' : '-'}</TableCell>
                    <TableCell>{patient.hospitalizations?.hasHospitalization ? '✓' : '-'}</TableCell>
                    <TableCell>
                      {patient.familyHistory?.piy || patient.familyHistory?.tbc || 
                       patient.familyHistory?.heart || patient.familyHistory?.allergy ? '✓' : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={patient.hasImmuneDeficiency ? 'İY' : 'Normal'} 
                        size="small" 
                        color={patient.hasImmuneDeficiency ? 'error' : 'success'}
                      />
                    </TableCell>
                    <TableCell>{patient.finalRiskLevel || '-'}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="error"
                        startIcon={deleting === patient.id ? <CircularProgress size={12} /> : <DeleteIcon />}
                        onClick={() => handleDelete(patient.id)}
                        disabled={deleting === patient.id}
                      >
                        Sil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100' }}>
            <Typography variant="body2" color="text.secondary">
              Toplam {trainingData.length} kayıt gösteriliyor
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Info */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Not:</strong> Bu veri seti AI/ML modelinin eğitimi için kullanılır. 
          Tüm veriler anonimleştirilmiştir ve hasta kodları (P001, P002, vb.) ile tanımlanır.
        </Typography>
      </Alert>
    </Container>
  );
}

