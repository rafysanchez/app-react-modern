import './Modal.css';

interface ConfirmDialogProps {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const ConfirmDialog = ({ message, onCancel, onConfirm, isLoading }: ConfirmDialogProps) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} disabled={isLoading}>Cancel</button>
          <button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
