'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Grid,
} from '@mui/material';
import {
  Storage as StorageIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  TableChart as TableIcon,
  Code as CodeIcon,
  Assessment as StatsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

interface TableInfo {
  table_name: string;
  row_count: number;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

export default function DatabaseAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  // Tables tab
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);
  
  // SQL tab
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM patients LIMIT 10;');
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [sqlLoading, setSqlLoading] = useState(false);
  const [sqlError, setSqlError] = useState<string | null>(null);
  
  // Stats tab
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    // Login ve admin kontrolü
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.replace('/login?redirect=/admin/database');
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        router.replace('/');
        return;
      }
      setIsAdmin(true);
    } catch (e) {
      router.replace('/login');
      return;
    }
    
    setIsAuthenticated(true);
    loadTables();
    setLoading(false);
  }, [router]);

  const loadTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/database/tables', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTables(data.tables || []);
      }
    } catch (error) {
      console.error('Tablolar yüklenemedi:', error);
    }
  };

  const loadTableData = async (tableName: string) => {
    setLoadingTable(true);
    setSelectedTable(tableName);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/database/table-data?table=${tableName}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTableData(data.rows || []);
        setColumns(data.columns || []);
      }
    } catch (error) {
      console.error('Tablo verisi yüklenemedi:', error);
    } finally {
      setLoadingTable(false);
    }
  };

  const executeSQL = async () => {
    setSqlLoading(true);
    setSqlError(null);
    setSqlResult(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/database/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: sqlQuery })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSqlResult(data);
      } else {
        setSqlError(data.error || 'SQL hatası');
      }
    } catch (error) {
      setSqlError('Sorgu çalıştırılamadı');
    } finally {
      setSqlLoading(false);
    }
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/database/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const exportTable = async (tableName: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/database/export?table=${tableName}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tableName}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export hatası:', error);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #2b6cb0 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          p: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <StorageIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                Veritabanı Yönetimi
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Tüm veritabanı işlemlerini buradan yönetin
              </Typography>
            </Box>
          </Box>
          <Chip 
            label="Admin Panel" 
            sx={{ 
              background: 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)',
              color: 'white',
              fontWeight: 'bold',
              px: 2,
              py: 2.5,
              fontSize: '0.9rem'
            }} 
          />
        </Box>

        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 152, 0, 0.3)'
          }}
        >
          <strong>Dikkat:</strong> Bu sayfa veritabanında doğrudan değişiklik yapmanıza izin verir. 
          Dikkatli kullanın!
        </Alert>

        {/* Tabs */}
        <Paper sx={{ 
          mb: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                minHeight: 64
              },
              '& .Mui-selected': {
                color: '#2b6cb0 !important'
              },
              '& .MuiTabs-indicator': {
                height: 3,
                background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)'
              }
            }}
          >
            <Tab icon={<TableIcon />} iconPosition="start" label="Tablolar" />
            <Tab icon={<CodeIcon />} iconPosition="start" label="SQL Sorguları" />
            <Tab icon={<StatsIcon />} iconPosition="start" label="İstatistikler" />
          </Tabs>
        </Paper>

      {/* Tab 0: Tables */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Sol: Tablo Listesi */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ 
              p: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Tablolar
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={loadTables}
                  sx={{ 
                    background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3182ce 0%, #4299e1 100%)'
                    }
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Box>
              <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                {tables.map((table) => (
                  <ListItemButton
                    key={table.table_name}
                    selected={selectedTable === table.table_name}
                    onClick={() => loadTableData(table.table_name)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)'
                        },
                        '& .MuiListItemText-secondary': {
                          color: 'rgba(255, 255, 255, 0.8)'
                        }
                      }
                    }}
                  >
                    <ListItemText
                      primary={table.table_name}
                      secondary={`${table.row_count} kayıt`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Sağ: Tablo Verisi */}
          <Grid item xs={12} md={9}>
            {selectedTable ? (
              <Paper sx={{ 
                p: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold" sx={{ 
                    background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {selectedTable}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => exportTable(selectedTable)}
                      sx={{
                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)'
                        }
                      }}
                    >
                      Export CSV
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={() => loadTableData(selectedTable)}
                      sx={{
                        borderColor: '#2b6cb0',
                        color: '#2b6cb0',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#3182ce',
                          background: 'rgba(43, 108, 176, 0.1)'
                        }
                      }}
                    >
                      Yenile
                    </Button>
                  </Box>
                </Box>

                {loadingTable ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer sx={{ maxHeight: 600 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          {columns.map((col) => (
                            <TableCell key={col.column_name}>
                              <strong>{col.column_name}</strong>
                              <br />
                              <Typography variant="caption" color="text.secondary">
                                {col.data_type}
                              </Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableData.map((row, idx) => (
                          <TableRow key={idx} hover>
                            {columns.map((col) => (
                              <TableCell key={col.column_name}>
                                {row[col.column_name] === null ? (
                                  <Typography variant="body2" color="text.secondary">NULL</Typography>
                                ) : typeof row[col.column_name] === 'boolean' ? (
                                  <Chip
                                    label={row[col.column_name] ? 'true' : 'false'}
                                    size="small"
                                    color={row[col.column_name] ? 'success' : 'default'}
                                  />
                                ) : (
                                  String(row[col.column_name])
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Toplam {tableData.length} kayıt gösteriliyor
                </Typography>
              </Paper>
            ) : (
              <Paper sx={{ 
                p: 6, 
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
              }}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
                  borderRadius: '50%',
                  width: 100,
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3
                }}>
                  <TableIcon sx={{ fontSize: 50, color: 'white' }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ 
                  background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Görüntülemek için bir tablo seçin
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sol menüden bir tablo seçerek verilerini görüntüleyebilirsiniz
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}

      {/* Tab 1: SQL Queries */}
      {tabValue === 1 && (
        <Paper sx={{ 
          p: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ 
            background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3
          }}>
            SQL Sorgusu Çalıştır
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={10}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="SELECT * FROM patients WHERE ..."
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                background: 'rgba(43, 108, 176, 0.05)',
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(43, 108, 176, 0.3)',
                  borderWidth: 2
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(43, 108, 176, 0.5)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2b6cb0'
                }
              }
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={sqlLoading ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
              onClick={executeSQL}
              disabled={sqlLoading}
              sx={{
                background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)'
                }
              }}
            >
              Çalıştır
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                setSqlQuery('');
                setSqlResult(null);
                setSqlError(null);
              }}
              sx={{
                borderColor: '#2b6cb0',
                color: '#2b6cb0',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  borderColor: '#3182ce',
                  background: 'rgba(43, 108, 176, 0.1)'
                }
              }}
            >
              Temizle
            </Button>
          </Box>

          {sqlError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {sqlError}
            </Alert>
          )}

          {sqlResult && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Sorgu başarıyla çalıştırıldı. {sqlResult.rowCount} satır etkilendi.
              </Alert>

              {sqlResult.rows && sqlResult.rows.length > 0 && (
                <TableContainer sx={{ maxHeight: 400 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {Object.keys(sqlResult.rows[0]).map((key) => (
                          <TableCell key={key}><strong>{key}</strong></TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sqlResult.rows.map((row: any, idx: number) => (
                        <TableRow key={idx}>
                          {Object.values(row).map((val: any, i: number) => (
                            <TableCell key={i}>
                              {val === null ? 'NULL' : String(val)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </Paper>
      )}

      {/* Tab 2: Statistics */}
      {tabValue === 2 && (
        <Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={loadStats}
            sx={{ 
              mb: 3,
              background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)'
              }
            }}
          >
            İstatistikleri Yükle
          </Button>

          {loadingStats ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : stats ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px 0 rgba(43, 108, 176, 0.4)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px 0 rgba(43, 108, 176, 0.5)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, fontWeight: 600 }}>
                      Toplam Hasta
                    </Typography>
                    <Typography variant="h2" fontWeight="bold">
                      {stats.totalPatients || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px 0 rgba(229, 62, 62, 0.4)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px 0 rgba(229, 62, 62, 0.5)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, fontWeight: 600 }}>
                      Model Eğitim Datası
                    </Typography>
                    <Typography variant="h2" fontWeight="bold">
                      {stats.trainingData || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px 0 rgba(79, 172, 254, 0.4)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px 0 rgba(79, 172, 254, 0.5)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, fontWeight: 600 }}>
                      Kullanıcılar
                    </Typography>
                    <Typography variant="h2" fontWeight="bold">
                      {stats.totalUsers || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
                }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ 
                    background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 3
                  }}>
                    Tablo Detayları
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Tablo</strong></TableCell>
                          <TableCell><strong>Kayıt Sayısı</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats.tableStats && stats.tableStats.map((table: any) => (
                          <TableRow key={table.name}>
                            <TableCell>{table.name}</TableCell>
                            <TableCell>{table.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Paper sx={{ 
              p: 6, 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
            }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
                borderRadius: '50%',
                width: 100,
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 3
              }}>
                <StatsIcon sx={{ fontSize: 50, color: 'white' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ 
                background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                İstatistikleri görmek için butona tıklayın
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Veritabanı istatistiklerini görüntülemek için yukarıdaki butonu kullanın
              </Typography>
            </Paper>
          )}
        </Box>
      )}
      </Container>
    </Box>
  );
}

