'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Snackbar, Alert, AlertColor, Slide, SlideProps } from '@mui/material';

interface Notification {
  id: string;
  message: string;
  type: AlertColor;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (message: string, type: AlertColor, duration?: number) => void;
  notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: AlertColor, duration = 4000) => {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
  };

  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      setCurrentNotification(notifications[0]);
      setNotifications(prev => prev.slice(1));
    }
  }, [notifications, currentNotification]);

  const handleClose = () => {
    setCurrentNotification(null);
  };

  // Listen for patient events
  useEffect(() => {
    const handlePatientAdded = () => {
      showNotification('✅ Yeni hasta başarıyla eklendi!', 'success');
    };

    const handlePatientDiagnosed = () => {
      showNotification('🩺 Hasta tanısı güncellendi!', 'info');
    };

    const handleRiskAssessment = () => {
      showNotification('⚠️ Risk değerlendirmesi tamamlandı!', 'warning');
    };

    // Custom events for notifications
    window.addEventListener('patient-added', handlePatientAdded);
    window.addEventListener('patient-diagnosed', handlePatientDiagnosed);
    window.addEventListener('risk-assessment', handleRiskAssessment);

    return () => {
      window.removeEventListener('patient-added', handlePatientAdded);
      window.removeEventListener('patient-diagnosed', handlePatientDiagnosed);
      window.removeEventListener('risk-assessment', handleRiskAssessment);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, notifications }}>
      {children}
      
      <Snackbar
        open={!!currentNotification}
        autoHideDuration={currentNotification?.duration || 4000}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }}
      >
        <Alert 
          onClose={handleClose} 
          severity={currentNotification?.type || 'info'}
          variant="filled"
          sx={{ 
            minWidth: '300px',
            boxShadow: 3,
            '& .MuiAlert-message': {
              fontWeight: 500
            }
          }}
        >
          {currentNotification?.message || ''}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
} 