'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PersonAdd, Warning, PersonalInjury, Assignment } from '@mui/icons-material';

export interface NotificationItem {
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

export function useNavigation() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role || '');
        setUserName(user.name || user.email || '');
      } catch {
        // ignore parse errors
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

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => setNotificationAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationMenuClose = () => setNotificationAnchorEl(null);

  const handleProfileClick = () => { handleMenuClose(); router.push('/profile'); };
  const handleSettingsClick = () => { handleMenuClose(); router.push('/settings'); };
  const handleAdminClick = () => { handleMenuClose(); router.push('/admin/database'); };

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

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => prev - 1);
    }
    if (notification.patient) {
      router.push(`/patients/${notification.patient.id}`);
    }
    handleNotificationMenuClose();
  };

  return {
    anchorEl,
    notificationAnchorEl,
    notifications,
    unreadCount,
    searchTerm,
    setSearchTerm,
    userRole,
    userName,
    handleProfileMenuOpen,
    handleNotificationMenuOpen,
    handleMenuClose,
    handleNotificationMenuClose,
    handleProfileClick,
    handleSettingsClick,
    handleAdminClick,
    handleLogout,
    handleSearch,
    handleNotificationClick,
  };
}
