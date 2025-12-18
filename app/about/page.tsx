'use client';

import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Avatar, 
  Chip,
  Paper,
  Stack,
  Button
} from '@mui/material';
import { 
  Code, 
  Psychology, 
  LocalHospital,
  School,
  Vaccines,
  ArrowBack,
  RecordVoiceOver,
  Email,
  LinkedIn
} from '@mui/icons-material';
import Link from 'next/link';

const leadMember = {
  name: 'Prof. Dr. İsmail Reisli',
  role: 'Proje Danışmanı',
  icon: <RecordVoiceOver sx={{ fontSize: 48, color: 'white' }} />,
  description: 'Çocuk İmmünolojisi ve Allerji Uzmanı, Proje Danışmanı',
  skills: ['İmmünoloji', 'Pediatri', 'Klinik Araştırma', 'Primer İmmün Yetmezlik'],
  color: 'primary'
};

const teamMembers = [
  {
    name: 'Burak Babur',
    role: 'Yazılım Geliştirici',
    icon: <Code sx={{ fontSize: 48, color: 'white' }} />,
    description: 'Sistem geliştirme, veritabanı tasarımı ve frontend-backend entegrasyonu',
    skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    color: 'info'
  },
  {
    name: 'Hasan Amanet',
    role: 'Yapay Zeka Mühendisi',
    icon: <Psychology sx={{ fontSize: 48, color: 'white' }} />,
    description: 'Makine öğrenmesi modelleri, risk değerlendirme algoritmaları',
    skills: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow'],
    color: 'success'
  },
  {
    name: 'Mehmet Babur',
    role: 'Tıbbi Danışman',
    icon: <Vaccines sx={{ fontSize: 48, color: 'white' }} />,
    description: 'Klinik değerlendirme, hasta verileri analizi ve tıbbi danışmanlık',
    skills: ['İmmünoloji', 'Pediatri', 'Klinik Araştırma', 'Hasta Takibi'],
    color: 'error'
  }
];

export default function AboutPage() {
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
        
        <Paper sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Hakkımızda
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Konya Necmettin Erbakan Üniversitesi Tıp Fakültesi
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
            Çocuk Primer İmmün Yetmezlik Risk Değerlendirme Sistemi, multidisipliner bir ekip tarafından 
            çocuk hastalarda primer immün yetmezlik riskini erken dönemde tespit etmek amacıyla geliştirilmiştir.
          </Typography>
        </Paper>
      </Box>

      {/* Team Members - Compact Grid Layout */}
      <Typography variant="h4" component="h2" sx={{ 
        mb: 4, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }}>
        Geliştirici Ekibimiz
      </Typography>

      {/* All Members in Grid - 4 Columns */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {/* Lead Member - Prof. Dr. İsmail Reisli */}
        <Card sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px 0 rgba(102, 126, 234, 0.4)',
          border: '2px solid',
          borderColor: 'primary.main',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px 0 rgba(102, 126, 234, 0.5)',
          }
        }}>
          <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              {leadMember.icon}
            </Avatar>
            <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold', fontSize: '1rem' }}>
              {leadMember.name}
            </Typography>
            <Chip 
              label={leadMember.role} 
              color={leadMember.color as any}
              size="small"
              sx={{ mb: 2, fontWeight: 'bold' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40, fontSize: '0.875rem' }}>
              {leadMember.description}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                {leadMember.skills.map((skill, idx) => (
                  <Chip key={idx} label={skill} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                ))}
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Other Team Members */}
        {teamMembers.map((member, index) => (
          <Card key={index} sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 8px 30px 0 rgba(0, 0, 0, 0.15)',
            }
          }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2,
                background: member.color === 'info' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
                           member.color === 'success' ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' :
                           'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              }}>
                {member.icon}
              </Avatar>
              
              <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold', fontSize: '1rem' }}>
                {member.name}
              </Typography>
              
              <Chip 
                label={member.role}
                color={member.color as any}
                size="small"
                sx={{ mb: 2, fontWeight: 'bold' }}
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40, fontSize: '0.875rem' }}>
                {member.description}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                  {member.skills.map((skill, skillIndex) => (
                    <Chip
                      key={skillIndex}
                      label={skill}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Project Information */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h3" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            Proje Hakkında
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
            Bu sistem, çocuklarda primer immün yetmezlik hastalıklarının erken tanısını desteklemek amacıyla geliştirilmiştir. 
            Yapay zeka ve makine öğrenmesi teknolojilerini kullanarak, risk değerlendirmesi yapar ve klinisyenlere 
            karar destek sistemi sunar.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
            Sistem, klinik bulgular, laboratuvar sonuçları, aile öyküsü ve enfeksiyon geçmişi gibi çok sayıda parametreyi 
            değerlendirerek, hastanın primer immün yetmezlik riski hakkında kapsamlı bir analiz sağlar.
          </Typography>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" component="h3" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            İletişim
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Konya Necmettin Erbakan Üniversitesi Tıp Fakültesi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Çocuk İmmünolojisi ve Allerji Bilim Dalı
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
