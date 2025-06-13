import { Typography, Paper, Box, TextField, Button, MenuItem, Stack } from '@mui/material';
import { Science, Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';

export default function AddLab({ params }: { params: { id: string } }) {
  const testTypes = [
    'Tam Kan Sayımı', 'Biyokimya', 'İmmünoloji', 'Mikrobiyoloji', 
    'Hormon', 'Kan Gazı', 'İdrar Analizi', 'Dışkı Analizi',
    'Seroloji', 'Moleküler Tanı', 'Sitoloji', 'Histopatoloji'
  ];

  const urgencyLevels = [
    'Acil', 'Öncelikli', 'Rutin', 'Elektif'
  ];

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Science /> Laboratuvar Sonucu Ekle
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Test Adı"
              name="test_name"
              required
              placeholder="Yapılan test veya tahlil adı"
              variant="outlined"
            />

            <TextField
              fullWidth
              select
              label="Test Türü"
              name="test_type"
              required
              variant="outlined"
            >
              {testTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Test Tarihi"
              name="test_date"
              type="date"
              required
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Sonuç Değeri"
              name="result_value"
              required
              placeholder="Sayısal değer veya sonuç"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Birim"
              name="unit"
              placeholder="mg/dL, g/L, /μL, % vb."
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Referans Aralığı"
              name="reference_range"
              placeholder="Normal değer aralığı"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Laboratuvar"
              name="laboratory"
              placeholder="Testi yapan laboratuvar"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="İsteyen Doktor"
              name="ordering_physician"
              placeholder="Testi isteyen doktor"
              variant="outlined"
            />

            <TextField
              fullWidth
              select
              label="Aciliyet Durumu"
              name="urgency"
              variant="outlined"
            >
              {urgencyLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Klinik Değerlendirme"
              name="clinical_interpretation"
              multiline
              rows={3}
              placeholder="Sonucun klinik yorumu"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Teknik Notlar"
              name="technical_notes"
              multiline
              rows={2}
              placeholder="Teknik detaylar veya özel durumlar"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Notlar"
              name="notes"
              multiline
              rows={3}
              placeholder="Ek notlar"
              variant="outlined"
            />
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button component={Link} href={`/patients/${params.id}`} variant="outlined" color="primary">
              <Cancel /> İptal
            </Button>
            <Button type="submit" variant="contained" color="primary">
              <Save /> Lab Sonucunu Kaydet
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
} 