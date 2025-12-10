'use client';
import { useEffect, useMemo, useState } from 'react';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import Snackbar from '@mui/joy/Snackbar';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DocumentDetailsModal from '../components/DocumentDetailsModal';
import { JsonPlaceholderPost, DocumentRow } from '../types/types';
type SortKey = 'fileName' | 'version' | 'sizeKb' | 'uploadedAtTs';
const mapPostToDocument = (post: JsonPlaceholderPost): DocumentRow => {
  const sizeKb = 10 + post.body.length;
  const date = new Date();
  date.setDate(date.getDate() - post.id);
  return {
    id: post.id,
    fileName: post.title,
    version: `v${(post.id % 3) + 1}.0`,
    size: `${sizeKb} KB`,
    sizeKb,
    uploadedAt: date.toLocaleDateString(),
    uploadedAtTs: date.getTime(),
    original: post,
  };
};
export default function DocumentsTable() {
  const [rows, setRows] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<DocumentRow | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('uploadedAtTs');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=10',
        );

        if (!res.ok) throw new Error('Failed to fetch documents');

        const data: JsonPlaceholderPost[] = await res.json();
        setRows(data.map(mapPostToDocument));
      } catch (e) {
        setError(
          e instanceof Error ? e.message : 'Unexpected error while loading',
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = q
      ? rows.filter((r) => r.fileName.toLowerCase().includes(q))
      : rows;

    return [...filtered].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      const av = a[sortBy];
      const bv = b[sortBy];

      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * dir;
      }

      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [rows, search, sortBy, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((p) => (p === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const sortIcon = (key: SortKey) => {
    if (sortBy !== key) return null;
    return sortDir === 'asc' ? (
      <ArrowUpwardIcon fontSize="small" />
    ) : (
      <ArrowDownwardIcon fontSize="small" />
    );
  };
  const handleAnalyze = async () => {
    if (!selected) return;

    try {
      setAnalyzing(true);
      await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: selected.id }),
      });
      setSnackbar('Анализ выполнен');
    } catch {
      setSnackbar('Ошибка анализа');
    } finally {
      setAnalyzing(false);
    }
  };
  return (
    <>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography level="h3">Документы</Typography>
          <Typography level="body-sm" color="neutral">
            Управление загруженными документами
          </Typography>
        </Box>

        <Input
          size="sm"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startDecorator={<SearchIcon />}
          sx={{ minWidth: { xs: '100%', sm: 260 } }}
        />
      </Box>
      <Sheet
        variant="outlined"
        sx={{
          width: '100%',
          borderRadius: 'md',
          overflowX: 'auto',
          bgcolor: 'background.surface',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Table
          stickyHeader
          hoverRow
          aria-label="Documents table"
          sx={{
            minWidth: { xs: 520, sm: 700 },
            '--TableCell-paddingY': { xs: '8px', sm: '12px' },
            '--TableCell-paddingX': { xs: '10px', sm: '16px' },
          }}
        >
          <thead>
            <tr>
              <th>
                <Button
                  size="sm"
                  variant="plain"
                  onClick={() => toggleSort('fileName')}
                  endDecorator={sortIcon('fileName')}
                >
                  Название
                </Button>
              </th>
              <th className="hide-mobile">
                <Button
                  size="sm"
                  variant="plain"
                  onClick={() => toggleSort('version')}
                  endDecorator={sortIcon('version')}
                >
                  Версия
                </Button>
              </th>
              <th className="hide-mobile">
                <Button
                  size="sm"
                  variant="plain"
                  onClick={() => toggleSort('sizeKb')}
                  endDecorator={sortIcon('sizeKb')}
                >
                  Размер
                </Button>
              </th>
              <th>
                <Button
                  size="sm"
                  variant="plain"
                  onClick={() => toggleSort('uploadedAtTs')}
                  endDecorator={sortIcon('uploadedAtTs')}
                >
                  Дата
                </Button>
              </th>
              <th>Действия</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} style={{ padding: 20 }}>
                  Загрузка…
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={5} style={{ padding: 20, color: 'red' }}>
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && filteredRows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 20 }}>
                  Ничего не найдено
                </td>
              </tr>
            )}

            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td>
                  <Typography level="body-sm" noWrap>
                    {row.fileName}
                  </Typography>
                </td>
                <td className="hide-mobile">{row.version}</td>
                <td className="hide-mobile">{row.size}</td>
                <td>{row.uploadedAt}</td>
                <td>
                  <Link
                    component="button"
                    onClick={() => setSelected(row)}
                  >
                    Подробнее
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <DocumentDetailsModal
        open={!!selected}
        document={selected}
        analyzing={analyzing}
        onClose={() => setSelected(null)}
        onAnalyze={handleAnalyze}
      />
      <Snackbar
        open={!!snackbar}
        autoHideDuration={2000}
        onClose={() => setSnackbar(null)}
      >
        {snackbar}
      </Snackbar>
    </>
  );
}
