'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Vaccines,
  List,
  Settings,
  Info,
  PieChart,
  Storage as StorageIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useNotification } from '@/components/NotificationProvider';

interface Stats {
  patientCount: number;
  diagnosedCount: number;
  modelExists: boolean;
  trainingDataCount: number;
}

// Sponsor Reklam Bileşeni
function SponsorAd({ position }: { position: 'left' | 'right' }) {
  const ads = {
    left: [
      {
        title: "Dem İlaç",
        description: "Çalışma Sponsoru",
        image: "/dem-ilac-logo.png",
        link: "https://demilac.com.tr/"
      }
    ],
    right: [
      {
        title: "Dem İlaç",
        description: "Çalışma Sponsoru",
        image: "/dem-ilac-logo.png",
        link: "https://demilac.com.tr/"
      }
    ]
  };

  return (
    <Box sx={{ width: 200, position: 'sticky', top: 20 }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
      Çalışma Sponsoru
      </Typography>
      <Stack spacing={2}>
        {ads[position].map((ad, index) => (
          <Card 
            key={index} 
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3
              }
            }}
            onClick={() => window.open(ad.link, '_blank')}
          >
            <Box
              sx={{
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                bgcolor: 'white'
              }}
            >
              <img
                src={ad.image}
                alt={ad.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>
            <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                {ad.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    patientCount: 0,
    diagnosedCount: 0,
    modelExists: true,
    trainingDataCount: 0
  });

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    setLoading(false);
    
    // Initialize database if needed (first time)
    initializeDatabase();
    
    // API'den istatistikleri çek
    fetchStats();
  }, [router]);

  const initializeDatabase = async () => {
    try {
      const response = await fetch('/api/init', { method: 'POST' });
      const data = await response.json();
      console.log('Database initialization:', data);
    } catch (error) {
      console.error('Init failed:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Gerçek API çağrıları
      const [patientsRes, diagnosedRes, trainingRes] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/patients?diagnosed=true'),
        fetch('/api/training-data')
      ]);
      
      if (patientsRes.ok) {
        const patientsData = await patientsRes.json();
        const totalPatients = Array.isArray(patientsData) ? patientsData.length : 0;
        
        let diagnosedCount = 0;
        if (diagnosedRes.ok) {
          const diagnosedData = await diagnosedRes.json();
          // diagnosed endpoint'i count objesi dönüyor
          diagnosedCount = diagnosedData.count || 0;
        }
        
        const trainingData = trainingRes.ok ? await trainingRes.json() : [];
        const trainingCount = Array.isArray(trainingData) ? trainingData.length : 0;
        
        setStats({
          patientCount: totalPatients,
          diagnosedCount: diagnosedCount,
          modelExists: true,
          trainingDataCount: trainingCount
        });
      } else {
        // Fallback to hardcoded data if API fails
        console.log('API failed, using fallback data');
        setStats({
          patientCount: 0,
          diagnosedCount: 0,
          modelExists: true,
          trainingDataCount: 0
        });
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
      // Fallback to hardcoded data
      setStats({
        patientCount: 0,
        diagnosedCount: 0,
        modelExists: true,
        trainingDataCount: 0
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <Box sx={{ display: 'flex', gap: 3, maxWidth: '1600px', mx: 'auto', p: 3 }}>
      {/* Sol Sponsor Alanı */}
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <SponsorAd position="left" />
      </Box>

      {/* Ana İçerik */}
      <Box sx={{ flex: 1, mx: 2 }}>
        <Container maxWidth={false} sx={{ py: 2 }}>
          {/* Ana başlık kartı */}
          <Card sx={{ mb: 4, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Shield sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="h1" color="primary">
                    Çocuklarda Primer İmmün Yetmezlik Ön Tanısında Yapay Zekanın Kullanımı
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 'bold', mt: 1 }}>
                    Konya Necmettin Erbakan Üniversitesi Tıp Fakültesi
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Bu sistem, çocuk hastalarda primer immün yetmezlik riski taşıyan hastaları erken dönemde tespit etmek, 
                takip etmek ve uygun değerlendirmelere yönlendirmek için tasarlanmıştır.
              </Typography>
              <Box sx={{ 
                backgroundColor: '#f5f5f5', 
                padding: 2, 
                borderRadius: 1,
                border: '1px solid #e0e0e0'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  🏥 Çocuklarda Primer İmmün Yetmezlik Ön Tanısında Yapay Zekanın Kullanımı Araştırma Projesi
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Konya Necmettin Erbakan Üniversitesi Tıp Fakültesi kapsamında yürütülen Çocuklarda Primer İmmün Yetmezlik Ön Tanısında Yapay Zekanın Kullanımı için geliştirilmiştir. Hasta verileri, risk değerlendirmeleri ve klinik takipler bu sistem üzerinden gerçekleştirilmektedir.
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* İstatistik kartları */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
            <Card sx={{ textAlign: 'center', boxShadow: 3 }}>
              <CardContent>
                <People sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" component="h3">
                  {stats.patientCount}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Gerçek Hasta
                </Typography>
                <Button 
                  variant="contained" 
                  size="small"
                  startIcon={<List />}
                  component={Link}
                  href="/patients"
                  fullWidth
                >
                  Listele
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ textAlign: 'center', boxShadow: 3 }}>
              <CardContent>
                <StorageIcon sx={{ fontSize: 50, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h4" component="h3">
                  {stats.trainingDataCount}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Model Eğitim Datası
                </Typography>
                <Button 
                  variant="contained" 
                  size="small"
                  color="secondary"
                  startIcon={<PsychologyIcon />}
                  component={Link}
                  href="/training-data"
                  fullWidth
                >
                  Görüntüle
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ textAlign: 'center', boxShadow: 3 }}>
              <CardContent>
                <Vaccines sx={{ fontSize: 50, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" component="h3">
                  {stats.diagnosedCount}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Tanı Konulmuş
                </Typography>
                <Button 
                  variant="contained" 
                  size="small"
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

            <Card sx={{ textAlign: 'center', boxShadow: 3 }}>
              <CardContent>
                <Psychology sx={{ fontSize: 50, color: 'info.main', mb: 1 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Model
                </Typography>
                <Chip 
                  label={stats.modelExists ? "Aktif" : "Eğitilmemiş"} 
                  color={stats.modelExists ? "success" : "warning"}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Button 
                  variant="contained" 
                  size="small"
                  color="info"
                  startIcon={<Settings />}
                  component={Link}
                  href="/model-info"
                  fullWidth
                >
                  Detaylar
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Sistem Hakkında */}
          <Card sx={{ boxShadow: 3, mb: 4 }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <Info sx={{ mr: 1 }} />
                Sistem Hakkında
              </Typography>
            </Box>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                Bu risk değerlendirme sistemi iki temel bileşenden oluşur:
              </Typography>
              <Box component="ol" sx={{ pl: 2, mb: 3 }}>
                <Typography component="li" sx={{ mb: 2, lineHeight: 1.7 }}>
                  <strong>Kural Tabanlı Risk Değerlendirme:</strong> 
                  Uluslararası kılavuzlara ve uzman görüşlerine dayalı olarak geliştirilen JMF kriterleri ve Eldeniz çalışması baz alınarak klinik skorlama sistemi yapılmıştır.
                </Typography>
                <Typography component="li" sx={{ mb: 2, lineHeight: 1.7 }}>
                  <strong>Yapay Zeka Modeli:</strong> 
                  Tanı konulmuş ve sağlıklı hasta verileri ile oluşturulan ve sürekli kendini geliştiren tahmin modeli.
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Her iki yöntem birleştirilerek, daha doğru ve güvenilir risk tahminleri elde edilir.
              </Typography>
            </CardContent>
          </Card>

        </Container>
      </Box>

      {/* Sağ Sponsor Alanı */}
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <SponsorAd position="right" />
      </Box>
    </Box>
  );
}
