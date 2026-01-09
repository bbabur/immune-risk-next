'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
  Box,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Male,
  Female,
  Update,
  Add,
  Assessment,
  FamilyRestroom,
  LocalHospital,
  Coronavirus,
  Science,
  Medication,
  Vaccines,
  Timeline,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  Brightness3,
  Psychology
} from '@mui/icons-material';
import ClinicalFeatureModal from '../../../components/ClinicalFeatureModal';

interface Patient {
  id: number;
  file_number?: string;
  fileNumber?: string;
  firstName?: string;
  lastName?: string;
  birth_date?: string;
  birthDate?: string;
  age_years?: number;
  ageYears?: number;
  age_months?: number;
  ageMonths?: number;
  gender: string;
  height?: number;
  weight?: number;
  ethnicity?: string;
  parental_consanguinity?: string;
  parentalConsanguinity?: string;
  birth_weight?: number;
  birthWeight?: number;
  gestational_age?: number;
  gestationalAge?: number;
  cord_fall_day?: number;
  cordFallDay?: number;
  has_immune_deficiency?: boolean;
  hasImmuneDeficiency?: boolean;
  diagnosis_type?: string;
  diagnosisType?: string;
  diagnosis_date?: string;
  diagnosisDate?: string;
  rule_based_score?: number;
  ruleBasedScore?: number;
  ml_score?: number;
  mlScore?: number;
  final_risk_level?: string;
  finalRiskLevel?: string;
  clinicalFeatures?: ClinicalFeature[];
  familyHistory?: FamilyHistory[];
  hospitalizations?: Hospitalization[];
  infections?: Infection[];
  labResults?: LabResult[];
  treatments?: Treatment[];
  vaccinations?: Vaccination[];
  riskAssessments?: RiskAssessment[];
}

interface ClinicalFeature {
  id: number;
  dateRecorded: string;
  growthFailure: boolean;
  heightPercentile?: number;
  weightPercentile?: number;
  chronicSkinIssue: boolean;
  skinIssueType?: string;
  skinIssueDuration?: number;
  chronicDiarrhea: boolean;
  diarrheaDuration?: number;
  bcgLymphadenopathy: boolean;
  persistentThrush: boolean;
  deepAbscesses: boolean;
  abscessLocation?: string;
  chd: boolean;
  chdType?: string;
}

interface FamilyHistory {
  id: number;
  familyIeiHistory: boolean;
  ieiRelationship?: string;
  ieiType?: string;
  familyEarlyDeath: boolean;
  earlyDeathAge?: number;
  earlyDeathCause?: string;
  earlyDeathRelationship?: string;
  otherConditions?: string;
}

interface Hospitalization {
  id: number;
  admissionDate: string;
  dischargeDate?: string;
  reason: string;
  diagnosis?: string;
  icuAdmission: boolean;
  icuDays?: number;
  ivAntibioticRequirement: boolean;
  antibioticsUsed?: string;
  notes?: string;
}

interface Infection {
  id: number;
  date?: string;
  type: string;
  severity?: string;
  treatment?: string;
  antibioticUsed?: string;
  antibioticFailure: boolean;
  hospitalizationRequired: boolean;
}

interface LabResult {
  id: number;
  date: string;
  testName: string;
  testValue?: number;
  testUnit?: string;
  referenceMin?: number;
  referenceMax?: number;
  isAbnormal?: boolean;
  labName?: string;
  notes?: string;
}

interface Treatment {
  id: number;
  startDate: string;
  endDate?: string;
  ongoing: boolean;
  treatmentType: string;
  medication?: string;
  dose?: string;
  frequency?: string;
  response?: string;
  sideEffects?: string;
  notes?: string;
}

interface Vaccination {
  id: number;
  date: string;
  vaccineName: string;
  doseNumber?: number;
  reaction?: string;
  antibodyTested: boolean;
  antibodyResult?: number;
}

