import { Toast as ToastType } from '../../types/notification.types';
import './Toast.css';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

const Toast = ({ toast, onClose }: ToastProps) => {
  return (
    <div className={`toast toast-${toast.type}`}>
      <p>{toast.message}</p>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default Toast;
