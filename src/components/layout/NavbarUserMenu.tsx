'use client';

import {
  Button,
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Settings,
  Storage,
  KeyboardArrowDown as ArrowDown,
} from '@mui/icons-material';

interface NavbarUserMenuProps {
  userName: string;
  userRole: string;
  anchorEl: null | HTMLElement;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  onProfile: () => void;
  onSettings: () => void;
  onAdmin: () => void;
  onLogout: () => void;
}

export default function NavbarUserMenu({
  userName,
  userRole,
  anchorEl,
  onOpen,
  onClose,
  onProfile,
  onSettings,
  onAdmin,
  onLogout,
}: NavbarUserMenuProps) {
  return (
    <>
      <Tooltip title="Ayarlar">
        <IconButton
          onClick={onSettings}
          sx={{ color: '#64748b', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
        >
          <Settings />
        </IconButton>
      </Tooltip>

      <Button
        onClick={onOpen}
        sx={{
          ml: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: 3,
          bgcolor: 'white',
          border: '1px solid #e2e8f0',
          textTransform: 'none',
          transition: 'all 0.2s ease',
          '&:hover': { bgcolor: 'white', borderColor: '#cbd5e1', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            mr: 1,
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            fontSize: '0.875rem',
            fontWeight: 700,
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
        <ArrowDown sx={{ ml: 0.5, color: '#94a3b8', fontSize: 18, display: { xs: 'none', lg: 'block' } }} />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
            minWidth: 200,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
          <Typography sx={{ fontWeight: 700, color: '#059669' }}>{userName || 'Kullanıcı'}</Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {userRole === 'admin' ? 'Yönetici' : 'Doktor'}
          </Typography>
        </Box>
        <MenuItem onClick={onProfile} sx={{ py: 1.5 }}>
          <ListItemIcon><AccountCircle sx={{ color: '#059669' }} /></ListItemIcon>
          <Typography sx={{ fontWeight: 500 }}>Profil</Typography>
        </MenuItem>
        <MenuItem onClick={onSettings} sx={{ py: 1.5 }}>
          <ListItemIcon><Settings sx={{ color: '#059669' }} /></ListItemIcon>
          <Typography sx={{ fontWeight: 500 }}>Ayarlar</Typography>
        </MenuItem>
        {userRole === 'admin' && <Divider sx={{ my: 1 }} />}
        {userRole === 'admin' && (
          <MenuItem onClick={onAdmin} sx={{ py: 1.5 }}>
            <ListItemIcon><Storage sx={{ color: '#059669' }} /></ListItemIcon>
            <Typography sx={{ fontWeight: 500 }}>Veritabanı</Typography>
          </MenuItem>
        )}
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={onLogout} sx={{ py: 1.5, color: '#ef4444' }}>
          <ListItemIcon><Logout sx={{ color: '#ef4444' }} /></ListItemIcon>
          <Typography sx={{ fontWeight: 500 }}>Çıkış Yap</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
