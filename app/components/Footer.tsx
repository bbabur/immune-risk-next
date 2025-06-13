'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Link,
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import { 
  Psychology,
  Email,
  GitHub,
  LinkedIn,
  Copyright
} from '@mui/icons-material';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        bgcolor: 'grey.100',
        borderTop: '1px solid',
        borderColor: 'grey.200',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          {/* Ana footer içerik */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3
          }}>
            {/* Logo ve açıklama */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Psychology sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  İmmün Risk AI
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  İmmün Yetmezlik Risk Değerlendirme Sistemi
                </Typography>
              </Box>
            </Box>

            {/* Bağlantılar */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Box>
                <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Sistem
                </Typography>
                <Stack spacing={0.5}>
                  <Link href="/" color="text.secondary" underline="hover" variant="body2">
                    Dashboard
                  </Link>
                  <Link href="/patients" color="text.secondary" underline="hover" variant="body2">
                    Hastalar
                  </Link>
                  <Link href="/patients/register" color="text.secondary" underline="hover" variant="body2">
                    Yeni Hasta
                  </Link>
                  <Link href="/model-info" color="text.secondary" underline="hover" variant="body2">
                    AI Model
                  </Link>
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Hakkında
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Sistem v2.0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Next.js & AI Powered
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Çocuk İmmünoloji
                  </Typography>
                </Stack>
              </Box>
            </Box>

            {/* İletişim */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                İletişim
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                <IconButton size="small" color="primary">
                  <Email />
                </IconButton>
                <IconButton size="small" color="primary">
                  <GitHub />
                </IconButton>
                <IconButton size="small" color="primary">
                  <LinkedIn />
                </IconButton>
              </Stack>
            </Box>
          </Box>

          <Divider />

          {/* Alt kısım - Copyright */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Copyright sx={{ fontSize: 16 }} />
              {currentYear} İmmün Risk AI. Tüm hakları saklıdır.
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Güvenli ve güvenilir sağlık teknolojisi
            </Typography>
          </Box>

          {/* Uyarı notu */}
          <Box sx={{ 
            bgcolor: 'warning.light', 
            p: 2, 
            borderRadius: 2,
            textAlign: 'center'
          }}>
            <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 'bold' }}>
              ⚠️ Bu sistem yalnızca klinik karar desteği amaçlıdır. Kesin tanı için uzman hekime başvurunuz.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
} 