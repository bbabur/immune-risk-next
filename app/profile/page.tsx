'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Grid,
  Alert,
  Chip,
  Divider,
  Stack
} from '@mui/material';
import {
  AccountCircle,
  Edit,
  Save,
  Cancel,
  Email,
  Person,
  Work,
  Phone,
  LocationOn
} from '@mui/icons-material';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  location?: string;
  bio?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    id: 0,
    name: '',
    email: '',
    role: '',
    phone: '',
    department: '',
    location: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        ...parsedUser,
        phone: parsedUser.phone || '',
        department: parsedUser.department || 'İmmünoloji',
        location: parsedUser.location || 'İstanbul',
        bio: parsedUser.bio || 'İmmün yetmezlik alanında uzman doktor'
      });
    }
  }, []);

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(formData));
      setUser(formData);
      setEditing(false);
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Profil güncellenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        ...user,
        phone: user.phone || '',
        department: user.department || 'İmmünoloji',
        location: user.location || 'İstanbul',
        bio: user.bio || 'İmmün yetmezlik alanında uzman doktor'
      });
    }
    setEditing(false);
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Kullanıcı bilgileri yüklenemedi. Lütfen giriş yapın.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ boxShadow: 3 }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <AccountCircle sx={{ fontSize: 50 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                {user.name}
              </Typography>
              <Chip
                label={user.role === 'admin' ? 'Yönetici' : 'Doktor'}
                color="secondary"
                sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
              />
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Profil başarıyla güncellendi!
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Profil Bilgileri
            </Typography>
            {!editing && (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setEditing(true)}
              >
                Düzenle
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ad Soyad"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!editing}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{ mb: 3 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!editing}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{ mb: 3 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefon"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!editing}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{ mb: 3 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Departman"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                disabled={!editing}
                InputProps={{
                  startAdornment: <Work sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{ mb: 3 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lokasyon"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                disabled={!editing}
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{ mb: 3 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Biyografi"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                disabled={!editing}
                multiline
                rows={3}
                sx={{ mb: 3 }}
              />
            </Grid>
          </Grid>

          {editing && (
            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={loading}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </Stack>
          )}

          {/* İstatistikler */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom>
            İstatistikler
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                <Typography variant="h4" color="primary">
                  24
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Hasta
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                <Typography variant="h4" color="success.main">
                  18
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Aktif Takip
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
                <Typography variant="h4" color="warning.main">
                  6
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Risk Altında
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
                <Typography variant="h4" color="info.main">
                  89%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Başarı Oranı
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
} 