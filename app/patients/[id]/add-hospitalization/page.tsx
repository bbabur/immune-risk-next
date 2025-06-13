import { Typography, Paper, Box, TextField, Button, MenuItem, Stack } from '@mui/material';
import { LocalHospital, Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';

export default function AddHospitalization({ params }: { params: { id: string } }) {
  const admissionTypes = [
    'Acil', 'Elektif', 'Zorunlu', 'Gün Cerrahi', 'Günübirlik'
  ];

  const departments = [
    'Çocuk İmmünoloji', 'Çocuk Enfeksiyon', 'Çocuk Hematoloji-Onkoloji', 
    'Çocuk Cerrahisi', 'Çocuk Kardiyoloji', 'Çocuk Nefroloji', 
    'Çocuk Gastroenteroloji', 'Yoğun Bakım', 'Acil Servis', 'Diğer'
  ];

  const dischargeTypes = [
    'Şifa ile Taburcu', 'Tedavi Tamamlanarak Taburcu', 'Devir', 
    'Kendi İsteği ile Taburcu', 'Kaçak', 'Eksitus'
  ];

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalHospital /> Hastaneye Yatış Bilgisi Ekle
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Yatış Tarihi"
              name="admission_date"
              type="date"
              required
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Taburcu Tarihi"
              name="discharge_date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              select
              label="Yatış Türü"
              name="admission_type"
              required
              variant="outlined"
            >
              {admissionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Yatış Yapılan Bölüm"
              name="department"
              required
              variant="outlined"
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Hastane Adı"
              name="hospital_name"
              required
              placeholder="Yatış yapılan hastane"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Yatış Nedeni"
              name="admission_reason"
              required
              multiline
              rows={3}
              placeholder="Hastaneye yatış nedeni ve şikayetler"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Ön Tanı"
              name="preliminary_diagnosis"
              multiline
              rows={2}
              placeholder="Yatışta konulan ön tanı"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Kesin Tanı"
              name="final_diagnosis"
              multiline
              rows={2}
              placeholder="Taburcu sırasındaki kesin tanı"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Uygulanan Tedaviler"
              name="treatments_given"
              multiline
              rows={4}
              placeholder="Hastanede uygulanan tedaviler"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Yapılan İşlemler"
              name="procedures_performed"
              multiline
              rows={3}
              placeholder="Cerrahi ve invaziv işlemler"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Komplikasyonlar"
              name="complications"
              multiline
              rows={3}
              placeholder="Yatış sırasında gelişen komplikasyonlar"
              variant="outlined"
            />

            <TextField
              fullWidth
              select
              label="Taburcu Türü"
              name="discharge_type"
              variant="outlined"
            >
              {dischargeTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Taburcu Sonrası Öneriler"
              name="discharge_instructions"
              multiline
              rows={3}
              placeholder="Taburcu sonrası takip ve tedavi önerileri"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Sorumlu Doktor"
              name="attending_physician"
              placeholder="Takipten sorumlu doktor"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Notlar"
              name="notes"
              multiline
              rows={3}
              placeholder="Ek notlar ve özel durumlar"
              variant="outlined"
            />
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button component={Link} href={`/patients/${params.id}`} variant="outlined" color="primary">
              <Cancel /> İptal
            </Button>
            <Button type="submit" variant="contained" color="primary">
              <Save /> Yatış Bilgisini Kaydet
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
} 