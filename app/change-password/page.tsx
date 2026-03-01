'use client';

import { useState, useEffect } from 'react';
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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff, VpnKey } from '@mui/icons-material';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.replace('/login');
      return;
    }
    const user = JSON.parse(stored);
    setUsername(user.username);
  }, [router]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.newPassword !== form.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor');
      return;
    }

    if (form.newPassword.length < 8) {
      setError('Yeni şifre en az 8 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.replace('/');
        }, 1500);
      } else {
        setError(data.error || 'Şifre değiştirilemedi');
      }
    } catch {
      setError('Bir hata oluştu, tekrar deneyin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <VpnKey sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Şifre Değiştirme Zorunlu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Güvenliğiniz için ilk girişte şifrenizi değiştirmeniz gerekmektedir.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>Şifreniz başarıyla değiştirildi! Yönlendiriliyorsunuz...</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Mevcut Şifre"
              type={showCurrent ? 'text' : 'password'}
              value={form.currentPassword}
              onChange={e => handleChange('currentPassword', e.target.value)}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><Lock color="action" /></InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCurrent(p => !p)} edge="end">
                      {showCurrent ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Yeni Şifre"
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={e => handleChange('newPassword', e.target.value)}
              required
              helperText="En az 8 karakter"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><Lock color="action" /></InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNew(p => !p)} edge="end">
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Yeni Şifre (Tekrar)"
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              required
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><Lock color="action" /></InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(p => !p)} edge="end">
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
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
              disabled={loading || success}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b5b95 100%)',
                },
              }}
            >
              {loading ? 'Kaydediliyor...' : 'Şifremi Değiştir'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
