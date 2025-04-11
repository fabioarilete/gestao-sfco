import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  buttonText: string;
  children: React.ReactNode;
  id: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  id,
  open,
  onClose,
  onSubmit,
  title,
  buttonText,
  children,
  maxWidth = 'sm',
}) => {
  return (
    <Dialog
      fullWidth
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      sx={{
        '& .MuiDialog-paper': {
          maxHeight: '80vh',
          overflowY: 'auto',
        },
      }}
    >
      <DialogContent dividers sx={{ p: 3 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
