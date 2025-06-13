import { Typography, Paper, Box } from '@mui/material';

export default function ModelInfo() {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Model Bilgisi
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Model Açıklaması
        </Typography>
        <Typography paragraph>
          Bu model, hastaların immün yetmezlik riskini değerlendirmek için geliştirilmiştir. Model, çeşitli klinik ve laboratuvar verilerini kullanarak risk skorunu hesaplar.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Kullanılan Veriler
        </Typography>
        <Typography paragraph>
          Model, aşağıdaki verileri kullanmaktadır:
        </Typography>
        <Box component="ul">
          <Typography component="li">Klinik veriler</Typography>
          <Typography component="li">Laboratuvar sonuçları</Typography>
          <Typography component="li">Aile öyküsü</Typography>
          <Typography component="li">Enfeksiyon geçmişi</Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          Risk Skorlama
        </Typography>
        <Typography paragraph>
          Risk skoru, 0-100 arasında hesaplanır ve dört kategoriye ayrılır:
        </Typography>
        <Box component="ul">
          <Typography component="li">Düşük Risk: 0-25</Typography>
          <Typography component="li">Orta Risk: 26-50</Typography>
          <Typography component="li">Yüksek Risk: 51-75</Typography>
          <Typography component="li">Çok Yüksek Risk: 76-100</Typography>
        </Box>
      </Paper>
    </div>
  );
} 