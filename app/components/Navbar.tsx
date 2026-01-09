'use client';

import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  TextField, 
  InputAdornment,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  ListItemIcon,
  List,
  ListItemText,
  Divider,
  Chip,
  ListItemButton,
  alpha
} from '@mui/material';
import { 
  Home, 
  People, 
  PersonAdd, 
  Psychology, 
  Search,
  Notifications,
  Settings,
  AccountCircle,
  Logout,
  FiberManualRecord,
  PersonalInjury,
  Assignment,
  Warning,
  Storage,
  KeyboardArrowDown,
  School
} from '@mui/icons-material';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  category: string;
  patient?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

// Hilal İkonu SVG
function CrescentIcon({ sx }: { sx?: any }) {
  return (
    <Box 
      component="svg" 
      viewBox="0 0 24 24" 
      sx={{ width: 28, height: 28, ...sx }}
    >
      <path 
        d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" 
        fill="currentColor"
      />
    </Box>
  );
}

// Nav Link bileşeni
function NavLink({ href, icon: Icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) {
  return (
    <Button
      component={Link}
      href={href}
      sx={{ 
        textTransform: 'none',
        fontWeight: 600,
        px: 2,
        py: 1,
        borderRadius: 2,
        color: isActive ? '#1e40af' : '#475569',
        bgcolor: isActive ? 'rgba(30, 64, 175, 0.08)' : 'transparent',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'rgba(30, 64, 175, 0.06)',
          color: '#1e40af',
        }
      }}
    >
      <Icon sx={{ fontSize: 20, mr: 0.75 }} />
      {label}
    </Button>
  );
}

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role || '');
        setUserName(user.name || user.email || '');
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: NotificationItem) => !n.isRead).length);
      }
    } catch (error) {
      console.error('Bildirimler getirilemedi:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    router.push('/profile');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    router.push('/settings');
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/patients?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <PersonAdd sx={{ color: '#22c55e' }} />;
      case 'warning':
        return <Warning sx={{ color: '#f59e0b' }} />;
      case 'error':
        return <PersonalInjury sx={{ color: '#ef4444' }} />;
      default:
        return <Assignment sx={{ color: '#3b82f6' }} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => prev - 1);
    }

    if (notification.patient) {
      router.push(`/patients/${notification.patient.id}`);
    }
    
    handleNotificationMenuClose();
  };

  return (
    <>
      {/* Üst Bilgi Bandı - Üniversite */}
      <Box sx={{ 
        background: 'linear-gradient(90deg, #1e3a5f 0%, #1e40af 100%)',
        py: 0.75,
        px: 3,
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <School sx={{ fontSize: 16, color: '#93c5fd' }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.75rem', fontWeight: 500 }}>
            Konya Necmettin Erbakan Üniversitesi Tıp Fakültesi
          </Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
          Çocuk Sağlığı ve Hastalıkları - Çocuk İmmünolojisi ve Allerji Bilim Dalı
        </Typography>
      </Box>

      {/* Ana Navbar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          top: 0
        }}
      >
        <Toolbar sx={{ minHeight: '68px !important', px: { xs: 2, lg: 3 } }}>
          {/* Logo Section */}
          <Box 
            component={Link}
            href="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mr: 3,
              textDecoration: 'none',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            <Box
              sx={{ 
                width: 46, 
                height: 46, 
                mr: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)'
              }}
            >
              <CrescentIcon sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography 
                sx={{ 
                  color: '#1e293b',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  lineHeight: 1.2
                }}
              >
                İmmün Yetmezlik
              </Typography>
              <Typography 
                sx={{ 
                  color: '#059669',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.05em'
                }}
              >
                TANI & TAKİP SİSTEMİ
              </Typography>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 0.5,
            flex: 1,
            alignItems: 'center'
          }}>
            <NavLink href="/" icon={Home} label="Ana Sayfa" isActive={pathname === '/'} />
            <NavLink href="/patients" icon={People} label="Hastalar" isActive={pathname === '/patients' || (pathname?.startsWith('/patients/') && pathname !== '/patients/register')} />
            <NavLink href="/patients/register" icon={PersonAdd} label="Yeni Hasta" isActive={pathname === '/patients/register'} />
            <NavLink href="/model-info" icon={Psychology} label="AI Model" isActive={pathname === '/model-info'} />
            <NavLink href="/about" icon={Assignment} label="Hakkında" isActive={pathname === '/about'} />

            {/* Search Section */}
            <Box sx={{ ml: 'auto', mr: 2 }}>
              <TextField
                placeholder="Hasta ara (TC, Ad, Soyad)..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e);
                  }
                }}
                sx={{ 
                  width: 280,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    '& fieldset': {
                      border: 'none'
                    },
                    '&:hover': {
                      borderColor: '#cbd5e1',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#059669',
                      boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.1)'
                    }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    py: 1.25,
                    '&::placeholder': {
                      color: '#94a3b8',
                      opacity: 1
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Right Section - Notifications & Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Bildirimler">
              <IconButton 
                onClick={handleNotificationMenuOpen}
                sx={{
                  color: '#64748b',
                  bgcolor: unreadCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor: unreadCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <Badge 
                  badgeContent={unreadCount} 
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#ef4444',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      minWidth: 18,
                      height: 18
                    }
                  }}
                >
                  <Notifications sx={{ color: unreadCount > 0 ? '#ef4444' : '#64748b' }} />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Ayarlar">
              <IconButton 
                onClick={handleSettingsClick}
                sx={{
                  color: '#64748b',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>

            {/* Profile Button */}
            <Button
              onClick={handleProfileMenuOpen}
              sx={{
                ml: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 3,
                bgcolor: 'white',
                border: '1px solid #e2e8f0',
                textTransform: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'white',
                  borderColor: '#cbd5e1',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1,
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  fontSize: '0.875rem',
                  fontWeight: 700
                }}
              >
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Box sx={{ textAlign: 'left', display: { xs: 'none', lg: 'block' } }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>
                  {userName || 'Kullanıcı'}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#64748b', lineHeight: 1.2 }}>
                  {userRole === 'admin' ? 'Yönetici' : 'Doktor'}
                </Typography>
              </Box>
              <KeyboardArrowDown sx={{ ml: 0.5, color: '#94a3b8', fontSize: 18, display: { xs: 'none', lg: 'block' } }} />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
            minWidth: 200
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
          <Typography sx={{ fontWeight: 700, color: '#059669' }}>{userName || 'Kullanıcı'}</Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {userRole === 'admin' ? 'Yönetici' : 'Doktor'}
          </Typography>
        </Box>
        <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <AccountCircle sx={{ color: '#059669' }} />
          </ListItemIcon>
          <Typography sx={{ fontWeight: 500 }}>Profil</Typography>
        </MenuItem>
        <MenuItem onClick={handleSettingsClick} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Settings sx={{ color: '#059669' }} />
          </ListItemIcon>
          <Typography sx={{ fontWeight: 500 }}>Ayarlar</Typography>
        </MenuItem>
        {userRole === 'admin' && <Divider sx={{ my: 1 }} />}
        {userRole === 'admin' && (
          <MenuItem onClick={() => { handleMenuClose(); router.push('/admin/database'); }} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <Storage sx={{ color: '#059669' }} />
            </ListItemIcon>
            <Typography sx={{ fontWeight: 500 }}>Veritabanı</Typography>
          </MenuItem>
        )}
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#ef4444' }}>
          <ListItemIcon>
            <Logout sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <Typography sx={{ fontWeight: 500 }}>Çıkış Yap</Typography>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
            minWidth: 380,
            maxWidth: 420,
            maxHeight: 450,
            overflow: 'auto'
          }
        }}
      >
        <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#059669' }}>
              Bildirimler
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {unreadCount > 0 ? `${unreadCount} okunmamış` : 'Tümü okundu'}
            </Typography>
          </Box>
          {unreadCount > 0 && (
            <Chip 
              label={unreadCount} 
              size="small" 
              sx={{ 
                bgcolor: '#ef4444', 
                color: 'white',
                fontWeight: 700 
              }} 
            />
          )}
        </Box>
        
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Notifications sx={{ fontSize: 48, color: '#e2e8f0', mb: 1 }} />
              <Typography sx={{ color: '#64748b', fontWeight: 500 }}>
                Henüz bildirim yok
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Sistem etkinlikleri burada görünecek
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <ListItemButton
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  py: 2,
                  px: 2.5,
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: notification.isRead ? 'transparent' : 'rgba(5, 150, 105, 0.04)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: notification.isRead ? '#f8fafc' : 'rgba(5, 150, 105, 0.08)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>
                  <Box sx={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: 2,
                    bgcolor: alpha(getNotificationColor(notification.type), 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getNotificationIcon(notification.type)}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ 
                        fontWeight: notification.isRead ? 500 : 700,
                        color: '#1e293b',
                        fontSize: '0.875rem'
                      }}>
                        {notification.title}
                      </Typography>
                      {!notification.isRead && (
                        <FiberManualRecord sx={{ color: getNotificationColor(notification.type), fontSize: 8 }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {notification.message}
                      </Typography>
                      {notification.patient && (
                        <Chip 
                          label={`${notification.patient.firstName} ${notification.patient.lastName}`}
                          size="small"
                          sx={{ 
                            mt: 0.5,
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: '#ecfdf5',
                            color: '#059669'
                          }}
                        />
                      )}
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', mt: 0.5 }}>
                        {new Date(notification.createdAt).toLocaleString('tr-TR')}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            ))
          )}
        </List>
      </Menu>
    </>
  );
}
