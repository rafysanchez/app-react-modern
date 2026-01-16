import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import Footer from '../shared/Footer';
import './AppLayout.css';
import { useIdleTimer } from '../../hooks/useIdleTimer';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

const AppLayout = () => {
    const { setUser } = useAuth();
    const { info } = useNotification();
    const navigate = useNavigate();

    const handleIdle = () => {
        authService.logout();
        setUser(null);
        info('You have been logged out due to inactivity.');
        navigate('/login');
    };

    useIdleTimer(15 * 60 * 1000, handleIdle); // 15 minutes

    return (
        <div className="app-layout">
            <Header />
            <Sidebar />
            <main className="app-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default AppLayout;