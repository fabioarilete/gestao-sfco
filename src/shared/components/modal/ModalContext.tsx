import React, { createContext, useContext, useState } from 'react';
import Modal from './Modal'; // Importe o Modal
import { Dialog } from '@mui/material';

interface ModalContextType {
  openModal: (title: string, buttonText: string, onSubmit: () => void) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    buttonText: '',
    onSubmit: () => {},
  });

  const openModal = (title: string, buttonText: string, onSubmit: () => void) => {
    setModalState({
      isOpen: true,
      title,
      buttonText,
      onSubmit,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalState.isOpen && (
        <Dialog
          title={modalState.title}
          buttonText={modalState.buttonText}
          onSubmit={modalState.onSubmit}
          onClose={closeModal}
          open={modalState.isOpen}
        >
          {/* Any modal content goes here */}
        </Dialog>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
