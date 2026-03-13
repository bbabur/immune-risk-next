'use client';

import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { School } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/hooks/useNavigation';
import NavbarBrand from './NavbarBrand';
import NavbarLinks from './NavbarLinks';
import NavbarSearch from './NavbarSearch';
import NavbarNotifications from './NavbarNotifications';
import NavbarUserMenu from './NavbarUserMenu';

export default function Navbar() {
  const pathname = usePathname();
  const nav = useNavigation();

  return (
    <>
      {/* Üniversite Bilgi Bandı */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #1e3a5f 0%, #1e40af 100%)',
          py: 0.75,
          px: 3,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
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
        sx={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', top: 0 }}
      >
        <Toolbar sx={{ minHeight: '68px !important', px: { xs: 2, lg: 3 } }}>
          <NavbarBrand />

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flex: 1, alignItems: 'center' }}>
            <NavbarLinks pathname={pathname} />
            <Box sx={{ ml: 'auto', mr: 2 }}>
              <NavbarSearch
                searchTerm={nav.searchTerm}
                setSearchTerm={nav.setSearchTerm}
                onSearch={nav.handleSearch}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <NavbarNotifications
              unreadCount={nav.unreadCount}
              notifications={nav.notifications}
              anchorEl={nav.notificationAnchorEl}
              onOpen={nav.handleNotificationMenuOpen}
              onClose={nav.handleNotificationMenuClose}
              onNotificationClick={nav.handleNotificationClick}
            />
            <NavbarUserMenu
              userName={nav.userName}
              userRole={nav.userRole}
              anchorEl={nav.anchorEl}
              onOpen={nav.handleProfileMenuOpen}
              onClose={nav.handleMenuClose}
              onProfile={nav.handleProfileClick}
              onSettings={nav.handleSettingsClick}
              onAdmin={nav.handleAdminClick}
              onLogout={nav.handleLogout}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
