import { AxiosError } from 'axios';
import apiClient from '../services/api/apiClient';
import { notificationService } from '../services/notification.service';

export const setupErrorInterceptor = () => {
    apiClient.interceptors.response.use(
        response => response,
        (error: AxiosError) => {
            const status = error.response?.status;
            const data = error.response?.data as any;
            const message = data?.message || error.message || 'An error occurred';

            switch (status) {
                case 400:
                    notificationService.error(`Bad Request: ${message}`);
                    break;
                case 403:
                    notificationService.error('Forbidden: You do not have permission to access this resource');
                    break;
                case 404:
                    notificationService.error('Not Found: The requested resource does not exist');
                    break;
                case 500:
                    notificationService.error('Server Error: Please try again later');
                    break;
                case 503:
                    notificationService.error('Service Unavailable: The server is temporarily unavailable');
                    break;
                default:
                    if (status && status >= 400 && status < 500) {
                        notificationService.error(`Client Error: ${message}`);
                    } else if (status && status >= 500) {
                        notificationService.error(`Server Error: ${message}`);
                    } else {
                        notificationService.error(message);
                    }
            }

            return Promise.reject(error);
        }
    );
};
