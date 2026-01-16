// Notification Service for managing toast notifications
// This service can be used independently if needed

export interface NotificationOptions {
    duration?: number;
    position?: 'top' | 'bottom' | 'top-right' | 'bottom-right';
}

class NotificationService {
    private listeners: Array<(notification: any) => void> = [];

    subscribe(listener: (notification: any) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify(message: string, type: 'success' | 'error' | 'warning' | 'info', options?: NotificationOptions) {
        const notification = {
            id: Date.now(),
            message,
            type,
            duration: options?.duration ?? 5000,
            position: options?.position ?? 'top-right',
        };

        this.listeners.forEach(listener => listener(notification));
    }

    success(message: string, options?: NotificationOptions) {
        this.notify(message, 'success', options);
    }

    error(message: string, options?: NotificationOptions) {
        this.notify(message, 'error', options);
    }

    warning(message: string, options?: NotificationOptions) {
        this.notify(message, 'warning', options);
    }

    info(message: string, options?: NotificationOptions) {
        this.notify(message, 'info', options);
    }
}

export const notificationService = new NotificationService();
