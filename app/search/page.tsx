'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
  InputAdornment
} from '@mui/material';
import { Search, Visibility, Assessment, Male, Female } from '@mui/icons-material';
import Link from 'next/link';

interface Patient {
  id: number;
  firstName?: string;
  lastName?: string;
  gender: string;
  finalRiskLevel?: string;
  hasImmuneDeficiency?: boolean;
  diagnosisType?: string;
}

function SearchPageContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchTerm(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.patients || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const getGenderDisplay = (gender: string) => {
    const icon = gender === 'male' ? <Male color="primary" /> : <Female sx={{ color: 'pink' }} />;
    const text = gender === 'male' ? 'Erkek' : 'Kadın';
    return (
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography>{text}</Typography>
      </Box>
    );
  };

  const getRiskLevelChip = (riskLevel?: string) => {
    if (!riskLevel) return <Chip label="Bilinmiyor" color="default" size="small" />;
    
    const colorMap: { [key: string]: "success" | "warning" | "error" } = {
      'low': 'success',
      'medium': 'warning', 
      'high': 'error'
    };
    
    const labelMap: { [key: string]: string } = {
      'low': 'Düşük Risk',
      'medium': 'Orta Risk',
      'high': 'Yüksek Risk'
    };
    
    return (
      <Chip 
        label={labelMap[riskLevel] || riskLevel} 
        color={colorMap[riskLevel] || 'default'} 
        size="small" 
      />
    );
  };

  const getDiagnosisChip = (hasImmuneDeficiency?: boolean, diagnosisType?: string) => {
    if (hasImmuneDeficiency === true) {
      return <Chip label={diagnosisType || "İmmün Yetmezlik"} color="error" size="small" />;
    } else if (hasImmuneDeficiency === false) {
      return <Chip label="Normal İmmün Sistem" color="success" size="small" />;
    }
    return <Chip label="Tanı Yok" color="default" size="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
          <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Search /> Hasta Ara
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {/* Arama Formu */}
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <TextField
                fullWidth
                placeholder="Hasta adı veya soyadı yazın..."
                variant="outlined"
                size="medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                required
              />
              <Button 
                variant="contained" 
                color="primary" 
                type="submit" 
                sx={{ minWidth: 120 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Ara'}
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Hasta adı veya soyadı ile arama yapabilirsiniz. Tam ad da yazabilirsiniz (örn: "Ahmet Yılmaz").
            </Typography>
          </Box>

          {/* Sonuçlar */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && hasSearched && results.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Arama Sonuçları ({results.length} hasta)
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Ad Soyad</strong></TableCell>
                      <TableCell><strong>Cinsiyet</strong></TableCell>
                      <TableCell><strong>Risk Seviyesi</strong></TableCell>
                      <TableCell><strong>Tanı</strong></TableCell>
                      <TableCell><strong>İşlemler</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((patient) => (
                      <TableRow key={patient.id} hover>
                        <TableCell>{patient.id}</TableCell>
                        <TableCell>
                          {`${patient.firstName || ''} ${patient.lastName || ''}`.trim() || (
                            <Typography color="text.secondary" fontStyle="italic">
                              İsimsiz Hasta
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{getGenderDisplay(patient.gender)}</TableCell>
                        <TableCell>{getRiskLevelChip(patient.finalRiskLevel)}</TableCell>
                        <TableCell>{getDiagnosisChip(patient.hasImmuneDeficiency, patient.diagnosisType)}</TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Button
                              component={Link}
                              href={`/patients/${patient.id}`}
                              variant="contained"
                              size="small"
                              startIcon={<Visibility />}
                            >
                              Detay
                            </Button>
                            <Button
                              component={Link}
                              href={`/patients/${patient.id}/assess`}
                              variant="contained"
                              color="warning"
                              size="small"
                              startIcon={<Assessment />}
                            >
                              Değerlendir
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {!loading && hasSearched && results.length === 0 && (
            <Alert severity="info">
              Aramanızla eşleşen hasta bulunamadı.
            </Alert>
          )}
          
          {!hasSearched && (
            <Alert severity="info">
              Hasta aramak için yukarıdaki arama kutusunu kullanın.
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
} 