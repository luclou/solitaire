import React, { ReactNode } from 'react';
import styles from './Popup.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Popup({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
