'use client';

import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box, 
  Chip,
  Badge,
  Paper,
  Stack
} from '@mui/material';
import { 
  People, 
  PersonAdd, 
  Psychology, 
  Shield,
  LocalHospital,
  List,
  Settings,
  Info,
  PieChart
} from '@mui/icons-material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  patientCount: number;
  diagnosedCount: number;
  modelExists: boolean;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    patientCount: 0,
    diagnosedCount: 0,
    modelExists: false
  });

  useEffect(() => {
    // API'den istatistikleri çek
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Ana başlık kartı */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Shield sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1" color="primary">
              İmmün Yetmezlik Risk Değerlendirme Sistemi
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Bu sistem, çocuk hastalarda primer immün yetmezlik riski taşıyan hastaları erken dönemde tespit etmek, 
            takip etmek ve uygun değerlendirmelere yönlendirmek için tasarlanmıştır.
          </Typography>
        </CardContent>
      </Card>

      {/* İstatistik kartları */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Card sx={{ textAlign: 'center', boxShadow: 3, height: '100%' }}>
            <CardContent>
              <People sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" component="h3">
                {stats.patientCount}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Toplam Hasta
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<List />}
                component={Link}
                href="/patients"
                fullWidth
              >
                Hasta Listesi
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card sx={{ textAlign: 'center', boxShadow: 3, height: '100%' }}>
            <CardContent>
              <LocalHospital sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h3" component="h3">
                {stats.diagnosedCount}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Tanı Konulmuş Hasta
              </Typography>
              <Button 
                variant="contained" 
                color="success"
                startIcon={<PersonAdd />}
                component={Link}
                href="/patients/register"
                fullWidth
              >
                Yeni Hasta Ekle
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card sx={{ textAlign: 'center', boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Psychology sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
              <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                Model Durumu
              </Typography>
              <Box sx={{ mb: 2 }}>
                {stats.modelExists ? (
                  <Chip label="Aktif" color="success" />
                ) : (
                  <Chip label="Eğitilmemiş" color="warning" />
                )}
              </Box>
              <Button 
                variant="contained" 
                color="info"
                startIcon={<Settings />}
                component={Link}
                href="/model-info"
                fullWidth
              >
                Model Detayları
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Alt bilgi kartları */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card sx={{ boxShadow: 3, height: '100%' }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <Info sx={{ mr: 1 }} />
                Sistem Hakkında
              </Typography>
            </Box>
            <CardContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Bu risk değerlendirme sistemi iki temel bileşenden oluşur:
              </Typography>
              <Box component="ol" sx={{ pl: 2 }}>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>Kural Tabanlı Risk Değerlendirme:</strong> 
                  Uluslararası kılavuzlara ve uzman görüşlerine dayalı olarak geliştirilen 
                  klinik skorlama sistemi.
                </Typography>
                <Typography component="li" sx={{ mb: 2 }}>
                  <strong>Makine Öğrenmesi Modeli:</strong> 
                  Sistemdeki tanı konulmuş hastalara dayanarak oluşturulan ve sürekli 
                  kendini geliştiren tahmin modeli.
                </Typography>
              </Box>
              <Typography variant="body1">
                Her iki yöntem birleştirilerek, daha doğru ve güvenilir risk tahminleri elde edilir.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card sx={{ boxShadow: 3, height: '100%' }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <PieChart sx={{ mr: 1 }} />
                Risk Kategorileri
              </Typography>
            </Box>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 30, 
                    bgcolor: 'success.light', 
                    mr: 2,
                    borderRadius: 1
                  }} 
                />
                <Typography variant="body1">
                  <strong>Düşük Risk</strong> - Rutin takip önerilir
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 30, 
                    bgcolor: 'warning.light', 
                    mr: 2,
                    borderRadius: 1
                  }} 
                />
                <Typography variant="body1">
                  <strong>Orta Risk</strong> - Takip ve ek testler önerilir
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 30, 
                    bgcolor: 'error.light', 
                    mr: 2,
                    borderRadius: 1
                  }} 
                />
                <Typography variant="body1">
                  <strong>Yüksek Risk</strong> - Detaylı klinik değerlendirme gerekli
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 30, 
                    bgcolor: 'error.dark', 
                    mr: 2,
                    borderRadius: 1
                  }} 
                />
                <Typography variant="body1">
                  <strong>Çok Yüksek Risk</strong> - Acil uzman değerlendirmesi gerekiyor
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
