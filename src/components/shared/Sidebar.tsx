import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useAuth();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button onClick={toggleSidebar} className="toggle-btn">
                {isCollapsed ? '>>' : '<<'}
            </button>
            <nav>
                <ul>
                    <li><NavLink to="/products">📊 Dashboard</NavLink></li>
                    <li><NavLink to="/products">📦 Products</NavLink></li>
                    <li><NavLink to="#">👥 Customers</NavLink></li>
                    <li><NavLink to="#">📋 Orders</NavLink></li>
                    <li><NavLink to="#">📈 Reports</NavLink></li>
                    {user?.role === 'admin' && <li><NavLink to="#">👤 Users</NavLink></li>}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;