interface RiskAssessment {
  id: number;
  assessmentDate: string;
  assessedBy?: string;
  primaryScore?: number;
  secondaryScore?: number;
  totalScore?: number;
  riskLevel?: string;
  recommendation?: string;
  modelVersion?: string;
  modelConfidence?: number;
}

// Klinik Özellikler Tablosu
function ClinicalFeaturesTable({ clinicalFeatures }: { clinicalFeatures: ClinicalFeature[] }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tarih</TableCell>
            <TableCell>Büyüme Geriliği</TableCell>
            <TableCell>Cilt Problemi</TableCell>
            <TableCell>Kronik İshal</TableCell>
            <TableCell>BCG Lenfadenopati</TableCell>
            <TableCell>Pamukçuk</TableCell>
            <TableCell>Derin Apse</TableCell>
            <TableCell>Kalp Hastalığı</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clinicalFeatures.map((feature) => (
            <TableRow key={feature.id} hover>
              <TableCell>
                {new Date(feature.dateRecorded).toLocaleDateString('tr-TR')}
              </TableCell>
              <TableCell>
                {feature.growthFailure ? (
                  <Tooltip title={`Boy: ${feature.heightPercentile}%, Kilo: ${feature.weightPercentile}%`}>
                    <Chip label="Var" color="error" size="small" />
                  </Tooltip>
                ) : (
                  <Chip label="Yok" color="success" size="small" />
                )}
              </TableCell>
              <TableCell>
                {feature.chronicSkinIssue ? (
                  <Tooltip title={`${feature.skinIssueType} (${feature.skinIssueDuration} ay)`}>
                    <Chip label="Var" color="error" size="small" />
                  </Tooltip>
                ) : (
                  <Chip label="Yok" color="success" size="small" />
                )}
              </TableCell>
              <TableCell>
                {feature.chronicDiarrhea ? (
                  <Tooltip title={`${feature.diarrheaDuration} ay`}>
                    <Chip label="Var" color="error" size="small" />
                  </Tooltip>
                ) : (
                  <Chip label="Yok" color="success" size="small" />
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={feature.bcgLymphadenopathy ? "Var" : "Yok"}
                  color={feature.bcgLymphadenopathy ? "error" : "success"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={feature.persistentThrush ? "Var" : "Yok"}
                  color={feature.persistentThrush ? "error" : "success"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {feature.deepAbscesses ? (
                  <Tooltip title={feature.abscessLocation}>
                    <Chip label="Var" color="error" size="small" />
                  </Tooltip>
                ) : (
                  <Chip label="Yok" color="success" size="small" />
                )}
              </TableCell>
              <TableCell>
                {feature.chd ? (
                  <Tooltip title={feature.chdType}>
                    <Chip label="Var" color="error" size="small" />
                  </Tooltip>
                ) : (
                  <Chip label="Yok" color="success" size="small" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// KVKK uyumlu isim maskeleme
function maskName(firstName: string, lastName: string): string {
  if (!firstName) return '***';
  const nameParts = firstName.split(' ');
  const maskedParts = nameParts.map(part => {
    if (part.length <= 2) return part;
    return part[0] + '*'.repeat(part.length - 1);
  });
  return maskedParts.join(' ');
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [clinicalFeatureModalOpen, setClinicalFeatureModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patients/${params.id}`);
        if (!response.ok) {
          throw new Error('Patient not found');
        }
        const data = await response.json();
        setPatient(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPatient();
    }
  }, [params.id]);

  // Yaş gösterimi - API'den gelen age_years ve age_months kullan, yoksa birthDate'den hesapla
  const formatAge = (patient: Patient) => {
    let years = patient.age_years || patient.ageYears;
    let months = patient.age_months || patient.ageMonths;
    
    // Eğer yaş bilgisi yoksa ve birthDate varsa, hesapla
    if ((years === null || years === undefined) && patient.birth_date) {
      const birthDate = new Date(patient.birth_date);
      const today = new Date();
      const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                          (today.getMonth() - birthDate.getMonth());
      years = Math.floor(ageInMonths / 12);
      months = ageInMonths % 12;
    }
    
    // Varsayılan değerler
    years = years || 0;
    months = months || 0;
    
    if (years === 0 && months === 0) return '0 ay';
    if (years === 0) return `${months} ay`;
    if (months === 0) return `${years} yıl`;
    return `${years} yıl ${months} ay`;
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'erkek' || gender === 'male' ? <Male color="primary" /> : <Female color="secondary" />;
  };

  const getGenderText = (gender: string) => {
    return gender === 'erkek' || gender === 'male' ? 'Erkek' : 'Kadın';
  };

  const getDiagnosisChip = (hasImmuneDeficiency?: boolean) => {
    if (hasImmuneDeficiency === true) {
      return <Chip label="Pozitif" color="error" size="small" />;
    } else if (hasImmuneDeficiency === false) {
      return <Chip label="Negatif" color="success" size="small" />;
    }
    return <Chip label="Bilinmiyor" color="default" size="small" />;
  };

  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClinicalFeatureModalClose = () => {
    setClinicalFeatureModalOpen(false);
  };

  const handleClinicalFeatureModalOpen = () => {
    setClinicalFeatureModalOpen(true);
  };

  const refreshPatientData = async () => {
    try {
      const response = await fetch(`/api/patients/${params.id}`);
      if (!response.ok) {
        throw new Error('Patient not found');
      }
      const data = await response.json();
      setPatient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Hasta bilgileri yükleniyor...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Hasta bulunamadı.
        </Alert>
      </Container>
    );
  }

  const renderTabContent = () => {
    if (!patient) return null;

    switch (tabValue) {
      case 0: // Genel Bilgiler
        return (
          <Box>
            {/* Ana İçerik - 3 Sütunlu Layout */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
              
              {/* Sol Sütun - Demografik Bilgiler */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ bgcolor: 'primary.main', color: 'white', height: 'fit-content' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Demografik Bilgiler
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Update />}
                        onClick={() => router.push(`/patients/${patient.id}/update-info`)}
                        sx={{ 
                          color: 'white', 
                          borderColor: 'white',
                          '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                      >
                        Güncelle
                      </Button>
                    </Box>
                    <Divider sx={{ bgcolor: 'white', opacity: 0.3, mb: 2 }} />
                    
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight="bold">Dosya No:</Typography>
                        <Chip label={patient.file_number || patient.fileNumber || `#${patient.id}`} size="small" sx={{ bgcolor: 'white', color: 'primary.main' }} />
                      </Box>
                      
                      <Box>
                        <Typography fontWeight="bold">Yaş:</Typography>
                        <Typography>{formatAge(patient)}</Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight="bold">Cinsiyet:</Typography>
                        {getGenderIcon(patient.gender)}
                        <Typography>{getGenderText(patient.gender)}</Typography>
                      </Box>
                      
                      <Box>
                        <Typography fontWeight="bold">Boy:</Typography>
                        <Typography>{patient.height || 0} cm</Typography>
                      </Box>
                      
                      <Box>
                        <Typography fontWeight="bold">Kilo:</Typography>
                        <Typography>{patient.weight || 0} kg</Typography>
                      </Box>
                      
                      <Box>
                        <Typography fontWeight="bold">Etnik Köken:</Typography>
                        <Typography>{patient.ethnicity || 'Belirtilmemiş'}</Typography>
                      </Box>
                      
                      <Box>
                        <Typography fontWeight="bold">Ebeveyn Akrabalığı:</Typography>
                        <Typography>{(patient.parental_consanguinity && patient.parental_consanguinity !== '0') || patient.parentalConsanguinity ? '✓ Var' : '✗ Yok'}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>

              {/* Orta Sütun - Doğum Bilgileri */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ height: 'fit-content' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Doğum Bilgileri
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Stack spacing={2}>
                      <Box>
                        <Typography fontWeight="bold">Doğum Ağırlığı:</Typography>
                        <Typography>{patient.birth_weight || patient.birthWeight || '-'} g</Typography>
                      </Box>
                      
                      <Box>
                        <Typography fontWeight="bold">Gebelik Haftası:</Typography>
                        <Typography>{patient.gestational_age || patient.gestationalAge || '-'} hafta</Typography>
                      </Box>
                      
                      <Box>
                        <Typography fontWeight="bold">Göbek Kordonu Düşme Günü:</Typography>
                        <Typography>{patient.cord_fall_day || patient.cordFallDay || '-'} gün</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>

              {/* Sağ Sütun - Tanı Bilgileri */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ 
                  height: 'fit-content',
                  bgcolor: (patient.hasImmuneDeficiency ?? patient.has_immune_deficiency) === true 
                    ? 'error.50' 
                    : (patient.hasImmuneDeficiency ?? patient.has_immune_deficiency) === false 
                      ? 'success.50' 
                      : 'background.paper'
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      🔬 Tanı Bilgileri
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Stack spacing={2}>
                      <Box>
                        <Typography fontWeight="bold">İmmün Yetmezlik Riski:</Typography>
                        {getDiagnosisChip(patient.hasImmuneDeficiency ?? patient.has_immune_deficiency)}
                      </Box>
                      
                      <Box>
                        <Typography fontWeight="bold">Tanı/Değerlendirme:</Typography>
                        <Typography sx={{ 
                          color: (patient.diagnosisType || patient.diagnosis_type) ? 'text.primary' : 'text.secondary',
                          fontStyle: (patient.diagnosisType || patient.diagnosis_type) ? 'normal' : 'italic'
                        }}>
                          {patient.diagnosisType || patient.diagnosis_type || 'Henüz ML değerlendirmesi yapılmadı'}
                        </Typography>
                      </Box>
                      
                      {(patient.diagnosisDate || patient.diagnosis_date) && (
                        <Box>
                          <Typography fontWeight="bold">Değerlendirme Tarihi:</Typography>
                          <Typography>{patient.diagnosisDate || patient.diagnosis_date}</Typography>
                        </Box>
                      )}

                      {/* ML Skor gösterimi */}
                      {(patient.mlScore !== undefined || patient.ml_score !== undefined) && (
                        <Box>
                          <Typography fontWeight="bold">ML Skoru:</Typography>
                          <Typography>
                            %{(((patient.mlScore ?? patient.ml_score) || 0) * 100).toFixed(1)} olasılık
                          </Typography>
                        </Box>
                      )}

                      {/* Risk Seviyesi */}
                      {(patient.finalRiskLevel || patient.final_risk_level) && (
                        <Box>
                          <Typography fontWeight="bold">Risk Seviyesi:</Typography>
                          <Chip 
                            label={patient.finalRiskLevel || patient.final_risk_level} 
                            color={
                              (patient.finalRiskLevel || patient.final_risk_level)?.includes('Yüksek') ? 'error' :
                              (patient.finalRiskLevel || patient.final_risk_level)?.includes('Orta') ? 'warning' : 'success'
                            }
                            size="small"
                          />
                        </Box>
                      )}
                      
                      {/* ML değerlendirmesi yapılmışsa sadece Görüntüle, yapılmamışsa Değerlendir */}
                      <Box sx={{ mt: 2 }}>
                        {(patient.diagnosisType || patient.diagnosis_type) ? (
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={<Assessment />}
                            fullWidth
                            onClick={() => router.push(`/patients/${patient.id}/ml-result`)}
                          >
                            ML Sonucunu Görüntüle
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<Psychology />}
                            fullWidth
                            onClick={() => router.push(`/patients/${patient.id}/ml-assessment`)}
                          >
                            ML Değerlendirmesi Yap
                          </Button>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Box>


          </Box>
        );

      case 1: // Klinik Özellikler
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  💖 Klinik Özellikler
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  color="primary"
                  onClick={handleClinicalFeatureModalOpen}
                >
                  Klinik Özellik Ekle
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {patient.clinicalFeatures && patient.clinicalFeatures.length > 0 ? (
                <ClinicalFeaturesTable clinicalFeatures={patient.clinicalFeatures} />
              ) : (
                <Alert severity="info">
                  Henüz klinik özellik kaydı bulunmamaktadır. Yeni özellik eklemek için "Klinik Özellik Ekle" butonunu kullanın.
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 2: // Aile Öyküsü
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  👨‍👩‍👧‍👦 Aile Öyküsü
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  color="primary"
                  onClick={() => router.push(`/patients/${params.id}/add-family`)}
                >
                  Aile Öyküsü Ekle
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {patient.familyHistory && patient.familyHistory.length > 0 ? (
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>İmmün Yetmezlik Öyküsü</TableCell>
                        <TableCell>İlişki ve Türü</TableCell>
                        <TableCell>Erken Ölüm</TableCell>
                        <TableCell>Ölüm Detayları</TableCell>
                        <TableCell>Diğer Durumlar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patient.familyHistory.map((fh) => (
                        <TableRow key={fh.id} hover>
                          <TableCell>
                            {fh.familyIeiHistory ? 
                              <Chip label="Var" color="error" size="small" /> : 
                              <Chip label="Yok" color="success" size="small" />
                            }
                          </TableCell>
                          <TableCell>
                            {fh.familyIeiHistory && fh.ieiRelationship ? (
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {fh.ieiRelationship}
                                </Typography>
                                {fh.ieiType && (
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    {fh.ieiType}
                                  </Typography>
                                )}
                              </Box>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {fh.familyEarlyDeath ? 
                              <Chip label="Var" color="error" size="small" /> : 
                              <Chip label="Yok" color="success" size="small" />
                            }
                          </TableCell>
                          <TableCell>
                            {fh.familyEarlyDeath && (fh.earlyDeathAge || fh.earlyDeathCause || fh.earlyDeathRelationship) ? (
                              <Box>
                                {fh.earlyDeathAge && (
                                  <Typography variant="body2" fontWeight="medium">
                                    {fh.earlyDeathAge} yaşında
                                  </Typography>
                                )}
                                {fh.earlyDeathRelationship && (
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    {fh.earlyDeathRelationship}
                                  </Typography>
                                )}
                                {fh.earlyDeathCause && (
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    Neden: {fh.earlyDeathCause}
                                  </Typography>
                                )}
                              </Box>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ 
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {fh.otherConditions || '-'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Henüz aile öyküsü kaydı bulunmamaktadır.
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 3: // Hastane Yatışları
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  🏥 Hastane Yatışları
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  color="primary"
                  onClick={() => router.push(`/patients/${params.id}/add-hospitalization`)}
                >
                  Hastane Yatışı Ekle
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {patient.hospitalizations && patient.hospitalizations.length > 0 ? (
                <Stack spacing={2}>
                  {patient.hospitalizations.map((hosp) => (
                    <Card key={hosp.id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {hosp.reason}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(hosp.admissionDate).toLocaleDateString('tr-TR')} - {
                                hosp.dischargeDate ? new Date(hosp.dischargeDate).toLocaleDateString('tr-TR') : 'Devam ediyor'
                              }
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {hosp.icuAdmission && <Chip label="YBÜ" color="error" size="small" />}
                            {hosp.ivAntibioticRequirement && <Chip label="IV Antibiyotik" color="warning" size="small" />}
                          </Box>
                        </Box>
                        
                        {hosp.diagnosis && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Tanı:</strong> {hosp.diagnosis}
                          </Typography>
                        )}
                        
                        {hosp.icuAdmission && hosp.icuDays && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>YBÜ Kalış:</strong> {hosp.icuDays} gün
                          </Typography>
                        )}
                        
                        {hosp.antibioticsUsed && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Kullanılan Antibiyotikler:</strong> {hosp.antibioticsUsed}
                          </Typography>
                        )}
                        
                        {hosp.notes && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Notlar:</strong> {hosp.notes}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">
                  Henüz hastane yatışı kaydı bulunmamaktadır.
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 4: // Enfeksiyonlar
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  🦠 Enfeksiyonlar
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  color="primary"
                  onClick={() => router.push(`/patients/${params.id}/add-infection`)}
                >
                  Enfeksiyon Ekle
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {patient.infections && patient.infections.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tarih</TableCell>
                        <TableCell>Enfeksiyon Türü</TableCell>
                        <TableCell>Şiddet</TableCell>
                        <TableCell>Tedavi</TableCell>
                        <TableCell>Antibiyotik</TableCell>
                        <TableCell>Durum</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patient.infections.map((inf) => (
                        <TableRow key={inf.id}>
                          <TableCell>
                            {inf.date ? new Date(inf.date).toLocaleDateString('tr-TR') : '-'}
                          </TableCell>
                          <TableCell>{inf.type}</TableCell>
                          <TableCell>
                            {inf.severity && (
                              <Chip 
                                label={inf.severity} 
                                color={inf.severity === 'Ağır' ? 'error' : inf.severity === 'Orta' ? 'warning' : 'success'} 
                                size="small" 
                              />
                            )}
                          </TableCell>
                          <TableCell>{inf.treatment || '-'}</TableCell>
                          <TableCell>{inf.antibioticUsed || '-'}</TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              {inf.antibioticFailure && <Chip label="Antibiyotik Başarısızlığı" color="error" size="small" />}
                              {inf.hospitalizationRequired && <Chip label="Hastane Yatışı Gerekti" color="warning" size="small" />}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  Henüz enfeksiyon kaydı bulunmamaktadır.
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 5: // Laboratuvar Sonuçları
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  🧪 Laboratuvar Sonuçları
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  color="primary"
                  onClick={() => router.push(`/patients/${params.id}/add-lab`)}
                >
                  Laboratuvar Sonucu Ekle
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {patient.labResults && patient.labResults.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tarih</TableCell>
                        <TableCell>Test Adı</TableCell>
                        <TableCell>Sonuç</TableCell>
                        <TableCell>Referans Aralığı</TableCell>
                        <TableCell>Durum</TableCell>
                        <TableCell>Laboratuvar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patient.labResults.map((lab) => (
                        <TableRow key={lab.id}>
                          <TableCell>{new Date(lab.date).toLocaleDateString('tr-TR')}</TableCell>
                          <TableCell>{lab.testName}</TableCell>
                          <TableCell>
                            {lab.testValue ? `${lab.testValue} ${lab.testUnit || ''}` : '-'}
                          </TableCell>
                          <TableCell>
                            {lab.referenceMin && lab.referenceMax ? 
                              `${lab.referenceMin} - ${lab.referenceMax} ${lab.testUnit || ''}` : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {lab.isAbnormal !== null && (
                              <Chip 
                                label={lab.isAbnormal ? 'Anormal' : 'Normal'} 
                                color={lab.isAbnormal ? 'error' : 'success'} 
                                size="small" 
                              />
                            )}
                          </TableCell>
                          <TableCell>{lab.labName || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  Henüz laboratuvar sonucu kaydı bulunmamaktadır.
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 6: // Tedaviler
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  💊 Tedaviler
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  color="primary"
                  onClick={() => router.push(`/patients/${params.id}/add-treatment`)}
                >
                  Tedavi Ekle
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {patient.treatments && patient.treatments.length > 0 ? (
                <Stack spacing={2}>
                  {patient.treatments.map((treatment) => (
                    <Card key={treatment.id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {treatment.treatmentType}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(treatment.startDate).toLocaleDateString('tr-TR')} - {
                                treatment.endDate ? new Date(treatment.endDate).toLocaleDateString('tr-TR') : 
                                treatment.ongoing ? 'Devam ediyor' : 'Bitiş tarihi yok'
                              }
                            </Typography>
                          </Box>
                          {treatment.ongoing && <Chip label="Aktif" color="success" size="small" />}
                        </Box>
                        
                        {treatment.medication && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>İlaç:</strong> {treatment.medication}
                          </Typography>
                        )}
                        
                        {treatment.dose && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Doz:</strong> {treatment.dose}
                          </Typography>
                        )}
                        
                        {treatment.frequency && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Sıklık:</strong> {treatment.frequency}
                          </Typography>
                        )}
                        
                        {treatment.response && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Yanıt:</strong> {treatment.response}
                          </Typography>
                        )}
                        
                        {treatment.sideEffects && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Yan Etkiler:</strong> {treatment.sideEffects}
                          </Typography>
                        )}
                        
                        {treatment.notes && (
                          <Typography variant="body2">
                            <strong>Notlar:</strong> {treatment.notes}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">
                  Henüz tedavi kaydı bulunmamaktadır.
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 7: // Aşılar
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  💉 Aşılar
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  color="primary"
                  onClick={() => router.push(`/patients/${params.id}/add-vaccination`)}
                >
                  Aşı Ekle
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {patient.vaccinations && patient.vaccinations.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tarih</TableCell>
                        <TableCell>Aşı Adı</TableCell>
                        <TableCell>Doz</TableCell>
                        <TableCell>Reaksiyon</TableCell>
                        <TableCell>Antikor Testi</TableCell>
                        <TableCell>Antikor Sonucu</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patient.vaccinations.map((vac) => (
                        <TableRow key={vac.id}>
                          <TableCell>{new Date(vac.date).toLocaleDateString('tr-TR')}</TableCell>
                          <TableCell>{vac.vaccineName}</TableCell>
                          <TableCell>{vac.doseNumber ? `${vac.doseNumber}. doz` : '-'}</TableCell>
                          <TableCell>{vac.reaction || 'Reaksiyon yok'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={vac.antibodyTested ? 'Evet' : 'Hayır'} 
                              color={vac.antibodyTested ? 'success' : 'default'} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            {vac.antibodyTested && vac.antibodyResult ? vac.antibodyResult : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  Henüz aşı kaydı bulunmamaktadır.
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Başlık */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => router.back()}>
          Geri
        </Button>
        <Typography variant="h4" fontWeight="bold">
          {maskName(patient.firstName || '', patient.lastName || '')}
        </Typography>
        <Chip label={patient.file_number || patient.fileNumber || `#${patient.id}`} size="small" color="primary" />
      </Box>

      {/* Tab Navigation */}
      <Card sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable" 
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<Assessment />} 
            label="Genel Bilgiler" 
            iconPosition="start"
          />
          <Tab 
            icon={<Timeline />} 
            label="Klinik Özellikler" 
            iconPosition="start"
          />
          <Tab 
            icon={<FamilyRestroom />} 
            label="Aile Öyküsü" 
            iconPosition="start"
          />
          <Tab 
            icon={<LocalHospital />} 
            label="Hastane Yatışları" 
            iconPosition="start"
          />
          <Tab 
            icon={<Coronavirus />} 
            label="Enfeksiyonlar" 
            iconPosition="start"
          />
          <Tab 
            icon={<Science />} 
            label="Laboratuvar Sonuçları" 
            iconPosition="start"
          />
          <Tab 
            icon={<Medication />} 
            label="Tedaviler" 
            iconPosition="start"
          />
          <Tab 
            icon={<Vaccines />} 
            label="Aşılar" 
            iconPosition="start"
          />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Clinical Feature Modal */}
      <ClinicalFeatureModal
        open={clinicalFeatureModalOpen}
        onClose={handleClinicalFeatureModalClose}
        patientId={patient?.id || 0}
        onSuccess={refreshPatientData}
      />
    </Container>
  );
} 