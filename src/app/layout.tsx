'use client';
import type { ReactNode } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Link from '@mui/joy/Link';
import { usePathname } from 'next/navigation';
import type { NavItem } from './types/types';
const NAV_ITEMS: NavItem[] = [
  { label: 'Документы', href: '/documents' },
  { label: 'Чат', href: '/chat' },
];
export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <html lang="ru">
      <body>
        <CssVarsProvider>
          <CssBaseline />
          <Sheet
            variant="outlined"
            sx={{
              height: { xs: 48, sm: 56 },
              px: { xs: 1, sm: 3 },
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 1, sm: 2 },
                width: '100%',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    underline="none"
                    color={isActive ? 'primary' : 'neutral'}
                    sx={{
                      fontWeight: 500,
                      px: { xs: 2, sm: 1.5 },
                      py: { xs: 0.75, sm: 0.5 },
                      borderRadius: 'sm',
                      whiteSpace: 'nowrap',
                      bgcolor: isActive
                        ? 'primary.softBg'
                        : 'transparent',
                      '&:hover': {
                        bgcolor: isActive
                          ? 'primary.softBg'
                          : 'neutral.softBg',
                      },
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </Box>
          </Sheet>
          <Box
            component="main"
            sx={{
              py: { xs: 1.5, sm: 2 },
              px: { xs: 1, sm: 0 },
              maxWidth: 1200,
              mx: 'auto',
            }}
          >
            {children}
          </Box>
        </CssVarsProvider>
      </body>
    </html>
  );
}
