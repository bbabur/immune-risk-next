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
  Visibility as VisibilityIcon,
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
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailPatient, setDetailPatient] = useState<TrainingPatient | null>(null);
  const [detailEditMode, setDetailEditMode] = useState(false);

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

  const handleViewDetail = (patient: TrainingPatient) => {
    setDetailPatient(patient);
    setDetailEditMode(false);
    setDetailDialogOpen(true);
  };

  const handleSaveDetailChanges = async () => {
    if (!detailPatient) return;

    try {
      const response = await fetch(`/api/training-data/${detailPatient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detailPatient)
      });

      if (response.ok) {
        await loadTrainingData();
        setDetailEditMode(false);
        alert('Kayıt güncellendi');
      } else {
        alert('Güncelleme başarısız');
      }
    } catch (error) {
      alert('Güncelleme başarısız');
    }
  };

  const handleCancelDetailEdit = () => {
    setDetailEditMode(false);
    // Reload original data
    const original = trainingData.find(p => p.id === detailPatient?.id);
    if (original) {
      setDetailPatient(original);
    }
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
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        <Button
                          size="small"
                          color="info"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewDetail(patient)}
                        >
                          Detay
                        </Button>
                        <Button
                          size="small"
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(patient)}
                        >
                          Düzenle
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={deleting === patient.id ? <CircularProgress size={12} /> : <DeleteIcon />}
                          onClick={() => handleDelete(patient.id)}
                          disabled={deleting === patient.id}
                        >
                          Sil
                        </Button>
                      </Box>
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

      {/* Detail Dialog - Tüm Kolonları Göster */}
      <Dialog open={detailDialogOpen} onClose={() => { setDetailDialogOpen(false); setDetailEditMode(false); }} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {detailEditMode ? <EditIcon /> : <VisibilityIcon />}
            <Typography variant="h6">
              {detailEditMode ? 'Düzenleniyor' : 'Detaylar'} - {detailPatient?.patientCode}
            </Typography>
          </Box>
          {!detailEditMode && (
            <Button
              variant="contained"
              color="warning"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setDetailEditMode(true)}
              sx={{ bgcolor: 'white', color: 'warning.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Düzenle
            </Button>
          )}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {detailPatient && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Temel Bilgiler */}
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  📋 Temel Bilgiler
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                  {detailEditMode ? (
                    <>
                      <TextField
                        label="Dosya No"
                        value={detailPatient.patientCode}
                        onChange={(e) => setDetailPatient({ ...detailPatient, patientCode: e.target.value })}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        label="Yaş (Ay)"
                        type="number"
                        value={detailPatient.ageMonths}
                        onChange={(e) => setDetailPatient({ ...detailPatient, ageMonths: parseInt(e.target.value) })}
                        size="small"
                        fullWidth
                      />
                      <FormControl fullWidth size="small">
                        <InputLabel>Cinsiyet</InputLabel>
                        <Select
                          value={detailPatient.gender}
                          label="Cinsiyet"
                          onChange={(e) => setDetailPatient({ ...detailPatient, gender: e.target.value })}
                        >
                          <MenuItem value="Erkek">Erkek</MenuItem>
                          <MenuItem value="Kadın">Kadın</MenuItem>
                          <MenuItem value="Bilinmiyor">Bilinmiyor</MenuItem>
                        </Select>
                      </FormControl>
                    </>
                  ) : (
                    <>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Dosya No</Typography>
                        <Typography variant="body1" fontWeight="bold">{detailPatient.patientCode}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Yaş</Typography>
                        <Typography variant="body1">{detailPatient.ageMonths} ay</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Cinsiyet</Typography>
                        <Typography variant="body1">{detailPatient.gender}</Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Paper>

              {/* Doğum Bilgileri */}
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  👶 Doğum Bilgileri
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                  {detailEditMode ? (
                    <>
                      <TextField
                        label="Doğum Kilosu (gram)"
                        type="number"
                        value={detailPatient.birthWeight || ''}
                        onChange={(e) => setDetailPatient({ ...detailPatient, birthWeight: e.target.value ? parseFloat(e.target.value) : null })}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        label="Gestasyon (hafta)"
                        type="number"
                        value={detailPatient.gestationalAge || ''}
                        onChange={(e) => setDetailPatient({ ...detailPatient, gestationalAge: e.target.value ? parseInt(e.target.value) : null })}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        label="Doğum Şekli"
                        value={detailPatient.birthType || ''}
                        onChange={(e) => setDetailPatient({ ...detailPatient, birthType: e.target.value })}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        label="Anne Sütü (ay)"
                        type="number"
                        value={detailPatient.breastfeedingMonths || ''}
                        onChange={(e) => setDetailPatient({ ...detailPatient, breastfeedingMonths: e.target.value ? parseInt(e.target.value) : null })}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        label="Göbek Düşme (gün)"
                        type="number"
                        value={detailPatient.cordFallDay || ''}
                        onChange={(e) => setDetailPatient({ ...detailPatient, cordFallDay: e.target.value ? parseInt(e.target.value) : null })}
                        size="small"
                        fullWidth
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={detailPatient.parentalConsanguinity}
                            onChange={(e) => setDetailPatient({ ...detailPatient, parentalConsanguinity: e.target.checked })}
                          />
                        }
                        label="Akrabalık Var"
                      />
                    </>
                  ) : (
                    <>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Doğum Kilosu</Typography>
                        <Typography variant="body1">{detailPatient.birthWeight ? `${detailPatient.birthWeight} g` : '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Gestasyon</Typography>
                        <Typography variant="body1">{detailPatient.gestationalAge ? `${detailPatient.gestationalAge} hafta` : '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Doğum Şekli</Typography>
                        <Typography variant="body1">{detailPatient.birthType || '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Anne Sütü Süresi</Typography>
                        <Typography variant="body1">{detailPatient.breastfeedingMonths ? `${detailPatient.breastfeedingMonths} ay` : '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Göbek Düşme</Typography>
                        <Typography variant="body1">{detailPatient.cordFallDay ? `${detailPatient.cordFallDay}. gün` : '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Akrabalık</Typography>
                        <Chip 
                          label={detailPatient.parentalConsanguinity ? 'VAR' : 'YOK'} 
                          size="small" 
                          color={detailPatient.parentalConsanguinity ? 'warning' : 'default'}
                        />
                      </Box>
                    </>
                  )}
                </Box>
              </Paper>

              {/* Klinik Özellikler */}
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  🏥 Klinik Özellikler
                </Typography>
                {detailPatient.clinicalFeatures ? (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    {Object.entries(detailPatient.clinicalFeatures as Record<string, any>).map(([key, value]) => (
                      <Box key={key}>
                        <Typography variant="caption" color="text.secondary">
                          {key === 'growthFailure' ? 'Büyüme Geriliği' :
                           key === 'chronicSkinIssue' ? 'Cilt Problemi' :
                           key === 'chronicDiarrhea' ? 'Kronik İshal' :
                           key === 'bcgLymphadenopathy' ? 'BCG Lenfadenopati' :
                           key === 'persistentThrush' ? 'Pamukçuk' :
                           key === 'deepAbscesses' ? 'Derin Abseler' :
                           key === 'chd' ? 'Konjenital Kalp Hastalığı' :
                           key === 'familyHistoryPiy' ? 'Aile Öyküsü PİY' :
                           key === 'familyHistoryTbc' ? 'Aile Öyküsü TBC' :
                           key === 'familyHistoryHeart' ? 'Aile Öyküsü Kalp' :
                           key === 'familyHistoryAllergy' ? 'Aile Öyküsü Alerji' :
                           key === 'ieiRelationship' ? 'İEİ Akrabalık' :
                           key === 'ieiDeathCount' ? 'İEİ Ölüm Sayısı' :
                           key}
                        </Typography>
                        <Typography variant="body1">
                          {typeof value === 'boolean' ? (value ? '✅ Evet' : '❌ Hayır') : 
                           value === null || value === undefined ? '-' : 
                           String(value)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">Veri yok</Typography>
                )}
              </Paper>

              {/* Enfeksiyonlar */}
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  🦠 Enfeksiyonlar
                </Typography>
                {detailPatient.infections ? (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    {Object.entries(detailPatient.infections as Record<string, any>).map(([key, value]) => (
                      <Box key={key}>
                        <Typography variant="caption" color="text.secondary">
                          {key === 'hasInfections' ? 'Enfeksiyon Var' :
                           key === 'recurrentInfections' ? 'Tekrarlayan Enfeksiyon' :
                           key === 'severeBacterial' ? 'Ağır Bakteriyel' :
                           key === 'opportunisticInfections' ? 'Fırsatçı Enfeksiyon' :
                           key === 'respiratoryInfections' ? 'Solunum Yolu' :
                           key === 'respiratoryCount' ? 'Solunum Sayısı' :
                           key === 'upperRespiratory' ? 'Üst Solunum' :
                           key === 'lowerRespiratory' ? 'Alt Solunum' :
                           key === 'otitisCount' ? 'Otit Sayısı' :
                           key === 'sinusitis' ? 'Sinüzit' :
                           key === 'pneumoniaCount' ? 'Pnömoni Sayısı' :
                           key === 'giInfections' ? 'GI Enfeksiyon' :
                           key === 'skinInfections' ? 'Cilt Enfeksiyonu' :
                           key === 'sepsis' ? 'Sepsis' :
                           key === 'meningitis' ? 'Menenjit' :
                           key === 'osteomyelitis' ? 'Osteomiyelit' :
                           key === 'fungalInfections' ? 'Mantar Enfeksiyonu' :
                           key === 'parasiteInfections' ? 'Parazit Enfeksiyonu' :
                           key}
                        </Typography>
                        <Typography variant="body1">
                          {typeof value === 'boolean' ? (value ? '✅ Evet' : '❌ Hayır') : 
                           value === null || value === undefined ? '-' : 
                           String(value)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">Veri yok</Typography>
                )}
              </Paper>

              {/* Hastane Yatışları */}
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  🏨 Hastane Yatışları
                </Typography>
                {detailPatient.hospitalizations ? (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    {Object.entries(detailPatient.hospitalizations as Record<string, any>).map(([key, value]) => (
                      <Box key={key}>
                        <Typography variant="caption" color="text.secondary">
                          {key === 'hasHospitalization' ? 'Hastane Yatışı' :
                           key === 'hospitalizationCount' ? 'Yatış Sayısı' :
                           key === 'icuAdmission' ? 'YBÜ Yatışı' :
                           key === 'totalDays' ? 'Toplam Gün' :
                           key}
                        </Typography>
                        <Typography variant="body1">
                          {typeof value === 'boolean' ? (value ? '✅ Evet' : '❌ Hayır') : 
                           value === null || value === undefined ? '-' : 
                           String(value)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">Veri yok</Typography>
                )}
              </Paper>

              {/* Aile Öyküsü */}
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  👨‍👩‍👧‍👦 Aile Öyküsü
                </Typography>
                {detailPatient.familyHistory ? (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    {Object.entries(detailPatient.familyHistory as Record<string, any>).map(([key, value]) => (
                      <Box key={key}>
                        <Typography variant="caption" color="text.secondary">
                          {key === 'piy' ? 'PİY' :
                           key === 'tbc' ? 'TBC' :
                           key === 'heart' ? 'Kalp Hastalığı' :
                           key === 'allergy' ? 'Alerji' :
                           key === 'ieiRelationship' ? 'İEİ Akrabalığı' :
                           key === 'ieiDeathCount' ? 'İEİ Ölüm Sayısı' :
                           key}
                        </Typography>
                        <Typography variant="body1">
                          {typeof value === 'boolean' ? (value ? '✅ Var' : '❌ Yok') : 
                           value === null || value === undefined ? '-' : 
                           String(value)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">Veri yok</Typography>
                )}
              </Paper>

              {/* Tanı ve Risk */}
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  🎯 Tanı ve Risk Değerlendirmesi
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                  {detailEditMode ? (
                    <>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={detailPatient.hasImmuneDeficiency}
                            onChange={(e) => setDetailPatient({ ...detailPatient, hasImmuneDeficiency: e.target.checked })}
                          />
                        }
                        label="İmmün Yetmezlik Var"
                      />
                      <TextField
                        label="Tanı Tipi"
                        value={detailPatient.diagnosisType || ''}
                        onChange={(e) => setDetailPatient({ ...detailPatient, diagnosisType: e.target.value })}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        label="Risk Seviyesi"
                        value={detailPatient.finalRiskLevel || ''}
                        onChange={(e) => setDetailPatient({ ...detailPatient, finalRiskLevel: e.target.value })}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        label="Kural Tabanlı Puan"
                        type="number"
                        value={detailPatient.ruleBasedScore || ''}
                        onChange={(e) => setDetailPatient({ ...detailPatient, ruleBasedScore: e.target.value ? parseInt(e.target.value) : null })}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        label="Kaynak Dosya"
                        value={detailPatient.sourceFile || ''}
                        onChange={(e) => setDetailPatient({ ...detailPatient, sourceFile: e.target.value })}
                        size="small"
                        fullWidth
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Kayıt ID: #{detailPatient.id}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box>
                        <Typography variant="caption" color="text.secondary">İmmün Yetmezlik</Typography>
                        <Chip 
                          label={detailPatient.hasImmuneDeficiency ? 'VAR' : 'YOK'} 
                          size="small" 
                          color={detailPatient.hasImmuneDeficiency ? 'error' : 'success'}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Tanı Tipi</Typography>
                        <Typography variant="body1">{detailPatient.diagnosisType || '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Risk Seviyesi</Typography>
                        <Chip 
                          label={detailPatient.finalRiskLevel || '-'} 
                          size="small" 
                          color={detailPatient.finalRiskLevel === '3' ? 'error' : detailPatient.finalRiskLevel === '2' ? 'warning' : 'default'}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Kural Tabanlı Puan</Typography>
                        <Typography variant="body1" fontWeight="bold">{detailPatient.ruleBasedScore || '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Kaynak Dosya</Typography>
                        <Typography variant="body2">{detailPatient.sourceFile || 'ANA TABLO.xlsx'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Kayıt ID</Typography>
                        <Typography variant="body2">#{detailPatient.id}</Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Paper>

              {/* Notlar */}
              {detailPatient.notes && (
                <Paper sx={{ p: 2, bgcolor: 'info.lighter' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                    📝 Notlar
                  </Typography>
                  <Typography variant="body2">{detailPatient.notes}</Typography>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {detailEditMode ? (
            <>
              <Button onClick={handleCancelDetailEdit} color="inherit">
                İptal
              </Button>
              <Button onClick={handleSaveDetailChanges} variant="contained" color="success">
                Kaydet
              </Button>
            </>
          ) : (
            <Button onClick={() => setDetailDialogOpen(false)} variant="contained">
              Kapat
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Eğitim Datasını Düzenle</DialogTitle>
        <DialogContent>
          {editingPatient && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Dosya No"
                value={editingPatient.patientCode}
                onChange={(e) => setEditingPatient({ ...editingPatient, patientCode: e.target.value })}
                fullWidth
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <TextField
                  label="Yaş (Ay)"
                  type="number"
                  value={editingPatient.ageMonths}
                  onChange={(e) => setEditingPatient({ ...editingPatient, ageMonths: parseInt(e.target.value) })}
                />
                <FormControl fullWidth>
                  <InputLabel>Cinsiyet</InputLabel>
                  <Select
                    value={editingPatient.gender}
                    label="Cinsiyet"
                    onChange={(e) => setEditingPatient({ ...editingPatient, gender: e.target.value })}
                  >
                    <MenuItem value="Erkek">Erkek</MenuItem>
                    <MenuItem value="Kadın">Kadın</MenuItem>
                    <MenuItem value="Bilinmiyor">Bilinmiyor</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <TextField
                  label="Doğum Kilosu (gram)"
                  type="number"
                  value={editingPatient.birthWeight || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, birthWeight: e.target.value ? parseFloat(e.target.value) : null })}
                />
                <TextField
                  label="Gestasyon (hafta)"
                  type="number"
                  value={editingPatient.gestationalAge || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, gestationalAge: e.target.value ? parseInt(e.target.value) : null })}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <TextField
                  label="Doğum Şekli"
                  value={editingPatient.birthType || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, birthType: e.target.value })}
                />
                <TextField
                  label="Anne Sütü (ay)"
                  type="number"
                  value={editingPatient.breastfeedingMonths || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, breastfeedingMonths: e.target.value ? parseInt(e.target.value) : null })}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <TextField
                  label="Göbek Düşme (gün)"
                  type="number"
                  value={editingPatient.cordFallDay || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, cordFallDay: e.target.value ? parseInt(e.target.value) : null })}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editingPatient.parentalConsanguinity}
                      onChange={(e) => setEditingPatient({ ...editingPatient, parentalConsanguinity: e.target.checked })}
                    />
                  }
                  label="Akrabalık Var"
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <TextField
                  label="Tanı"
                  value={editingPatient.diagnosisType || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, diagnosisType: e.target.value })}
                />
                <TextField
                  label="Risk Seviyesi"
                  value={editingPatient.finalRiskLevel || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, finalRiskLevel: e.target.value })}
                />
              </Box>
              <TextField
                label="Puan"
                type="number"
                value={editingPatient.ruleBasedScore || ''}
                onChange={(e) => setEditingPatient({ ...editingPatient, ruleBasedScore: e.target.value ? parseInt(e.target.value) : null })}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>İptal</Button>
          <Button onClick={handleUpdatePatient} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

