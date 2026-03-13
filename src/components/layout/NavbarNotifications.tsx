'use client';

import {
  IconButton,
  Badge,
  Tooltip,
  Menu,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  alpha,
} from '@mui/material';
import {
  Notifications,
  FiberManualRecord,
  PersonAdd,
  Warning,
  PersonalInjury,
  Assignment,
} from '@mui/icons-material';
import type { NotificationItem } from '@/hooks/useNavigation';

function getNotificationIcon(type: string) {
  switch (type) {
    case 'success': return <PersonAdd sx={{ color: '#22c55e' }} />;
    case 'warning': return <Warning sx={{ color: '#f59e0b' }} />;
    case 'error': return <PersonalInjury sx={{ color: '#ef4444' }} />;
    default: return <Assignment sx={{ color: '#3b82f6' }} />;
  }
}

function getNotificationColor(type: string) {
  switch (type) {
    case 'success': return '#22c55e';
    case 'warning': return '#f59e0b';
    case 'error': return '#ef4444';
    default: return '#3b82f6';
  }
}

interface NavbarNotificationsProps {
  unreadCount: number;
  notifications: NotificationItem[];
  anchorEl: null | HTMLElement;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  onNotificationClick: (notification: NotificationItem) => void;
}

export default function NavbarNotifications({
  unreadCount,
  notifications,
  anchorEl,
  onOpen,
  onClose,
  onNotificationClick,
}: NavbarNotificationsProps) {
  return (
    <>
      <Tooltip title="Bildirimler">
        <IconButton
          onClick={onOpen}
          sx={{
            color: '#64748b',
            bgcolor: unreadCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
            '&:hover': {
              bgcolor: unreadCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0,0,0,0.04)',
            },
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
                height: 18,
              },
            }}
          >
            <Notifications sx={{ color: unreadCount > 0 ? '#ef4444' : '#64748b' }} />
          </Badge>
        </IconButton>
      </Tooltip>

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
            minWidth: 380,
            maxWidth: 420,
            maxHeight: 450,
            overflow: 'auto',
          },
        }}
      >
        <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#059669' }}>Bildirimler</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {unreadCount > 0 ? `${unreadCount} okunmamış` : 'Tümü okundu'}
            </Typography>
          </Box>
          {unreadCount > 0 && (
            <Chip label={unreadCount} size="small" sx={{ bgcolor: '#ef4444', color: 'white', fontWeight: 700 }} />
          )}
        </Box>

        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Notifications sx={{ fontSize: 48, color: '#e2e8f0', mb: 1 }} />
              <Typography sx={{ color: '#64748b', fontWeight: 500 }}>Henüz bildirim yok</Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Sistem etkinlikleri burada görünecek
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <ListItemButton
                key={notification.id}
                onClick={() => onNotificationClick(notification)}
                sx={{
                  py: 2,
                  px: 2.5,
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: notification.isRead ? 'transparent' : 'rgba(5, 150, 105, 0.04)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: notification.isRead ? '#f8fafc' : 'rgba(5, 150, 105, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: alpha(getNotificationColor(notification.type), 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontWeight: notification.isRead ? 500 : 700, color: '#1e293b', fontSize: '0.875rem' }}>
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
                          sx={{ mt: 0.5, height: 20, fontSize: '0.7rem', bgcolor: '#ecfdf5', color: '#059669' }}
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
