import { Typography, Paper, Box, TextField, Button, MenuItem, Stack } from '@mui/material';
import { BugReport, Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';

export default function AddInfection({ params }: { params: { id: string } }) {
  const infectionTypes = [
    'Bakteriyel', 'Viral', 'Fungal', 'Paraziter', 'Mikobakteriyel', 'Fırsatçı'
  ];

  const severityLevels = [
    'Hafif', 'Orta', 'Ağır', 'Çok Ağır', 'Hayatı Tehdit Edici'
  ];

  const anatomicalSites = [
    'Solunum Sistemi', 'Sindirim Sistemi', 'Ürogenital Sistem', 'Merkezi Sinir Sistemi',
    'Deri ve Yumuşak Doku', 'Kan ve Kemik İliği', 'Kardiyovasküler Sistem', 
    'Göz', 'Kulak Burun Boğaz', 'Kemik ve Eklem', 'Sistemik/Yaygın'
  ];

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BugReport /> Enfeksiyon Bilgisi Ekle
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Enfeksiyon Adı/Tanısı"
              name="infection_name"
              required
              placeholder="Enfeksiyon tanısı"
              variant="outlined"
            />

            <TextField
              fullWidth
              select
              label="Enfeksiyon Türü"
              name="infection_type"
              required
              variant="outlined"
            >
              {infectionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Anatomik Bölge"
              name="anatomical_site"
              required
              variant="outlined"
            >
              {anatomicalSites.map((site) => (
                <MenuItem key={site} value={site}>
                  {site}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Etken Mikroorganizma"
              name="pathogen"
              placeholder="Tespit edilen mikroorganizma (varsa)"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Başlangıç Tarihi"
              name="onset_date"
              type="date"
              required
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Bitiş/İyileşme Tarihi"
              name="resolution_date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              select
              label="Şiddet"
              name="severity"
              required
              variant="outlined"
            >
              {severityLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Semptomlar"
              name="symptoms"
              multiline
              rows={3}
              placeholder="Gözlenen semptomlar"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Tanı Yöntemi"
              name="diagnostic_method"
              placeholder="Kültür, PCR, seroloji vb."
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Verilen Tedavi"
              name="treatment_given"
              multiline
              rows={2}
              placeholder="Uygulanan tedavi protokolü"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Tedavi Yanıtı"
              name="treatment_response"
              placeholder="İyileşme, kısmi yanıt, yanıtsız vb."
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Hastaneye Yatış"
              name="hospitalization"
              placeholder="Yatış gerekti mi? Süre?"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Komplikasyonlar"
              name="complications"
              multiline
              rows={2}
              placeholder="Gelişen komplikasyonlar (varsa)"
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
              <Save /> Enfeksiyon Bilgisini Kaydet
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
} 