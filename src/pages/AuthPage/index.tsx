import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { RegisterForm } from '../../features/auth/components/RegisterForm';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { LoginRequest, RegisterRequest } from '../../features/auth/types';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  gap: 4rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const WelcomeSection = styled.div`
  flex: 1;
  color: white;
  text-align: center;
  
  @media (max-width: 768px) {
    order: 2;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.25rem;
  margin: 0 0 2rem 0;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  opacity: 0.9;
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const FormSection = styled.div`
  flex: 0 0 auto;
  
  @media (max-width: 768px) {
    order: 1;
    width: 100%;
    max-width: 400px;
  }
`;

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login, register, loading, error, clearError } = useAuth();

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await login(credentials);
      navigate('/');
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const handleRegister = async (userData: RegisterRequest) => {
    try {
      await register(userData);
      navigate('/');
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    clearError();
  };

  const handleForgotPassword = () => {
    alert('Funcionalidad de recuperación de contraseña no implementada en el demo');
  };

  return (
    <Container>
      <AuthContainer>
        <WelcomeSection>
          <WelcomeTitle>
            {isLogin ? 'Bienvenido de vuelta' : 'Únete a ContaFront'}
          </WelcomeTitle>
          <WelcomeSubtitle>
            {isLogin 
              ? 'Accede a tu sistema contable profesional'
              : 'Crea tu cuenta y comienza a gestionar tu contabilidad'
            }
          </WelcomeSubtitle>
          
          <FeaturesList>
            <FeatureItem>
              <FeatureIcon>📊</FeatureIcon>
              <span>Gestión completa de asientos contables</span>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>📈</FeatureIcon>
              <span>Reportes financieros en tiempo real</span>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>🔒</FeatureIcon>
              <span>Seguridad y respaldo de datos</span>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>⚡</FeatureIcon>
              <span>Interfaz moderna y fácil de usar</span>
            </FeatureItem>
          </FeaturesList>
        </WelcomeSection>

        <FormSection>
          {isLogin ? (
            <LoginForm
              onSubmit={handleLogin}
              onSwitchToRegister={handleSwitchMode}
              onForgotPassword={handleForgotPassword}
              loading={loading}
              error={error}
            />
          ) : (
            <RegisterForm
              onSubmit={handleRegister}
              onSwitchToLogin={handleSwitchMode}
              loading={loading}
              error={error}
            />
          )}
        </FormSection>
      </AuthContainer>
    </Container>
  );
};