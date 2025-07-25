'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Avatar,
  Link as MuiLink,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Psychology,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon
} from '@mui/icons-material';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulated login - replace with actual API call
      if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
        // Save user data to localStorage
        const userData = {
          id: 1,
          email: formData.email,
          name: 'Dr. Admin Kullanıcı',
          role: 'admin'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', 'dummy-jwt-token');
        
        // Redirect to dashboard
        router.push('/');
      } else {
        setError('Geçersiz email veya şifre');
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <Psychology fontSize="large" />
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Giriş Yap
            </Typography>
            <Typography variant="body2" color="text.secondary">
              İmmün Risk AI sistemine hoş geldiniz
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={<LoginIcon />}
              sx={{
                mb: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b5b95 100%)',
                }
              }}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                veya
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Hesabınız yok mu?{' '}
                <MuiLink component={Link} href="/register-user" underline="hover">
                  Kayıt olun
                </MuiLink>
              </Typography>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <MuiLink href="#" underline="hover" variant="body2">
                Şifrenizi mi unuttunuz?
              </MuiLink>
            </Box>
          </Box>

          {/* Demo credentials */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Demo hesap:
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Email: admin@example.com
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Şifre: admin123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 