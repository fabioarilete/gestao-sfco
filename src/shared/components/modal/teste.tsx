import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ModalProvider } from './ModalContext';

interface ModalProps {
  onExited: () => void;
  children: React.ReactNode;
  title: string;
  buttonText: string;
  onSubmit(): void;
}

export default function Modal({ title, buttonText, children, onSubmit, onExited }: ModalProps) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ModalProvider
      value={{
        handleCloseModal: handleClose,
      }}
    >
      <Dialog maxWidth="md" open={open} onClose={handleClose} onTransitionExited={onExited}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="button" onClick={onSubmit}>
            {buttonText}
          </Button>
        </DialogActions>
      </Dialog>
    </ModalProvider>
  );
}
