'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Stack,
  Divider,
  Avatar
} from '@mui/material';
import { 
  Psychology,
  Copyright,
  Warning,
  Shield
} from '@mui/icons-material';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} alignItems="center" textAlign="center">
          {/* Logo ve başlık */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              width: 40, 
              height: 40,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <Psychology sx={{ fontSize: 24 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              İmmün Risk AI
            </Typography>
          </Box>

          {/* Güvenlik mesajı */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Shield sx={{ fontSize: 18, color: '#4caf50' }} />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Güvenli ve güvenilir sağlık teknolojisi
            </Typography>
          </Box>

          <Divider sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.2)' }} />

          {/* Uyarı */}
          <Box sx={{ 
            bgcolor: 'rgba(255,107,107,0.2)', 
            p: 2, 
            borderRadius: 2,
            border: '1px solid rgba(255,107,107,0.3)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Warning sx={{ fontSize: 20, color: '#ffeb3b' }} />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Bu sistem yalnızca klinik karar desteği amaçlıdır. Kesin tanı için uzman hekime başvurunuz.
              </Typography>
            </Box>
          </Box>

          {/* Copyright */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Copyright sx={{ fontSize: 16, opacity: 0.8 }} />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {currentYear} İmmün Risk AI. Tüm hakları saklıdır.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
} 