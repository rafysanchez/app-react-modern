import { useNotification } from '../../hooks/useNotification';
import Toast from './Toast';
import './NotificationContainer.css';

const NotificationContainer = () => {
  const { notifications, remove } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => remove(toast.id)} />
      ))}
    </div>
  );
};

export default NotificationContainer;
