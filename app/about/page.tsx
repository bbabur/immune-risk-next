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
  icon: <RecordVoiceOver sx={{ fontSize: 80, color: 'primary.main' }} />,
  description: 'Çocuk İmmünolojisi ve Allerji Uzmanı, Proje Danışmanı',
  skills: ['İmmünoloji', 'Pediatri', 'Klinik Araştırma', 'Primer İmmün Yetmezlik'],
  color: 'primary'
};

const teamMembers = [
  {
    name: 'Burak Babur',
    role: 'Yazılım Geliştirici',
    icon: <Code sx={{ fontSize: 60, color: 'info.main' }} />,
    description: 'Sistem geliştirme, veritabanı tasarımı ve frontend-backend entegrasyonu',
    skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    color: 'info'
  },
  {
    name: 'Hasan Amanet',
    role: 'Yapay Zeka Mühendisi',
    icon: <Psychology sx={{ fontSize: 60, color: 'success.main' }} />,
    description: 'Makine öğrenmesi modelleri, risk değerlendirme algoritmaları',
    skills: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow'],
    color: 'success'
  },
  {
    name: 'Mehmet Babur',
    role: 'Tıbbi Danışman',
    icon: <Vaccines sx={{ fontSize: 60, color: 'error.main' }} />,
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

      {/* Lead Member - Prof. Dr. İsmail Reisli */}
      <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center', color: 'primary.main' }}>
        Geliştirici Ekibimiz
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
        <Card sx={{ 
          maxWidth: 500,
          boxShadow: 6,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: 10
          }
        }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Avatar sx={{ 
              width: 120, 
              height: 120, 
              mx: 'auto', 
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              {leadMember.icon}
            </Avatar>
            <Typography variant="h4" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
              {leadMember.name}
            </Typography>
            <Chip 
              label={leadMember.role} 
              color={leadMember.color as any}
              sx={{ mb: 2, fontSize: '1rem', py: 2.5 }}
            />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {leadMember.description}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {leadMember.skills.map((skill, idx) => (
                <Chip key={idx} label={skill} size="small" variant="outlined" />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Team Members */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        {teamMembers.map((member, index) => (
          <Card key={index} sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: 3,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 6,
            }
          }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
              <Box sx={{ mb: 2 }}>
                {member.icon}
              </Box>
              
              <Typography variant="h5" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                {member.name}
              </Typography>
              
              <Chip 
                label={member.role}
                color={member.color as any}
                sx={{ mb: 2, fontWeight: 'bold' }}
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 48 }}>
                {member.description}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Uzmanlık Alanları:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
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
            Bu sistem, Konya Necmettin Erbakan Üniversitesi Tıp Fakültesi kapsamında yürütülen 
            Çocuklarda Primer İmmün Yetmezlik Ön Tanısında Yapay Zekanın Kullanımı araştırma projesi 
            için geliştirilmiştir. Amacımız, çocuk hastalarda primer immün yetmezlik riskini erken 
            dönemde tespit ederek, uygun tanı ve tedavi süreçlerine yönlendirmektir.
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
            Sistem, yapay zeka teknolojileri kullanarak hasta verilerini analiz etmekte ve risk 
            değerlendirmesi yapmaktadır. Bu sayede hekimlerin karar verme sürecini desteklemekte 
            ve hasta takibini kolaylaştırmaktadır.
          </Typography>

          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Kullanılan Teknolojiler
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip label="Next.js 15" color="primary" />
              <Chip label="React 19" color="primary" />
              <Chip label="TypeScript" color="info" />
              <Chip label="PostgreSQL" color="success" />
              <Chip label="Material-UI (MUI)" color="secondary" />
              <Chip label="Node.js" color="success" />
              <Chip label="Python (ML)" color="warning" />
              <Chip label="TensorFlow" color="warning" />
              <Chip label="Resend (Email)" color="info" />
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" component="h3" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            İletişim
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Konya Necmettin Erbakan Üniversitesi Tıp Fakültesi
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Çocuklarda Primer İmmün Yetmezlik Ön Tanısında Yapay Zekanın Kullanımı Araştırma Projesi
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <School sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 