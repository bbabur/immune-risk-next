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
  InputAdornment,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Email,
  Lock,
  VpnKey,
  ArrowBack
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: Code + New Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setStep(2);
      } else {
        setError(data.error || 'Bir hata oluştu');
      }
    } catch (error) {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.error || 'Bir hata oluştu');
      }
    } catch (error) {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Image
              src="/dem-ilac-logo.png"
              alt="Dem İlaç logo"
              width={180}
              height={60}
              style={{ objectFit: 'contain' }}
            />
          </Box>

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
              <VpnKey fontSize="large" />
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Şifre Sıfırlama
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {step === 1 ? 'Email adresinize kod göndereceğiz' : 'Kodu girin ve yeni şifrenizi belirleyin'}
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={step - 1} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Email</StepLabel>
            </Step>
            <Step>
              <StepLabel>Yeni Şifre</StepLabel>
            </Step>
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {step === 1 ? (
            <Box component="form" onSubmit={handleRequestCode}>
              <TextField
                fullWidth
                label="Email Adresi"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mb: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b5b95 100%)',
                  }
                }}
              >
                {loading ? 'Gönderiliyor...' : 'Kod Gönder'}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleResetPassword}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Kod terminalinizde/console&apos;da görünecek (test modu)
              </Alert>

              <TextField
                fullWidth
                label="6 Haneli Kod"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                inputProps={{ maxLength: 6 }}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Yeni Şifre"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Yeni Şifre (Tekrar)"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
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
                sx={{
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b5b95 100%)',
                  }
                }}
              >
                {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => setStep(1)}
                startIcon={<ArrowBack />}
              >
                Geri Dön
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <MuiLink component={Link} href="/login" underline="hover">
              Giriş sayfasına dön
            </MuiLink>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

