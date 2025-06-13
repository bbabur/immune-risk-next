import { Typography, Paper, Box, TextField, Button, MenuItem, Stack } from '@mui/material';
import { Vaccines, Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';

export default function AddVaccination({ params }: { params: { id: string } }) {
  const vaccines = [
    'BCG', 'Hepatit B', 'DaBT-IPA-Hib', 'OPA', 'KPA', 'MMR', 'Suçiçeği', 
    'Hepatit A', 'Meningokok', 'Pnömokok', 'Rotavirüs', 'İnfluenza', 'HPV'
  ];

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Vaccines /> Aşı Bilgisi Ekle
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={3}>
            <TextField
              fullWidth
              select
              label="Aşı Türü"
              name="vaccine_type"
              required
              variant="outlined"
            >
              {vaccines.map((vaccine) => (
                <MenuItem key={vaccine} value={vaccine}>
                  {vaccine}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Aşı Tarihi"
              name="vaccination_date"
              type="date"
              required
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Doz Numarası"
              name="dose_number"
              type="number"
              placeholder="Örn: 1, 2, 3..."
              variant="outlined"
              inputProps={{ min: 1 }}
            />

            <TextField
              fullWidth
              label="Aşı Markası/Üreticisi"
              name="manufacturer"
              placeholder="Aşı markası veya üretici firma"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Lot Numarası"
              name="lot_number"
              placeholder="Aşı lot numarası"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Uygulanan Yer"
              name="administration_site"
              placeholder="Örn: Sol kol, sağ kol"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Uygulayan Kişi/Kurum"
              name="administered_by"
              placeholder="Doktor adı veya hastane/klinik adı"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Yan Etkiler"
              name="side_effects"
              multiline
              rows={3}
              placeholder="Aşı sonrası gözlenen yan etkiler (varsa)"
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
              <Save /> Aşı Bilgisini Kaydet
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
} 