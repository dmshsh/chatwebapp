'use client';
import { useEffect,useState,useRef } from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/joy/Stack';
import Snackbar from '@mui/joy/Snackbar';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import type { ChatMessage } from '../types/types';
const WS_URL = 'wss://ws.ifelse.io';
export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] =useState('');
  const [snackbar, setSnackbar] =useState<string | null>(null);
  const wsRef =useRef<WebSocket | null>(null);
  const msgIdRef = useRef(1);
    useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    
    ws.onopen = () => {
      console.log('[WS] connected');
      setSnackbar('WS connected');
    };

    ws.onmessage = (event) => {
      const text = String(event.data || '');
      if (!text) return;

      setMessages((prev) => [
        ...prev,
        {
          id: msgIdRef.current++,
          from: 'assistant',
          text,
        },
      ]);
    };

    ws.onerror = (e) => {
      console.error('[WS] error', e);
      setSnackbar('WS error.');
    };

    ws.onclose = (e) => {
      console.log('[WS] closed', e.code, e.reason);
      setSnackbar('Connection closed.');
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    const ws = wsRef.current;
    if (!trimmed || !ws || ws.readyState !== WebSocket.OPEN) return;
    setMessages((prev) => [
      ...prev,
      {
        id: msgIdRef.current++,
        from: 'user',
        text: trimmed,
      },
    ]);

    ws.send(trimmed);
    setInput('');
  };
  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: { xs: 'calc(100dvh - 80px)', md: '70vh' },
      }}
    >
      <Typography level="h3" component="h1">
        Чат
      </Typography>
      <Sheet
        variant="outlined"
        sx={{
          flex: 1,
          p: 2,
          borderRadius: 'md',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          bgcolor: 'background.surface',
        }}
      >
        {messages.length === 0 && (
          <Typography level="body-sm" color="neutral">
            Напишите сообщение, чтобы начать диалог.
          </Typography>
        )}

        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent:
                msg.from === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Box
              sx={{
                maxWidth: { xs: '80%', md: '60%' },
                px: 1.5,
                py: 1,
                borderRadius: 12,
                bgcolor:
                  msg.from === 'user' ? 'primary.solidBg' : 'neutral.softBg',
                color:
                  msg.from === 'user'
                    ? 'primary.solidColor'
                    : 'text.primary',
              }}
            >
              <Typography level="body-sm">{msg.text}</Typography>
            </Box>
          </Box>
        ))}
      </Sheet>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'flex-end',
          flexWrap: 'nowrap',
        }}
      >
        <Textarea
          minRows={1}
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение…"
          sx={{
            flex: 1,
            resize: 'none',
          }}
        />
        <Button
          variant="solid"
          color="primary"
          onClick={handleSend}
          disabled={!input.trim() || wsRef.current?.readyState !== WebSocket.OPEN}
          endDecorator={<SendRoundedIcon />}
          sx={{
            whiteSpace: 'nowrap',
            px: { xs: 1.5, md: 2.5 },
          }}
        >
          Отправить
        </Button>
      </Stack>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar(null)}
      >
        {snackbar}
      </Snackbar>
    </Box>
  );
}
