import { Typography, Paper, Box, TextField, Button, MenuItem, Stack } from '@mui/material';
import { Assignment, Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';

export default function AddClinical({ params }: { params: { id: string } }) {
  const examTypes = [
    'Rutin Kontrol', 'Şikayet Değerlendirmesi', 'Akut Muayene', 
    'Kronik Takip', 'Konsültasyon', 'Acil Muayene'
  ];

  const generalAppearances = [
    'İyi', 'Orta', 'Kötü', 'Ağır Hasta', 'Toksik Görünüm'
  ];

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assignment /> Klinik Muayene Bilgisi Ekle
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Muayene Tarihi"
              name="examination_date"
              type="date"
              required
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              select
              label="Muayene Türü"
              name="examination_type"
              required
              variant="outlined"
            >
              {examTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Muayene Eden Doktor"
              name="examining_physician"
              required
              placeholder="Muayeneyi yapan doktor adı"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Ana Şikayet"
              name="chief_complaint"
              multiline
              rows={3}
              placeholder="Hastanın ana şikayeti ve süresi"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Şimdiki Hastalık Öyküsü"
              name="history_of_present_illness"
              multiline
              rows={4}
              placeholder="Mevcut şikayetlerin detaylı öyküsü"
              variant="outlined"
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Vital Bulgular
            </Typography>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Ateş (°C)"
                name="temperature"
                type="number"
                placeholder="36.5"
                variant="outlined"
                inputProps={{ step: 0.1 }}
              />
              <TextField
                label="Nabız (/dk)"
                name="pulse"
                type="number"
                placeholder="80"
                variant="outlined"
              />
              <TextField
                label="Sistolik TA"
                name="systolic_bp"
                type="number"
                placeholder="120"
                variant="outlined"
              />
              <TextField
                label="Diastolik TA"
                name="diastolic_bp"
                type="number"
                placeholder="80"
                variant="outlined"
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Solunum (/dk)"
                name="respiratory_rate"
                type="number"
                placeholder="20"
                variant="outlined"
              />
              <TextField
                label="O2 Saturasyon (%)"
                name="oxygen_saturation"
                type="number"
                placeholder="98"
                variant="outlined"
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                label="Boy (cm)"
                name="height"
                type="number"
                placeholder="120"
                variant="outlined"
              />
              <TextField
                label="Kilo (kg)"
                name="weight"
                type="number"
                placeholder="25"
                variant="outlined"
                inputProps={{ step: 0.1 }}
              />
            </Stack>

            <TextField
              fullWidth
              select
              label="Genel Görünüm"
              name="general_appearance"
              variant="outlined"
            >
              {generalAppearances.map((appearance) => (
                <MenuItem key={appearance} value={appearance}>
                  {appearance}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Sistem Muayeneleri
            </Typography>

            <TextField
              fullWidth
              label="Baş-Boyun Muayenesi"
              name="head_neck_examination"
              multiline
              rows={3}
              placeholder="Baş, boyun, kulak, burun, boğaz muayene bulguları"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Kardiyovasküler Sistem"
              name="cardiovascular_examination"
              multiline
              rows={3}
              placeholder="Kalp sesleri, üfürüm, nabız vb."
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Solunum Sistemi"
              name="respiratory_examination"
              multiline
              rows={3}
              placeholder="Akciğer sesleri, solunum sıkıntısı vb."
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Gastrointestinal Sistem"
              name="gastrointestinal_examination"
              multiline
              rows={3}
              placeholder="Karın muayenesi, organomegali vb."
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Nörolojik Muayene"
              name="neurological_examination"
              multiline
              rows={3}
              placeholder="Bilinç, motor, duyu, refleksler"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Deri ve Müköz Membranlar"
              name="skin_examination"
              multiline
              rows={3}
              placeholder="Deri lezyonları, döküntü, mukoza muayenesi"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Lenfatik Sistem"
              name="lymphatic_examination"
              multiline
              rows={3}
              placeholder="Lenfadenopati varlığı ve özellikleri"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Muayene Sonucu Değerlendirme"
              name="clinical_assessment"
              multiline
              rows={4}
              placeholder="Muayene bulgularının genel değerlendirmesi"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Önerilen Tetkikler"
              name="recommended_tests"
              multiline
              rows={3}
              placeholder="Muayene sonrası önerilen laboratuvar ve görüntüleme"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Tedavi Planı"
              name="treatment_plan"
              multiline
              rows={3}
              placeholder="Önerilen tedavi ve takip planı"
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
              <Save /> Muayene Bilgisini Kaydet
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
} 