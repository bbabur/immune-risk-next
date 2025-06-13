import { Typography, Paper, Box, TextField, Button, MenuItem, Stack } from '@mui/material';
import { FamilyRestroom, Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';

export default function AddFamily({ params }: { params: { id: string } }) {
  const relationshipTypes = [
    'Anne', 'Baba', 'Kardeş', 'Kız Kardeş', 'Büyükanne (Anne tarafı)', 
    'Büyükbaba (Anne tarafı)', 'Büyükanne (Baba tarafı)', 'Büyükbaba (Baba tarafı)',
    'Teyze', 'Dayı', 'Hala', 'Amca', 'Kuzen', 'Diğer'
  ];

  const genders = ['Erkek', 'Kadın'];

  const vitalStatuses = ['Sağ', 'Vefat Etmiş'];

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FamilyRestroom /> Aile Öyküsü Bilgisi Ekle
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={3}>
            <TextField
              fullWidth
              select
              label="Yakınlık Derecesi"
              name="relationship"
              required
              variant="outlined"
            >
              {relationshipTypes.map((relation) => (
                <MenuItem key={relation} value={relation}>
                  {relation}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Adı Soyadı"
              name="full_name"
              placeholder="Aile ferdinin adı soyadı"
              variant="outlined"
            />

            <TextField
              fullWidth
              select
              label="Cinsiyet"
              name="gender"
              variant="outlined"
            >
              {genders.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Doğum Tarihi"
              name="birth_date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              select
              label="Hayatta mı?"
              name="vital_status"
              variant="outlined"
            >
              {vitalStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Vefat Tarihi"
              name="death_date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Sadece vefat etmiş olanlar için"
            />

            <TextField
              fullWidth
              label="Vefat Nedeni"
              name="cause_of_death"
              placeholder="Vefat nedeni (varsa)"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Bilinen Hastalıklar"
              name="known_diseases"
              multiline
              rows={3}
              placeholder="Kronik hastalıklar, genetik hastalıklar vb."
              variant="outlined"
            />

            <TextField
              fullWidth
              label="İmmün Sistem Hastalıkları"
              name="immune_diseases"
              multiline
              rows={3}
              placeholder="İmmün yetmezlik, otoimmün hastalıklar vb."
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Enfeksiyon Öyküsü"
              name="infection_history"
              multiline
              rows={3}
              placeholder="Tekrarlayan enfeksiyonlar, ciddi enfeksiyonlar"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Kanser Öyküsü"
              name="cancer_history"
              multiline
              rows={2}
              placeholder="Kanser tanısı ve türü (varsa)"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Alerjiler"
              name="allergies"
              multiline
              rows={2}
              placeholder="Bilinen alerjiler"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Kullandığı İlaçlar"
              name="medications"
              multiline
              rows={2}
              placeholder="Düzenli kullandığı ilaçlar"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Notlar"
              name="notes"
              multiline
              rows={3}
              placeholder="Ek bilgiler ve özel durumlar"
              variant="outlined"
            />
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button component={Link} href={`/patients/${params.id}`} variant="outlined" color="primary">
              <Cancel /> İptal
            </Button>
            <Button type="submit" variant="contained" color="primary">
              <Save /> Aile Öyküsünü Kaydet
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
} 