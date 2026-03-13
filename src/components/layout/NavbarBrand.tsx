'use client';

import { Box, Typography } from '@mui/material';
import Link from 'next/link';

function CrescentIcon({ sx }: { sx?: React.CSSProperties | object }) {
  return (
    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 28, height: 28, ...sx }}>
      <path
        d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"
        fill="currentColor"
      />
    </Box>
  );
}

export default function NavbarBrand() {
  return (
    <Box
      component={Link}
      href="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        mr: 3,
        textDecoration: 'none',
        transition: 'transform 0.2s ease',
        '&:hover': { transform: 'scale(1.02)' },
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
          boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
        }}
      >
        <CrescentIcon sx={{ color: 'white' }} />
      </Box>
      <Box>
        <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
          İmmün Yetmezlik
        </Typography>
        <Typography sx={{ color: '#059669', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.05em' }}>
          TANI & TAKİP SİSTEMİ
        </Typography>
      </Box>
    </Box>
  );
}
