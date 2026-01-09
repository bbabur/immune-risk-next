'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button, 
  Box,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  Divider
} from '@mui/material';
import {
  People,
  PersonAdd, 
  Psychology,
  Shield,
  Vaccines,
  List,
  Settings,
  Storage as StorageIcon,
  TrendingUp,
  ArrowForward,
  Science,
  LocalHospital,
  Speed,
  CheckCircle,
  AccessTime
} from '@mui/icons-material';
import Link from 'next/link';
import { useNotification } from '@/components/NotificationProvider';

interface Stats {
  patientCount: number;
  diagnosedCount: number;
  modelExists: boolean;
  trainingDataCount: number;
}

// Animasyonlu sayaç bileşeni
function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    
    const incrementTime = duration / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count}</span>;
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
    <Box sx={{ width: 180, position: 'sticky', top: 100 }}>
      <Stack spacing={2}>
        {ads[position].map((ad, index) => (
          <Card 
            key={index} 
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3,
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
              }
            }}
            onClick={() => window.open(ad.link, '_blank')}
          >
            <Box
              sx={{
                height: 100,
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
            <CardContent sx={{ p: 1.5, textAlign: 'center', bgcolor: 'rgba(99, 102, 241, 0.05)' }}>
              <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 600 }}>
                {ad.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

// İstatistik Kartı Bileşeni
function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  sublabel,
  color, 
  gradient,
  href,
  buttonText,
  buttonIcon: ButtonIcon
}: { 
  icon: any;
  value: number;
  label: string;
  sublabel?: string;
  color: string;
  gradient: string;
  href: string;
  buttonText: string;
  buttonIcon?: any;
}) {
  return (
    <Card 
      sx={{ 
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.3)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 25px 50px -12px ${color}40`,
          '& .stat-icon': {
            transform: 'scale(1.1) rotate(5deg)'
          },
          '& .stat-glow': {
            opacity: 0.15
          }
        }
      }}
    >
      {/* Glow Effect */}
      <Box 
        className="stat-glow"
        sx={{ 
          position: 'absolute',
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: gradient,
          opacity: 0.1,
          transition: 'opacity 0.4s ease'
        }} 
      />
      
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box 
            className="stat-icon"
            sx={{ 
              p: 1.5,
              borderRadius: 3,
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.4s ease',
              boxShadow: `0 8px 20px -8px ${color}80`
            }}
          >
            <Icon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Chip 
            size="small" 
            icon={<TrendingUp sx={{ fontSize: 14 }} />}
            label="Aktif"
            sx={{ 
              bgcolor: `${color}15`,
              color: color,
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
        </Box>
        
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800,
            background: gradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5,
            fontFamily: '"Space Grotesk", "Poppins", sans-serif'
          }}
        >
          <AnimatedCounter value={value} />
        </Typography>
        
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
          {label}
        </Typography>
        
        {sublabel && (
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {sublabel}
          </Typography>
        )}
        
        <Button
          component={Link}
          href={href}
          variant="contained"
          fullWidth
          endIcon={ButtonIcon ? <ButtonIcon /> : <ArrowForward />}
          sx={{
            mt: 2,
            py: 1,
            borderRadius: 2,
            background: gradient,
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: `0 4px 14px 0 ${color}40`,
            '&:hover': {
              background: gradient,
              boxShadow: `0 6px 20px 0 ${color}60`,
            }
          }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
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
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    setLoading(false);
    initializeDatabase();
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
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Science sx={{ fontSize: 60, color: 'white', mb: 2, animation: 'pulse 2s infinite' }} />
        <Typography sx={{ color: 'white', fontWeight: 500 }}>Yükleniyor...</Typography>
        <LinearProgress sx={{ width: 200, mt: 2, borderRadius: 2 }} />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decoration */}
      <Box sx={{
        position: 'absolute',
        top: -200,
        right: -200,
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -150,
        left: -150,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <Box sx={{ display: 'flex', gap: 3, maxWidth: '1600px', mx: 'auto', p: 3, position: 'relative', zIndex: 1 }}>
        {/* Sol Sponsor */}
        <Box sx={{ display: { xs: 'none', xl: 'block' } }}>
          <SponsorAd position="left" />
        </Box>

        {/* Ana İçerik */}
        <Box sx={{ flex: 1, mx: { xs: 0, lg: 2 } }}>
          {/* Hero Section */}
          <Card 
            sx={{ 
              mb: 4, 
              borderRadius: 4,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1f3c 100%)',
              position: 'relative',
              border: 'none'
            }}
          >
            {/* Animated Background Pattern */}
            <Box sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.1,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
            
            <CardContent sx={{ p: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <Shield sx={{ fontSize: 45, color: '#60a5fa' }} />
                </Avatar>
                
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 700,
                      mb: 1,
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      lineHeight: 1.2
                    }}
                  >
                    Primer İmmün Yetmezlik
                    <Box component="span" sx={{ 
                      display: 'block',
                      background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Yapay Zeka Tanı Sistemi
                    </Box>
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<LocalHospital sx={{ color: 'white !important' }} />}
                      label="Konya NEÜ Tıp Fakültesi"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        fontWeight: 500,
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Chip 
                      icon={<CheckCircle sx={{ color: '#4ade80 !important' }} />}
                      label="Model Aktif"
                      sx={{ 
                        bgcolor: 'rgba(74, 222, 128, 0.2)',
                        color: '#4ade80',
                        fontWeight: 500
                      }}
                    />
                  </Box>
                </Box>

                <Button
                  component={Link}
                  href="/patients/register"
                  variant="contained"
                  size="large"
                  startIcon={<PersonAdd />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.5)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      boxShadow: '0 15px 40px -10px rgba(59, 130, 246, 0.6)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Yeni Hasta Kaydı
                </Button>
              </Box>

              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                Bu sistem, çocuk hastalarda primer immün yetmezlik riski taşıyan hastaları erken dönemde tespit etmek, 
                takip etmek ve makine öğrenmesi modeli ile ön değerlendirme yapmak için tasarlanmıştır.
              </Typography>
            </CardContent>
          </Card>

          {/* İstatistik Kartları */}
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, 
              gap: 3, 
              mb: 4 
            }}
          >
            <StatCard
              icon={People}
              value={stats.patientCount}
              label="Toplam Hasta"
              sublabel="Sistemde kayıtlı hastalar"
              color="#6366f1"
              gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              href="/patients"
              buttonText="Hastaları Listele"
              buttonIcon={List}
            />
            
            <StatCard
              icon={StorageIcon}
              value={stats.trainingDataCount}
              label="Eğitim Verisi"
              sublabel="Model eğitim datası"
              color="#f59e0b"
              gradient="linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"
              href="/training-data"
              buttonText="Verileri Görüntüle"
            />
            
            <StatCard
              icon={Vaccines}
              value={stats.diagnosedCount}
              label="Tanı Konulmuş"
              sublabel="ML ile değerlendirilen"
              color="#22c55e"
              gradient="linear-gradient(135deg, #22c55e 0%, #10b981 100%)"
              href="/patients?diagnosed=true"
              buttonText="Tanılı Hastaları Gör"
            />
            
            <StatCard
              icon={Psychology}
              value={stats.modelExists ? 1 : 0}
              label="AI Model"
              sublabel={stats.modelExists ? "CatBoost v1.0 Aktif" : "Eğitilmemiş"}
              color="#06b6d4"
              gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
              href="/model-info"
              buttonText="Model Detayları"
              buttonIcon={Settings}
            />
          </Box>

          {/* Özellikler Grid */}
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 3 
            }}
          >
            {/* Hızlı Erişim */}
            <Card sx={{ 
              borderRadius: 4,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Speed sx={{ fontSize: 28, color: '#6366f1', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Hızlı İşlemler
                  </Typography>
                </Box>
                
                <Stack spacing={2}>
                  <Button
                    component={Link}
                    href="/patients/register"
                    variant="outlined"
                    fullWidth
                    startIcon={<PersonAdd />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: '#e2e8f0',
                      color: '#475569',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        borderColor: '#6366f1',
                        bgcolor: 'rgba(99, 102, 241, 0.05)',
                        color: '#6366f1'
                      }
                    }}
                  >
                    Yeni Hasta Kaydet
                  </Button>
                  
                  <Button
                    component={Link}
                    href="/patients"
                    variant="outlined"
                    fullWidth
                    startIcon={<List />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: '#e2e8f0',
                      color: '#475569',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        borderColor: '#22c55e',
                        bgcolor: 'rgba(34, 197, 94, 0.05)',
                        color: '#22c55e'
                      }
                    }}
                  >
                    Hasta Listesi
                  </Button>
                  
                  <Button
                    component={Link}
                    href="/training-data"
                    variant="outlined"
                    fullWidth
                    startIcon={<StorageIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: '#e2e8f0',
                      color: '#475569',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        borderColor: '#f59e0b',
                        bgcolor: 'rgba(245, 158, 11, 0.05)',
                        color: '#f59e0b'
                      }
                    }}
                  >
                    Eğitim Verileri
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Sistem Bilgisi */}
            <Card sx={{ 
              borderRadius: 4,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Science sx={{ fontSize: 28, color: '#8b5cf6', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Sistem Özellikleri
                  </Typography>
                </Box>
                
                <Stack spacing={2}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.1)'
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6366f1', mb: 0.5 }}>
                      🤖 Makine Öğrenmesi Modeli
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      CatBoost algoritması ile eğitilmiş, 21 klinik özellik üzerinden tahmin yapan model.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: 'rgba(34, 197, 94, 0.05)',
                    border: '1px solid rgba(34, 197, 94, 0.1)'
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#22c55e', mb: 0.5 }}>
                      📊 Klinik Skorlama
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      JMF kriterleri ve Eldeniz çalışması baz alınarak oluşturulan klinik değerlendirme.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: 'rgba(245, 158, 11, 0.05)',
                    border: '1px solid rgba(245, 158, 11, 0.1)'
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#f59e0b', mb: 0.5 }}>
                      🔒 Güvenli Veri Yönetimi
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Hasta verileri şifreli ve güvenli PostgreSQL veritabanında saklanır.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Sağ Sponsor */}
        <Box sx={{ display: { xs: 'none', xl: 'block' } }}>
          <SponsorAd position="right" />
        </Box>
      </Box>
    </Box>
  );
}
