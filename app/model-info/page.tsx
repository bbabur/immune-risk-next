'use client';

import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Chip, 
  LinearProgress,
  Paper,
  Stack,
  Button,
  Divider,
  Grid,
  Avatar
} from '@mui/material';
import { 
  Psychology, 
  DataObject, 
  Assessment, 
  ArrowBack,
  Speed,
  LocalHospital,
  Biotech,
  TrendingUp,
  Analytics,
  Science,
  Shield,
  Timeline,
  Warning
} from '@mui/icons-material';
import Link from 'next/link';

const riskCategories = [
  {
    name: 'Düşük Risk',
    range: '0-25',
    color: '#4caf50',
    description: 'Rutin takip önerilir',
    icon: <Shield sx={{ color: '#4caf50' }} />
  },
  {
    name: 'Orta Risk',
    range: '26-50',
    color: '#ff9800',
    description: 'Takip ve ek testler önerilir',
    icon: <Speed sx={{ color: '#ff9800' }} />
  },
  {
    name: 'Yüksek Risk',
    range: '51-75',
    color: '#f44336',
    description: 'Detaylı klinik değerlendirme gerekli',
    icon: <Warning sx={{ color: '#f44336' }} />
  },
  {
    name: 'Çok Yüksek Risk',
    range: '76-100',
    color: '#d32f2f',
    description: 'Acil uzman değerlendirmesi gerekiyor',
    icon: <LocalHospital sx={{ color: '#d32f2f' }} />
  }
];

const dataTypes = [
  {
    title: 'Klinik Veriler',
    icon: <LocalHospital sx={{ color: '#1976d2' }} />,
    description: 'Hasta yaşı, cinsiyeti, semptomları ve fizik muayene bulguları',
    color: '#1976d2'
  },
  {
    title: 'Laboratuvar Sonuçları',
    icon: <Biotech sx={{ color: '#7b1fa2' }} />,
    description: 'İmmünoglobulin seviyeleri, lenfosit sayımı, aşı yanıtları',
    color: '#7b1fa2'
  },
  {
    title: 'Aile Öyküsü',
    icon: <Timeline sx={{ color: '#388e3c' }} />,
    description: 'Genetik yatkınlık, aile içi immün yetmezlik öyküsü',
    color: '#388e3c'
  },
  {
    title: 'Enfeksiyon Geçmişi',
    icon: <Science sx={{ color: '#f57c00' }} />,
    description: 'Tekrarlayan enfeksiyonlar, antibiyotik yanıtı, hastaneye yatış',
    color: '#f57c00'
  }
];

export default function ModelInfo() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Ana Sayfaya Dön
        </Button>
        
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          borderRadius: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
              color: '#667eea'
            }}>
              <Psychology sx={{ fontSize: 50 }} />
            </Avatar>
          </Box>
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            AI Model Bilgisi
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            İmmün Yetmezlik Risk Değerlendirme Sistemi
          </Typography>
        </Paper>
      </Box>

      {/* Model Description */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Analytics sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Model Açıklaması
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
            Bu model, hastaların immün yetmezlik riskini değerlendirmek için geliştirilmiştir. 
            Model, çeşitli klinik ve laboratuvar verilerini kullanarak risk skorunu hesaplar.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip icon={<Psychology />} label="Yapay Zeka" color="primary" />
            <Chip icon={<DataObject />} label="Makine Öğrenmesi" color="secondary" />
            <Chip icon={<Assessment />} label="Risk Analizi" color="success" />
            <Chip icon={<TrendingUp />} label="Sürekli İyileştirme" color="info" />
          </Box>
        </CardContent>
      </Card>

      {/* Data Types */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <DataObject sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Kullanılan Veriler
            </Typography>
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {dataTypes.map((item, index) => (
              <Card key={index} sx={{ 
                height: '100%', 
                borderLeft: `4px solid ${item.color}`,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateX(5px)',
                  boxShadow: 4,
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {item.icon}
                    <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Risk Scoring */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Assessment sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Risk Skorlama Sistemi
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
            Risk skoru, 0-100 arasında hesaplanır ve dört kategoriye ayrılır:
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {riskCategories.map((category, index) => (
              <Card key={index} sx={{ 
                height: '100%',
                border: `2px solid ${category.color}20`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 8px 25px ${category.color}40`,
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {category.icon}
                    <Box sx={{ ml: 2, flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {category.name}
                      </Typography>
                      <Chip 
                        label={category.range}
                        size="small"
                        sx={{ 
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: `${category.color}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: category.color,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Model Performance */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Speed sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Model Performansı
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                  95%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Doğruluk Oranı
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ color: 'info.main', fontWeight: 'bold' }}>
                  92%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Hassasiyet
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                  88%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Özgüllük
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Model sürekli olarak güncellenmekte ve geliştirilmektedir.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 