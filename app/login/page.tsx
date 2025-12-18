'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link as MuiLink,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
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
  const [expired, setExpired] = useState(false);
  const [requireLogin, setRequireLogin] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Check for expired session or redirect on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('expired') === 'true') {
        setExpired(true);
      }
      const redirect = urlParams.get('redirect');
      if (redirect && redirect !== '/') {
        setRequireLogin(true);
        setRedirectPath(redirect);
      }
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // API call to login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Save to cookie for middleware (SameSite=Lax for better compatibility)
        const cookieValue = `token=${data.token}; path=/; max-age=${24 * 60 * 60}; samesite=lax${window.location.protocol === 'https:' ? '; secure' : ''}`;
        document.cookie = cookieValue;
        
        console.log('Token saved to cookie:', data.token);
        
        // Small delay to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect to original page or dashboard
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect') || '/';
        router.push(redirectTo);
      } else {
        setError(data.error || 'Geçersiz kullanıcı adı veya şifre');
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu');
      console.error('Login error:', error);
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
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Image
                src="/dem-ilac-logo.png"
                alt="Dem İlaç logo"
                width={280}
                height={160}
                style={{ objectFit: 'contain' }}
              />
            </Box>            
            <Typography variant="body2" color="text.secondary">
              İmmün Risk AI sistemine hoş geldiniz
            </Typography>
          </Box>

          {requireLogin && (
            <Alert severity="info" sx={{ mb: 3 }} onClose={() => setRequireLogin(false)}>
              🔐 Bu sayfaya erişmek için önce giriş yapmalısınız.
            </Alert>
          )}

          {expired && (
            <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setExpired(false)}>
              Oturumunuz sona erdi. Lütfen tekrar giriş yapın.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email veya Kullanıcı Adı"
              type="text"
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
              <MuiLink component={Link} href="/forgot-password" underline="hover" variant="body2">
                Şifrenizi mi unuttunuz?
              </MuiLink>
            </Box>
          </Box>

          {/* Sponsor logo */}
          <Box sx={{ mt: 4, px: 1, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Çalışma Sponsoru
            </Typography>
            <Box
              component="a"
              href="https://demilac.com.tr/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-block',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              <Image
                src="/dem-ilac-logo.png"
                alt="Dem İlaç"
                width={180}
                height={60}
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 