'use client';

import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

interface NavbarSearchProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export default function NavbarSearch({ searchTerm, setSearchTerm, onSearch }: NavbarSearchProps) {
  return (
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
      onKeyPress={(e) => { if (e.key === 'Enter') onSearch(e); }}
      sx={{
        width: 280,
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'white',
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s ease',
          '& fieldset': { border: 'none' },
          '&:hover': { borderColor: '#cbd5e1', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
          '&.Mui-focused': { borderColor: '#059669', boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.1)' },
        },
        '& .MuiInputBase-input': {
          fontSize: '0.875rem',
          py: 1.25,
          '&::placeholder': { color: '#94a3b8', opacity: 1 },
        },
      }}
    />
  );
}
