'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Divider,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications,
  Security,
  Palette,
  Language,
  Save,
  Brightness6
} from '@mui/icons-material';

interface SettingsData {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  darkMode: boolean;
  language: string;
  autoSave: boolean;
  dataRetention: number;
  twoFactorAuth: boolean;
  sessionTimeout: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    darkMode: false,
    language: 'tr',
    autoSave: true,
    dataRetention: 365,
    twoFactorAuth: false,
    sessionTimeout: 30
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (field: keyof SettingsData, value: boolean | string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('settings', JSON.stringify(settings));
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Ayarlar kaydedilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ boxShadow: 3 }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3 }}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SettingsIcon />
            Ayarlar
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
            Sistem ayarlarınızı buradan yönetebilirsiniz
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Ayarlar başarıyla kaydedildi!
            </Alert>
          )}

          <Stack spacing={4}>
            {/* Bildirim Ayarları */}
            <Box>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Notifications />
                Bildirim Ayarları
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    />
                  }
                  label="Email Bildirimleri"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                    />
                  }
                  label="Push Bildirimleri"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.smsNotifications}
                      onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                    />
                  }
                  label="SMS Bildirimleri"
                />
              </Stack>
            </Box>

            <Divider />

            {/* Görünüm Ayarları */}
            <Box>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Palette />
                Görünüm Ayarları
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.darkMode}
                      onChange={(e) => handleChange('darkMode', e.target.checked)}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Brightness6 />
                      Karanlık Mod
                    </Box>
                  }
                />
                
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Dil</InputLabel>
                  <Select
                    value={settings.language}
                    label="Dil"
                    onChange={(e) => handleChange('language', e.target.value)}
                    startAdornment={<Language sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="tr">Türkçe</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            <Divider />

            {/* Güvenlik Ayarları */}
            <Box>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Security />
                Güvenlik Ayarları
              </Typography>
              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                    />
                  }
                  label="İki Faktörlü Kimlik Doğrulama"
                />
                
                <Box>
                  <Typography gutterBottom>
                    Oturum Zaman Aşımı: {settings.sessionTimeout} dakika
                  </Typography>
                  <Slider
                    value={settings.sessionTimeout}
                    onChange={(_, value) => handleChange('sessionTimeout', value as number)}
                    min={15}
                    max={120}
                    step={15}
                    marks={[
                      { value: 15, label: '15dk' },
                      { value: 30, label: '30dk' },
                      { value: 60, label: '1s' },
                      { value: 120, label: '2s' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Sistem Ayarları */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Sistem Ayarları
              </Typography>
              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoSave}
                      onChange={(e) => handleChange('autoSave', e.target.checked)}
                    />
                  }
                  label="Otomatik Kaydetme"
                />
                
                <Box>
                  <Typography gutterBottom>
                    Veri Saklama Süresi: {settings.dataRetention} gün
                  </Typography>
                  <Slider
                    value={settings.dataRetention}
                    onChange={(_, value) => handleChange('dataRetention', value as number)}
                    min={30}
                    max={1095}
                    step={30}
                    marks={[
                      { value: 30, label: '1 ay' },
                      { value: 365, label: '1 yıl' },
                      { value: 730, label: '2 yıl' },
                      { value: 1095, label: '3 yıl' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Stack>
            </Box>

            {/* Kaydet Butonu */}
            <Box sx={{ pt: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={loading}
                fullWidth
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b5b95 100%)',
                  }
                }}
              >
                {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
} 