'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
  AlertTitle,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Upload,
  CheckCircle,
  Error,
  Info,
  ArrowBack
} from '@mui/icons-material';
import Link from 'next/link';

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      let patients: any[] = [];

      // Excel veya CSV dosyasını oku
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Excel dosyası
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Excel'i JSON'a çevir
        patients = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false,
          defval: ''
        });
        
        console.log('Excel parsed:', {
          sheetName,
          totalRows: patients.length,
          columns: patients.length > 0 ? Object.keys(patients[0]) : [],
          firstRow: patients[0]
        });
      } else {
        // CSV dosyası
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const patient: any = {};
            
            headers.forEach((header, index) => {
              if (values[index] !== undefined) {
                patient[header] = values[index];
              }
            });
            
            patients.push(patient);
          }
        }
      }

      if (patients.length === 0) {
        throw new Error('Dosyada veri bulunamadı');
      }

      console.log(`${patients.length} hasta verisi işlenecek`);

      // API'ye gönder
      const response = await fetch('/api/patients/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patients }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Import işlemi başarısız');
      }

      setResult(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      console.error('Import error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        component={Link}
        href="/patients"
        startIcon={<ArrowBack />}
        sx={{ mb: 2 }}
      >
        Hasta Listesine Dön
      </Button>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Upload />
          Excel Hasta Verisi İçe Aktarma
        </Typography>

        <Card sx={{ mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info />
              Önemli Bilgiler
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Excel (.xlsx, .xls) veya CSV dosyası yükleyebilirsiniz
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • İlk satır başlık bilgilerini içermelidir
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Beklenen başlıklar: sıra, dosya no, ad, cins, yaş-ay, doğum şekli, doğum kilo, vb.
            </Typography>
            <Typography variant="body2">
              • 300 kayıt import işlemi birkaç dakika sürebilir
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 3 }}>
          <input
            accept=".csv,.xlsx,.xls"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<Upload />}
              size="large"
              fullWidth
              sx={{ mb: 2, py: 2 }}
            >
              Excel/CSV Dosyası Seç
            </Button>
          </label>

          {file && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>Seçilen Dosya</AlertTitle>
              {file.name} ({Math.round(file.size / 1024)} KB)
            </Alert>
          )}
        </Box>

        {file && !loading && !result && (
          <Button
            variant="contained"
            onClick={handleImport}
            size="large"
            fullWidth
            sx={{ mb: 3 }}
          >
            İçe Aktarmayı Başlat
          </Button>
        )}

        {loading && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Hasta verileri işleniyor...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Hata</AlertTitle>
            {error}
          </Alert>
        )}

        {result && (
          <Box sx={{ mb: 3 }}>
            <Alert 
              severity={result.failed === 0 ? "success" : "warning"} 
              sx={{ mb: 2 }}
            >
              <AlertTitle>İçe Aktarma Tamamlandı</AlertTitle>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Chip 
                  icon={<CheckCircle />} 
                  label={`${result.success} Başarılı`} 
                  color="success" 
                  size="small"
                />
                {result.failed > 0 && (
                  <Chip 
                    icon={<Error />} 
                    label={`${result.failed} Başarısız`} 
                    color="error" 
                    size="small"
                  />
                )}
              </Box>
            </Alert>

            {result.errors.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Hatalar ({result.errors.length})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    {result.errors.slice(0, 10).map((error, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={error} />
                      </ListItem>
                    ))}
                    {result.errors.length > 10 && (
                      <ListItem>
                        <ListItemText 
                          primary={`... ve ${result.errors.length - 10} hata daha`}
                          sx={{ fontStyle: 'italic' }}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            )}

            <Box sx={{ mt: 3 }}>
              <Button
                component={Link}
                href="/patients"
                variant="contained"
                size="large"
              >
                Hasta Listesini Görüntüle
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
} 