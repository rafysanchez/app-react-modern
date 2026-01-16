import './Footer.css';

const Footer = () => {
    return (
        <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} Modern Products App</p>
        </footer>
    );
};

export default Footer;
