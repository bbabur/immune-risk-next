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
            Yapay Zeka Model Bilgisi
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Çocuklarda Primer İmmün Yetmezlik Ön Tanısında Yapay Zekanın Kullanımı
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
            Bu model, çocuk hastaların primer immün yetmezlik riskini değerlendirmek için geliştirilmiştir. 
            Yapay Zekâ modelimiz, çeşitli klinik ve laboratuvar verilerini kullanarak risk skorunu hesaplar.
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


      {/* Model Performance */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Speed sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Model Performansı
            </Typography>
          </Box>
          
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Model performansı çalışma ile birlikte değerlendirilecek ve güncellenecektir.
              <br /><br />
              Sistem sürekli olarak yeni verilerle eğitilmekte ve iyileştirilmektedir.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 