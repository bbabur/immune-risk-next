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
  Tooltip
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
  Menu as MenuIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const isMenuOpen = Boolean(anchorEl);

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
        <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 'auto' }}>
          <Button 
            color="inherit" 
            component={Link} 
            href="/"
            startIcon={<Home />}
            sx={{ 
              px: 2,
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2
              }
            }}
          >
            Dashboard
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            href="/patients"
            startIcon={<People />}
            sx={{ 
              px: 2,
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2
              }
            }}
          >
            Hastalar
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            href="/register"
            startIcon={<PersonAdd />}
            sx={{ 
              px: 2,
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2
              }
            }}
          >
            Yeni Hasta
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            href="/model-info"
            startIcon={<Psychology />}
            sx={{ 
              px: 2,
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2
              }
            }}
          >
            AI Model
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mx: 2, display: { xs: 'none', sm: 'block' } }}>
          <Box component="form" onSubmit={handleSearch}>
            <TextField
              placeholder="Hasta adı ara..."
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
            <IconButton color="inherit" size="large">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Ayarlar">
            <IconButton color="inherit" size="large">
              <Settings />
            </IconButton>
          </Tooltip>

          <Tooltip title="Profil">
            <IconButton
              size="large"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }}
              >
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 200,
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1,
              },
            },
          }}
        >
          <MenuItem>
            <AccountCircle sx={{ mr: 2 }} />
            Profil
          </MenuItem>
          <MenuItem>
            <Settings sx={{ mr: 2 }} />
            Ayarlar
          </MenuItem>
          <MenuItem>
            Çıkış Yap
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
} 