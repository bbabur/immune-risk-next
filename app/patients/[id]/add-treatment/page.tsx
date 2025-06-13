import { Typography, Paper, Box, TextField, Button, MenuItem, Stack } from '@mui/material';
import { Medication, Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';

export default function AddTreatment({ params }: { params: { id: string } }) {
  const treatmentTypes = [
    'Antibiyotik', 'Antiviral', 'Antifungal', 'İmmünosupresif', 'İmmünomodülatör',
    'Steroid', 'IVIG', 'Kemoterapötik', 'Profilaksi', 'Diğer'
  ];

  const routes = [
    'Oral', 'İntravenöz', 'İntramüsküler', 'Subkutan', 'Topikal', 'İnhaler', 'Rektal'
  ];

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Medication /> Tedavi Bilgisi Ekle
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="İlaç/Tedavi Adı"
              name="treatment_name"
              required
              placeholder="İlaç adı veya tedavi türü"
              variant="outlined"
            />

            <TextField
              fullWidth
              select
              label="Tedavi Türü"
              name="treatment_type"
              required
              variant="outlined"
            >
              {treatmentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Başlangıç Tarihi"
              name="start_date"
              type="date"
              required
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Bitiş Tarihi"
              name="end_date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Doz"
              name="dosage"
              placeholder="Örn: 500mg, 2 tablet"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Sıklık"
              name="frequency"
              placeholder="Örn: Günde 2 kez, 8 saatte bir"
              variant="outlined"
            />

            <TextField
              fullWidth
              select
              label="Uygulama Yolu"
              name="route"
              variant="outlined"
            >
              {routes.map((route) => (
                <MenuItem key={route} value={route}>
                  {route}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Endikasyon"
              name="indication"
              placeholder="Tedavinin verilme nedeni"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Doktor/Kurum"
              name="prescribing_doctor"
              placeholder="Tedaviyi öneren doktor veya kurum"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Yan Etkiler"
              name="side_effects"
              multiline
              rows={3}
              placeholder="Gözlenen yan etkiler (varsa)"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Etkinlik"
              name="effectiveness"
              multiline
              rows={3}
              placeholder="Tedavinin etkinliği hakkında notlar"
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
              <Save /> Tedavi Bilgisini Kaydet
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
} 