import { useCallback, useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { ToastType } from '../types/notification.types';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  const { addNotification, removeNotification, notifications } = context;

  const success = useCallback((message: string) => addNotification(message, 'success'), [addNotification]);
  const error = useCallback((message: string) => addNotification(message, 'error'), [addNotification]);
  const warning = useCallback((message: string) => addNotification(message, 'warning'), [addNotification]);
  const info = useCallback((message: string) => addNotification(message, 'info'), [addNotification]);

  return { success, error, warning, info, remove: removeNotification, notifications };
};
