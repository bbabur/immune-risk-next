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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <StorageIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Veritabanı Yönetimi
          </Typography>
        </Box>
        <Chip label="Admin Panel" color="error" />
      </Box>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <strong>Dikkat:</strong> Bu sayfa veritabanında doğrudan değişiklik yapmanıza izin verir. 
        Dikkatli kullanın!
      </Alert>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab icon={<TableIcon />} label="Tablolar" />
          <Tab icon={<CodeIcon />} label="SQL Sorguları" />
          <Tab icon={<StatsIcon />} label="İstatistikler" />
        </Tabs>
      </Paper>

      {/* Tab 0: Tables */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Sol: Tablo Listesi */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Tablolar</Typography>
                <IconButton size="small" onClick={loadTables}>
                  <RefreshIcon />
                </IconButton>
              </Box>
              <List>
                {tables.map((table) => (
                  <ListItemButton
                    key={table.table_name}
                    selected={selectedTable === table.table_name}
                    onClick={() => loadTableData(table.table_name)}
                  >
                    <ListItemText
                      primary={table.table_name}
                      secondary={`${table.row_count} kayıt`}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Sağ: Tablo Verisi */}
          <Grid item xs={12} md={9}>
            {selectedTable ? (
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{selectedTable}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => exportTable(selectedTable)}
                    >
                      Export CSV
                    </Button>
                    <Button
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={() => loadTableData(selectedTable)}
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
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <TableIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Görüntülemek için bir tablo seçin
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}

      {/* Tab 1: SQL Queries */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            SQL Sorgusu Çalıştır
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={8}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="SELECT * FROM patients WHERE ..."
            sx={{ mb: 2, fontFamily: 'monospace' }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={sqlLoading ? <CircularProgress size={20} /> : <PlayIcon />}
              onClick={executeSQL}
              disabled={sqlLoading}
            >
              Çalıştır
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setSqlQuery('');
                setSqlResult(null);
                setSqlError(null);
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
            startIcon={<RefreshIcon />}
            onClick={loadStats}
            sx={{ mb: 3 }}
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
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Toplam Hasta
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {stats.totalPatients || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Model Eğitim Datası
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {stats.trainingData || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Kullanıcılar
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {stats.totalUsers || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
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
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <StatsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                İstatistikleri görmek için "İstatistikleri Yükle" butonuna tıklayın
              </Typography>
            </Paper>
          )}
        </Box>
      )}
    </Container>
  );
}

