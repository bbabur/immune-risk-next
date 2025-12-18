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
  ListItem,
  ListItemText,
  Divider,
  Chip,
  ListItemButton
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
  Menu as MenuIcon,
  Logout,
  FiberManualRecord,
  PersonalInjury,
  Assignment,
  Warning,
  Storage
} from '@mui/icons-material';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const router = useRouter();

  // Kullanıcı rolünü al
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role || '');
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Bildirimleri getir
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

  // Sayfa yüklendiğinde ve her 30 saniyede bir bildirimleri getir
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
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Clear cookie
    document.cookie = 'token=; path=/; max-age=0';
    
    // Redirect to login
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
        return <PersonAdd sx={{ color: '#4caf50' }} />;
      case 'warning':
        return <Warning sx={{ color: '#ff9800' }} />;
      case 'error':
        return <PersonalInjury sx={{ color: '#f44336' }} />;
      default:
        return <Assignment sx={{ color: '#2196f3' }} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#4caf50';
      case 'warning':
        return '#ff9800';
      case 'error':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    // Bildirimi okundu olarak işaretle
    if (!notification.isRead) {
      // TODO: API çağrısı yapılacak
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => prev - 1);
    }

    // Hastaya yönlendir
    if (notification.patient) {
      router.push(`/patients/${notification.patient.id}`);
    }
    
    handleNotificationMenuClose();
  };

  return (
    <AppBar 
      position="static" 
      elevation={2}
      sx={{ 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.12)'
      }}
    >
      <Toolbar sx={{ minHeight: '70px !important' }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              mr: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <Psychology />
          </Avatar>
          <Typography 
            variant="h6" 
            component={Link} 
            href="/" 
            sx={{ 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            İmmün Risk AI
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          gap: 1,
          flex: 1
        }}>
          <Button
            component={Link}
            href="/"
            color="inherit"
            startIcon={<Home />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Dashboard
          </Button>
          
          <Button
            component={Link}
            href="/patients"
            color="inherit"
            startIcon={<People />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Hastalar
          </Button>
          
          <Button
            component={Link}
            href="/register"
            color="inherit"
            startIcon={<PersonAdd />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Yeni Hasta
          </Button>
          
          <Button
            component={Link}
            href="/model-info"
            color="inherit"
            startIcon={<Psychology />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            AI Model
          </Button>

          <Button
            component={Link}
            href="/about"
            color="inherit"
            startIcon={<Assignment />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Hakkında
          </Button>

          {/* Search Section */}
          <Box sx={{ ml: 'auto', mr: 2 }}>
            <TextField
              placeholder="Hasta ara..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(0,0,0,0.54)' }} />
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
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                  }
                }
              }}
            />
          </Box>
        </Box>

        {/* Right Section - Notifications & Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Bildirimler">
            <IconButton 
              color="inherit" 
              size="large"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Ayarlar">
            <IconButton 
              color="inherit" 
              size="large"
              onClick={handleSettingsClick}
            >
              <Settings />
            </IconButton>
          </Tooltip>

          <Tooltip title="Profil">
            <IconButton
              color="inherit"
              size="large"
              onClick={handleProfileMenuOpen}
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profil
        </MenuItem>
        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Ayarlar
        </MenuItem>
        {userRole === 'admin' && <Divider />}
        {userRole === 'admin' && (
          <MenuItem onClick={() => { handleMenuClose(); router.push('/admin/database'); }}>
            <ListItemIcon>
              <Storage fontSize="small" />
            </ListItemIcon>
            Veritabanı Yönetimi
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Çıkış
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 400,
            maxWidth: 500,
            maxHeight: 400,
            overflow: 'auto'
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Bildirimler
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : 'Tüm bildirimler okundu'}
          </Typography>
        </Box>
        
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="Henüz bildirim yok"
                secondary="Sistem etkinlikleri burada görünecek"
              />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItemButton
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  py: 2,
                  px: 2,
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: notification.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    backgroundColor: notification.isRead ? 'rgba(0, 0, 0, 0.04)' : 'rgba(25, 118, 210, 0.12)'
                  }
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}>
                        {notification.title}
                      </Typography>
                      {!notification.isRead && (
                        <FiberManualRecord sx={{ color: getNotificationColor(notification.type), fontSize: 8 }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      {notification.patient && (
                        <Typography variant="caption" color="text.secondary">
                          Hasta: {notification.patient.firstName} {notification.patient.lastName}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
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
    </AppBar>
  );
} 