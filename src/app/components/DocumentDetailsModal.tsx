'use client';
import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Alert from '@mui/joy/Alert';
import type { DocumentDetailsModalProps} from '../types/types';
const DocumentDetailsModal: React.FC<DocumentDetailsModalProps> = ({
  open,
  document,
  analyzing,
  onClose,
  onAnalyze,
}) => {
  const [resultMessage, setResultMessage] = React.useState<string | null>(null);
  const handleAnalyzeClick = async () => {
    setResultMessage(null);
    try {
      await onAnalyze();
      setResultMessage('Анализ выполнен!');
    } catch (e) {
      setResultMessage('Ошибка анализа');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog aria-labelledby="doc-details-title" layout="center">
        <ModalClose />
        {document && (
          <>
            <Typography id="doc-details-title" level="h4">
              {document.fileName}
            </Typography>
            <Typography level="body-sm" sx={{ mb: 1, color: 'neutral.500' }}>
              ID: {document.id}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography level="body-sm">
                <b>Версия:</b> {document.version}
              </Typography>
              <Typography level="body-sm">
                <b>Размер:</b> {document.size}
              </Typography>
              <Typography level="body-sm">
                <b>Дата загрузки:</b> {document.uploadedAt}
              </Typography>
              <Typography level="body-sm">
                <b>userId:</b> {document.original.userId}
              </Typography>
              <Typography level="body-sm">
                <b>Содержимое:</b> {document.original.body}
              </Typography>
            </Box>
            {resultMessage && (
              <Alert size="sm" color="success" sx={{ mt: 2 }}>
                {resultMessage}
              </Alert>
            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                color="neutral"
                onClick={onClose}
              >
                Закрыть
              </Button>
              <Button
                color="primary"
                loading={analyzing}
                onClick={handleAnalyzeClick}
              >
                Проанализировать
              </Button>
            </Box>
          </>
        )}
      </ModalDialog>
    </Modal>
  );
};

export default DocumentDetailsModal;
