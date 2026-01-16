import LoginForm from './LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <div className="login-card">
        <h1>Login</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;