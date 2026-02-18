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
  Grid,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Storage as StorageIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  TableChart as TableIcon,
  Code as CodeIcon,
  Assessment as StatsIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  List as ListIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  DataUsage as DataUsageIcon,
  Schedule as ScheduleIcon,
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

  // New tabs data
  const [overview, setOverview] = useState<any>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [indexes, setIndexes] = useState<any>(null);
  const [loadingIndexes, setLoadingIndexes] = useState(false);
  const [sessions, setSessions] = useState<any>(null);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [queries, setQueries] = useState<any>(null);
  const [loadingQueries, setLoadingQueries] = useState(false);
  const [tableSizes, setTableSizes] = useState<any>(null);
  const [loadingTableSizes, setLoadingTableSizes] = useState(false);

  // Kill session dialog
  const [killDialogOpen, setKillDialogOpen] = useState(false);
  const [selectedPid, setSelectedPid] = useState<number | null>(null);

  useEffect(() => {
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
    loadOverview();
    setLoading(false);
  }, [router]);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  const loadTables = async () => {
    try {
      const response = await fetch('/api/admin/database/tables', {
        headers: getAuthHeaders()
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
      const response = await fetch(`/api/admin/database/table-data?table=${tableName}`, {
        headers: getAuthHeaders()
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

  const loadOverview = async () => {
    setLoadingOverview(true);
    try {
      const response = await fetch('/api/admin/database/overview', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setOverview(data);
      }
    } catch (error) {
      console.error('Overview yüklenemedi:', error);
    } finally {
      setLoadingOverview(false);
    }
  };

  const loadIndexes = async () => {
    setLoadingIndexes(true);
    try {
      const response = await fetch('/api/admin/database/indexes', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setIndexes(data);
      }
    } catch (error) {
      console.error('Indexes yüklenemedi:', error);
    } finally {
      setLoadingIndexes(false);
    }
  };

  const loadSessions = async () => {
    setLoadingSessions(true);
    try {
      const response = await fetch('/api/admin/database/sessions', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Sessions yüklenemedi:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const loadQueries = async () => {
    setLoadingQueries(true);
    try {
      const response = await fetch('/api/admin/database/queries', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setQueries(data);
      }
    } catch (error) {
      console.error('Queries yüklenemedi:', error);
    } finally {
      setLoadingQueries(false);
    }
  };

  const loadTableSizes = async () => {
    setLoadingTableSizes(true);
    try {
      const response = await fetch('/api/admin/database/table-sizes', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setTableSizes(data);
      }
    } catch (error) {
      console.error('Table sizes yüklenemedi:', error);
    } finally {
      setLoadingTableSizes(false);
    }
  };

  const executeSQL = async () => {
    setSqlLoading(true);
    setSqlError(null);
    setSqlResult(null);
    
    try {
      const response = await fetch('/api/admin/database/execute', {
        method: 'POST',
        headers: getAuthHeaders(),
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
      const response = await fetch('/api/admin/database/stats', {
        headers: getAuthHeaders()
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
      const response = await fetch(`/api/admin/database/export?table=${tableName}`, {
        headers: getAuthHeaders()
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

  const killSession = async () => {
    if (!selectedPid) return;
    
    try {
      const response = await fetch(`/api/admin/database/sessions?pid=${selectedPid}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        loadSessions();
      } else {
        alert(data.error || 'Session sonlandırılamadı');
      }
    } catch (error) {
      alert('Hata oluştu');
    } finally {
      setKillDialogOpen(false);
      setSelectedPid(null);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
    return `${Math.round(seconds / 86400)}d`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'idle': return 'default';
      case 'idle in transaction': return 'warning';
      default: return 'default';
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
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
              borderRadius: 2,
              p: 1.5,
            }}>
              <StorageIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                Database Admin Panel
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                PostgreSQL veritabanı yönetimi ve izleme
              </Typography>
            </Box>
          </Box>
          <Chip 
            label="Enterprise Admin" 
            sx={{ 
              background: 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)',
              color: 'white',
              fontWeight: 'bold',
            }} 
          />
        </Box>

        {/* Tabs */}
        <Paper sx={{ 
          mb: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 64
              },
            }}
          >
            <Tab icon={<SpeedIcon />} iconPosition="start" label="Genel Bakış" />
            <Tab icon={<TableIcon />} iconPosition="start" label="Tablolar" />
            <Tab icon={<DataUsageIcon />} iconPosition="start" label="Tablo Boyutları" />
            <Tab icon={<ListIcon />} iconPosition="start" label="İndeksler" />
            <Tab icon={<MemoryIcon />} iconPosition="start" label="Oturumlar" />
            <Tab icon={<ScheduleIcon />} iconPosition="start" label="Sorgular" />
            <Tab icon={<CodeIcon />} iconPosition="start" label="SQL Çalıştır" />
            <Tab icon={<StatsIcon />} iconPosition="start" label="İstatistikler" />
          </Tabs>
        </Paper>

        {/* Tab 0: Overview */}
        {tabValue === 0 && (
          <Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadOverview}
              disabled={loadingOverview}
              sx={{ mb: 3, background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)' }}
            >
              {loadingOverview ? 'Yükleniyor...' : 'Yenile'}
            </Button>

            {overview ? (
              <Grid container spacing={3}>
                {/* Database Info Cards */}
                <Grid item xs={12} md={3}>
                  <Card sx={{ background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Veritabanı</Typography>
                      <Typography variant="h5" fontWeight="bold">{overview.database?.database_name}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>PostgreSQL {overview.database?.pg_version}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ background: 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Veritabanı Boyutu</Typography>
                      <Typography variant="h5" fontWeight="bold">{overview.database?.database_size}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Aktif Bağlantılar</Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {overview.database?.active_connections} / {overview.database?.max_connections}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Cache Hit Ratio</Typography>
                      <Typography variant="h5" fontWeight="bold">{overview.cache?.cache_hit_ratio}%</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={parseFloat(overview.cache?.cache_hit_ratio) || 0} 
                        sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Connection Stats */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Bağlantı Durumları</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Durum</TableCell>
                            <TableCell align="right">Sayı</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {overview.connectionStats?.map((stat: any) => (
                            <TableRow key={stat.state}>
                              <TableCell>
                                <Chip label={stat.state || 'null'} size="small" color={getStatusColor(stat.state) as any} />
                              </TableCell>
                              <TableCell align="right">{stat.count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>

                {/* Maintenance Status */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Bakım Durumu (Top 5 Dead Tuples)</Typography>
                    <TableContainer sx={{ maxHeight: 300 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Tablo</TableCell>
                            <TableCell align="right">Canlı</TableCell>
                            <TableCell align="right">Ölü</TableCell>
                            <TableCell>Son Vacuum</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {overview.maintenance?.slice(0, 5).map((m: any) => (
                            <TableRow key={m.table_name}>
                              <TableCell>{m.table_name}</TableCell>
                              <TableCell align="right">{m.live_tuples?.toLocaleString()}</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={m.dead_tuples?.toLocaleString()} 
                                  size="small" 
                                  color={m.dead_tuples > 1000 ? 'warning' : 'default'}
                                />
                              </TableCell>
                              <TableCell>
                                {m.last_autovacuum 
                                  ? new Date(m.last_autovacuum).toLocaleDateString('tr-TR')
                                  : 'Hiç'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            ) : (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <SpeedIcon sx={{ fontSize: 60, color: '#2b6cb0', mb: 2 }} />
                <Typography variant="h6">Veritabanı bilgilerini yüklemek için butona tıklayın</Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Tab 1: Tables */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Tablolar</Typography>
                  <IconButton size="small" onClick={loadTables}>
                    <RefreshIcon />
                  </IconButton>
                </Box>
                {tables.map((table) => (
                  <Button
                    key={table.table_name}
                    fullWidth
                    variant={selectedTable === table.table_name ? 'contained' : 'outlined'}
                    onClick={() => loadTableData(table.table_name)}
                    sx={{ mb: 1, justifyContent: 'space-between', textTransform: 'none' }}
                  >
                    <span>{table.table_name}</span>
                    <Chip label={table.row_count} size="small" />
                  </Button>
                ))}
              </Paper>
            </Grid>
            <Grid item xs={12} md={9}>
              {selectedTable ? (
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold">{selectedTable}</Typography>
                    <Button startIcon={<DownloadIcon />} onClick={() => exportTable(selectedTable)}>
                      Export CSV
                    </Button>
                  </Box>
                  {loadingTable ? (
                    <CircularProgress />
                  ) : (
                    <TableContainer sx={{ maxHeight: 500 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            {columns.map((col) => (
                              <TableCell key={col.column_name}>
                                <strong>{col.column_name}</strong>
                                <br />
                                <Typography variant="caption" color="text.secondary">{col.data_type}</Typography>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableData.map((row, idx) => (
                            <TableRow key={idx} hover>
                              {columns.map((col) => (
                                <TableCell key={col.column_name}>
                                  {row[col.column_name] === null ? <em>NULL</em> : String(row[col.column_name]).slice(0, 100)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Paper>
              ) : (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                  <TableIcon sx={{ fontSize: 60, color: '#2b6cb0', mb: 2 }} />
                  <Typography variant="h6">Görüntülemek için bir tablo seçin</Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}

        {/* Tab 2: Table Sizes */}
        {tabValue === 2 && (
          <Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadTableSizes}
              disabled={loadingTableSizes}
              sx={{ mb: 3, background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)' }}
            >
              {loadingTableSizes ? 'Yükleniyor...' : 'Tablo Boyutlarını Yükle'}
            </Button>

            {tableSizes ? (
              <Grid container spacing={3}>
                {/* Summary Cards */}
                <Grid item xs={12} md={3}>
                  <Card sx={{ background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2">Toplam Veritabanı</Typography>
                      <Typography variant="h5" fontWeight="bold">{tableSizes.summary?.total_database_size}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ background: 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2">Veri Boyutu</Typography>
                      <Typography variant="h5" fontWeight="bold">{tableSizes.summary?.total_data_size}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2">İndeks Boyutu</Typography>
                      <Typography variant="h5" fontWeight="bold">{tableSizes.summary?.total_index_size}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2">Toplam Satır</Typography>
                      <Typography variant="h5" fontWeight="bold">{tableSizes.summary?.total_rows?.toLocaleString()}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Table Sizes */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Tablo Boyutları</Typography>
                    <TableContainer sx={{ maxHeight: 400 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tablo</TableCell>
                            <TableCell align="right">Satır</TableCell>
                            <TableCell align="right">Toplam</TableCell>
                            <TableCell align="right">Veri</TableCell>
                            <TableCell align="right">İndeks</TableCell>
                            <TableCell align="right">Bloat %</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableSizes.tables?.map((t: any) => (
                            <TableRow key={t.table_name} hover>
                              <TableCell>{t.table_name}</TableCell>
                              <TableCell align="right">{t.row_count?.toLocaleString()}</TableCell>
                              <TableCell align="right">{t.total_size}</TableCell>
                              <TableCell align="right">{t.table_size}</TableCell>
                              <TableCell align="right">{t.index_size}</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={`${t.bloat_ratio}%`} 
                                  size="small" 
                                  color={t.bloat_ratio > 20 ? 'error' : t.bloat_ratio > 10 ? 'warning' : 'success'}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>

                {/* Vacuum Recommendations */}
                {tableSizes.vacuumNeeded?.length > 0 && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.main">
                        <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        VACUUM Önerileri
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Tablo</TableCell>
                              <TableCell align="right">Ölü Tuple</TableCell>
                              <TableCell align="right">Ölü Oranı</TableCell>
                              <TableCell>Öneri</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tableSizes.vacuumNeeded.map((v: any) => (
                              <TableRow key={v.table_name}>
                                <TableCell>{v.table_name}</TableCell>
                                <TableCell align="right">{v.dead_tuples?.toLocaleString()}</TableCell>
                                <TableCell align="right">{v.dead_ratio}%</TableCell>
                                <TableCell>
                                  <Chip label={v.recommendation} size="small" color="warning" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <DataUsageIcon sx={{ fontSize: 60, color: '#2b6cb0', mb: 2 }} />
                <Typography variant="h6">Tablo boyutlarını görmek için butona tıklayın</Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Tab 3: Indexes */}
        {tabValue === 3 && (
          <Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadIndexes}
              disabled={loadingIndexes}
              sx={{ mb: 3, background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)' }}
            >
              {loadingIndexes ? 'Yükleniyor...' : 'İndeksleri Yükle'}
            </Button>

            {indexes ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2">Toplam İndeks Sayısı</Typography>
                      <Typography variant="h4" fontWeight="bold">{indexes.summary?.total_indexes}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ background: 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2">Toplam İndeks Boyutu</Typography>
                      <Typography variant="h4" fontWeight="bold">{indexes.summary?.total_index_size}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Index Health */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>İndeks Sağlığı</Typography>
                    <TableContainer sx={{ maxHeight: 400 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tablo</TableCell>
                            <TableCell>İndeks</TableCell>
                            <TableCell align="right">Boyut</TableCell>
                            <TableCell align="right">Scan</TableCell>
                            <TableCell>Durum</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {indexes.indexHealth?.map((idx: any, i: number) => (
                            <TableRow key={i} hover>
                              <TableCell>{idx.table_name}</TableCell>
                              <TableCell>{idx.index_name}</TableCell>
                              <TableCell align="right">{idx.index_size}</TableCell>
                              <TableCell align="right">{idx.index_scans || 0}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={idx.status} 
                                  size="small" 
                                  color={idx.status === 'Normal' ? 'success' : idx.status === 'Kullanılmıyor' ? 'error' : 'warning'}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            ) : (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <ListIcon sx={{ fontSize: 60, color: '#2b6cb0', mb: 2 }} />
                <Typography variant="h6">İndeks bilgilerini görmek için butona tıklayın</Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Tab 4: Sessions */}
        {tabValue === 4 && (
          <Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadSessions}
              disabled={loadingSessions}
              sx={{ mb: 3, background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)' }}
            >
              {loadingSessions ? 'Yükleniyor...' : 'Oturumları Yükle'}
            </Button>

            {sessions ? (
              <Grid container spacing={3}>
                {/* Summary Cards */}
                <Grid item xs={6} md={2}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">{sessions.summary?.total_sessions || 0}</Typography>
                    <Typography variant="body2">Toplam</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="success.main">{sessions.summary?.active || 0}</Typography>
                    <Typography variant="body2">Aktif</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="text.secondary">{sessions.summary?.idle || 0}</Typography>
                    <Typography variant="body2">Boşta</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">{sessions.summary?.idle_in_transaction || 0}</Typography>
                    <Typography variant="body2">İşlemde Boşta</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="error.main">{sessions.summary?.waiting || 0}</Typography>
                    <Typography variant="body2">Bekliyor</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="error.main">{sessions.blocking?.length || 0}</Typography>
                    <Typography variant="body2">Bloke Eden</Typography>
                  </Card>
                </Grid>

                {/* Blocking Sessions Alert */}
                {sessions.blocking?.length > 0 && (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      <strong>Dikkat!</strong> {sessions.blocking.length} bloke eden oturum var!
                    </Alert>
                  </Grid>
                )}

                {/* Sessions Table */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Aktif Oturumlar</Typography>
                    <TableContainer sx={{ maxHeight: 400 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>PID</TableCell>
                            <TableCell>Kullanıcı</TableCell>
                            <TableCell>Uygulama</TableCell>
                            <TableCell>Durum</TableCell>
                            <TableCell>Süre</TableCell>
                            <TableCell>Sorgu</TableCell>
                            <TableCell>İşlem</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sessions.sessions?.map((s: any) => (
                            <TableRow key={s.pid} hover>
                              <TableCell>{s.pid}</TableCell>
                              <TableCell>{s.username}</TableCell>
                              <TableCell>{s.application_name?.slice(0, 20)}</TableCell>
                              <TableCell>
                                <Chip label={s.state} size="small" color={getStatusColor(s.state) as any} />
                              </TableCell>
                              <TableCell>{formatDuration(s.connection_duration_seconds)}</TableCell>
                              <TableCell>
                                <Tooltip title={s.query_preview || ''}>
                                  <span>{s.query_preview?.slice(0, 50)}...</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => {
                                    setSelectedPid(s.pid);
                                    setKillDialogOpen(true);
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            ) : (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <MemoryIcon sx={{ fontSize: 60, color: '#2b6cb0', mb: 2 }} />
                <Typography variant="h6">Oturum bilgilerini görmek için butona tıklayın</Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Tab 5: Queries */}
        {tabValue === 5 && (
          <Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadQueries}
              disabled={loadingQueries}
              sx={{ mb: 3, background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)' }}
            >
              {loadingQueries ? 'Yükleniyor...' : 'Sorguları Yükle'}
            </Button>

            {queries ? (
              <Grid container spacing={3}>
                {/* Summary */}
                <Grid item xs={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">{queries.summary?.active_queries || 0}</Typography>
                    <Typography variant="body2">Aktif Sorgu</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">{queries.summary?.long_running_30s || 0}</Typography>
                    <Typography variant="body2">&gt;30s Sorgu</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="error.main">{queries.summary?.long_running_60s || 0}</Typography>
                    <Typography variant="body2">&gt;60s Sorgu</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {queries.summary?.longest_running_seconds 
                        ? formatDuration(queries.summary.longest_running_seconds) 
                        : '-'}
                    </Typography>
                    <Typography variant="body2">En Uzun Sorgu</Typography>
                  </Card>
                </Grid>

                {/* Long Running Queries */}
                {queries.longRunning?.length > 0 && (
                  <Grid item xs={12}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      {queries.longRunning.length} uzun süren sorgu var!
                    </Alert>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.main">
                        Uzun Süren Sorgular (&gt;5s)
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>PID</TableCell>
                              <TableCell>Kullanıcı</TableCell>
                              <TableCell>Süre</TableCell>
                              <TableCell>Sorgu</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {queries.longRunning.map((q: any) => (
                              <TableRow key={q.pid}>
                                <TableCell>{q.pid}</TableCell>
                                <TableCell>{q.username}</TableCell>
                                <TableCell>
                                  <Chip label={formatDuration(q.duration_seconds)} color="warning" size="small" />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                    {q.query_text?.slice(0, 200)}...
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Grid>
                )}

                {/* Query Stats */}
                {queries.hasStatStatements && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        En Yavaş Sorgular (pg_stat_statements)
                      </Typography>
                      <TableContainer sx={{ maxHeight: 400 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Sorgu</TableCell>
                              <TableCell align="right">Çağrı</TableCell>
                              <TableCell align="right">Toplam (ms)</TableCell>
                              <TableCell align="right">Ort (ms)</TableCell>
                              <TableCell align="right">Cache Hit</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {queries.queryStats?.slice(0, 10).map((q: any, i: number) => (
                              <TableRow key={i}>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                    {q.query_text?.slice(0, 100)}...
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">{q.calls?.toLocaleString()}</TableCell>
                                <TableCell align="right">{Math.round(q.total_time_ms)?.toLocaleString()}</TableCell>
                                <TableCell align="right">{q.avg_time_ms?.toFixed(2)}</TableCell>
                                <TableCell align="right">{q.cache_hit_ratio}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <ScheduleIcon sx={{ fontSize: 60, color: '#2b6cb0', mb: 2 }} />
                <Typography variant="h6">Sorgu bilgilerini görmek için butona tıklayın</Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Tab 6: SQL Execute */}
        {tabValue === 6 && (
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <strong>Dikkat:</strong> Bu sayfa veritabanında doğrudan SQL çalıştırmanıza izin verir. Dikkatli kullanın!
            </Alert>
            <Typography variant="h5" fontWeight="bold" gutterBottom>SQL Sorgusu Çalıştır</Typography>
            
            <TextField
              fullWidth
              multiline
              rows={8}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="SELECT * FROM patients WHERE ..."
              sx={{ mb: 3, fontFamily: 'monospace' }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={sqlLoading ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
                onClick={executeSQL}
                disabled={sqlLoading}
              >
                Çalıştır
              </Button>
              <Button variant="outlined" onClick={() => { setSqlQuery(''); setSqlResult(null); setSqlError(null); }}>
                Temizle
              </Button>
            </Box>

            {sqlError && <Alert severity="error" sx={{ mb: 2 }}>{sqlError}</Alert>}

            {sqlResult && (
              <Box>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Sorgu başarıyla çalıştırıldı. {sqlResult.rowCount} satır.
                </Alert>
                {sqlResult.rows?.length > 0 && (
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
                              <TableCell key={i}>{val === null ? 'NULL' : String(val)}</TableCell>
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

        {/* Tab 7: Statistics */}
        {tabValue === 7 && (
          <Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadStats}
              disabled={loadingStats}
              sx={{ mb: 3, background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)' }}
            >
              {loadingStats ? 'Yükleniyor...' : 'İstatistikleri Yükle'}
            </Button>

            {stats ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2">Toplam Hasta</Typography>
                      <Typography variant="h3" fontWeight="bold">{stats.totalPatients || 0}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2">Eğitim Verisi</Typography>
                      <Typography variant="h3" fontWeight="bold">{stats.trainingData || 0}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ background: 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="body2">Kullanıcılar</Typography>
                      <Typography variant="h3" fontWeight="bold">{stats.totalUsers || 0}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Tablo Detayları</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Tablo</TableCell>
                            <TableCell align="right">Kayıt Sayısı</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {stats.tableStats?.map((table: any) => (
                            <TableRow key={table.name}>
                              <TableCell>{table.name}</TableCell>
                              <TableCell align="right">{table.count?.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            ) : (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <StatsIcon sx={{ fontSize: 60, color: '#2b6cb0', mb: 2 }} />
                <Typography variant="h6">İstatistikleri görmek için butona tıklayın</Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Kill Session Dialog */}
        <Dialog open={killDialogOpen} onClose={() => setKillDialogOpen(false)}>
          <DialogTitle>Oturumu Sonlandır</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mt: 1 }}>
              PID {selectedPid} numaralı oturumu sonlandırmak istediğinize emin misiniz?
              Bu işlem geri alınamaz!
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setKillDialogOpen(false)}>İptal</Button>
            <Button onClick={killSession} color="error" variant="contained">
              Sonlandır
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
