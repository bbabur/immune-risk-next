import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from './lib/registry';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Box } from '@mui/material';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "İmmün Yetmezlik Risk Değerlendirme Sistemi",
  description: "Hastaların immün yetmezlik riskini değerlendirmek için tasarlanmış sistem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ThemeRegistry>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flex: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
