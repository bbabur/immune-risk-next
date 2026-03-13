'use client';

import { Box, Button } from '@mui/material';
import { Home, People, PersonAdd, Psychology, Assignment } from '@mui/icons-material';
import Link from 'next/link';

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

function NavLink({ href, icon: Icon, label, isActive }: NavLinkProps) {
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
        '&:hover': { bgcolor: 'rgba(30, 64, 175, 0.06)', color: '#1e40af' },
      }}
    >
      <Icon sx={{ fontSize: 20, mr: 0.75 }} />
      {label}
    </Button>
  );
}

interface NavbarLinksProps {
  pathname: string | null;
}

export default function NavbarLinks({ pathname }: NavbarLinksProps) {
  return (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
      <NavLink href="/" icon={Home} label="Ana Sayfa" isActive={pathname === '/'} />
      <NavLink
        href="/patients"
        icon={People}
        label="Hastalar"
        isActive={!!(pathname === '/patients' || (pathname?.startsWith('/patients/') && pathname !== '/patients/register'))}
      />
      <NavLink
        href="/patients/register"
        icon={PersonAdd}
        label="Yeni Hasta"
        isActive={pathname === '/patients/register'}
      />
      <NavLink href="/model-info" icon={Psychology} label="AI Model" isActive={pathname === '/model-info'} />
      <NavLink href="/about" icon={Assignment} label="Hakkında" isActive={pathname === '/about'} />
    </Box>
  );
}
