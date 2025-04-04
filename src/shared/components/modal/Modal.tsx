import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  buttonText: string;
  children: React.ReactNode;
  id: string;
}

const Modal: React.FC<ModalProps> = ({
  id,
  open,
  onClose,
  onSubmit,
  title,
  buttonText,
  children,
}) => {
  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" form={id}>
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
