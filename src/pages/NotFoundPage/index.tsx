import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  padding: 3rem 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  text-align: center;
  animation: slideUp 0.6s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const IconContainer = styled.div`
  margin-bottom: 2rem;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 1.5rem 0 0.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #718096;
  margin: 0 0 2rem 0;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  
  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }
  ` : `
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
    
    &:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

const SuggestedLinks = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
`;

const SuggestedTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
`;

const LinksList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
`;

const QuickLink = styled.button`
  padding: 0.75rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: white;
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const NotFoundPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const quickLinks = [
        { name: 'Inicio', path: '/', icon: 'mdi:home' },
        { name: 'Asientos', path: '/asientos', icon: 'mdi:pencil' },
        { name: 'Nomenclatura', path: '/nomenclatura', icon: 'mdi:book-open-page-variant' },
        { name: 'Balance', path: '/balance-general', icon: 'mdi:chart-line' }
    ];

    return (
        <Container>
            <ContentCard>
                <IconContainer>
                    <Icon icon="mdi:compass-off-outline" style={{ fontSize: '6rem', color: '#667eea' }} />
                </IconContainer>

                <ErrorCode>404</ErrorCode>

                <Title>¡Ups! Página no encontrada</Title>

                <Subtitle>
                    Parece que esta página se perdió en el balance general.
                    No te preocupes, te redirigiremos al inicio en {countdown} segundos.
                </Subtitle>

                <ButtonGroup>
                    <Button $variant="primary" onClick={() => navigate('/')}>
                        <Icon icon="mdi:home" width={20} />
                        Volver al Inicio
                    </Button>
                    <Button $variant="secondary" onClick={() => navigate(-1)}>
                        <Icon icon="mdi:arrow-left" width={20} />
                        Página Anterior
                    </Button>
                </ButtonGroup>

                <SuggestedLinks>
                    <SuggestedTitle>Enlaces Rápidos</SuggestedTitle>
                    <LinksList>
                        {quickLinks.map((link) => (
                            <QuickLink key={link.path} onClick={() => navigate(link.path)}>
                                <Icon icon={link.icon} width={18} />
                                {link.name}
                            </QuickLink>
                        ))}
                    </LinksList>
                </SuggestedLinks>
            </ContentCard>
        </Container>
    );
};
