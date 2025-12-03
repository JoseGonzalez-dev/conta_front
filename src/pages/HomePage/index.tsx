import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../features/auth';
import { journalService } from '../../features/asientos/services/journalService';
import type { JournalEntry } from '../../features/asientos/types';

// Tipos para los datos
interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: string;
  route: string;
}



// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: transparent;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Dashboard = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  padding: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const WelcomeSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WelcomeIcon = styled.div`
  font-size: 2.5rem;
  color: #4a5568;
`;

const WelcomeContent = styled.div`
  flex: 1;
`;

const WelcomeTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.25rem 0;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1rem;
  color: #718096;
  margin: 0;
`;

const TimeInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
`;

const CurrentTime = styled.span`
  font-size: 0.875rem;
  color: #a0aec0;
  font-weight: 500;
`;

const CurrentDate = styled.span`
  font-size: 0.75rem;
  color: #cbd5e0;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const FeatureCardContainer = styled.div<{ $color: string }>`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const CardIcon = styled.div<{ $color: string }>`
  width: 80px;
  height: 60px;
  background: ${props => props.$color};
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid ${props => props.$color};
  }
`;

const IconWrapper = styled.div`
  color: white;
  font-size: 1.5rem;
`;

const CardArrow = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #a0aec0;
  font-size: 1.25rem;
  transition: color 0.3s ease, transform 0.3s ease;
  
  ${FeatureCardContainer}:hover & {
    color: #4a5568;
    transform: translateX(4px);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
`;

const CardSubtitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  color: #4a5568;
  margin: 0 0 0.75rem 0;
`;

const CardDescription = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
  line-height: 1.5;
`;



const RecentEntriesSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-height: 500px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const ViewAllLink = styled(NavLink)`
  color: #667eea;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    color: #764ba2;
  }
`;

const EntriesTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 100px 2fr 100px 100px;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  
  @media (max-width: 768px) {
    grid-template-columns: 60px 1fr 80px;
    
    & > span:nth-child(2),
    & > span:nth-child(5) {
      display: none;
    }
  }
`;

const HeaderCell = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const EntryRow = styled.div`
  display: grid;
  grid-template-columns: 80px 100px 2fr 100px 100px;
  gap: 1rem;
  padding: 0.75rem 0;
  align-items: center;
  border-bottom: 1px solid #f7fafc;
  
  &:hover {
    background: #f7fafc;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 60px 1fr 80px;
    
    & > span:nth-child(2),
    & > span:nth-child(5) {
      display: none;
    }
  }
`;

const EntryNumber = styled.span`
  font-size: 0.875rem;
  color: #667eea;
  font-weight: 600;
`;

const EntryDate = styled.span`
  font-size: 0.875rem;
  color: #a0aec0;
`;

const EntryDescription = styled.span`
  font-size: 0.875rem;
  color: #4a5568;
  font-weight: 500;
`;

const EntryAmount = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  text-align: right;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #a0aec0;
  font-size: 0.875rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #a0aec0;
  font-size: 0.875rem;
`;

export const HomePage = () => {
  // Data del usuario desde el contexto de autenticación
  const { user } = useAuthContext();

  // Estado para la hora actual
  const [currentTime, setCurrentTime] = useState(new Date());

  // Estado para asientos recientes
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  // Hook para actualizar la hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Actualiza cada minuto

    return () => clearInterval(timer);
  }, []);

  // Hook para cargar asientos recientes
  useEffect(() => {
    const loadRecentEntries = async () => {
      try {
        setLoadingEntries(true);
        const entries = await journalService.getEntries();
        // Ordenar por fecha desc y tomar los últimos 10
        const sortedEntries = entries.sort((a, b) =>
          b.date.getTime() - a.date.getTime()
        ).slice(0, 10);
        setRecentEntries(sortedEntries);
      } catch (error) {
        console.error('Error loading recent entries:', error);
        setRecentEntries([]);
      } finally {
        setLoadingEntries(false);
      }
    };

    loadRecentEntries();
  }, []);

  // Función para obtener el saludo según la hora
  const getGreeting = () => {
    const hour = currentTime.getHours();

    if (hour >= 5 && hour < 12) {
      return {
        greeting: 'Buenos días',
        icon: 'mdi:weather-sunny',
        message: 'Que tengas un excelente día de trabajo'
      };
    } else if (hour >= 12 && hour < 18) {
      return {
        greeting: 'Buenas tardes',
        icon: 'mdi:weather-partly-cloudy',
        message: 'Espero que tu tarde sea productiva'
      };
    } else {
      return {
        greeting: 'Buenas noches',
        icon: 'mdi:weather-night',
        message: 'Trabajando hasta tarde, ¡admirable dedicación!'
      };
    }
  };

  // Función para formatear la fecha
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para formatear la hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para formatear fecha de asiento
  const formatEntryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para formatear cantidad
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const { greeting, icon, message } = getGreeting();
  const userName = user?.full_name;

  // Datos de ejemplo
  const features: FeatureCard[] = [
    {
      id: '1',
      title: 'Nomenclatura',
      subtitle: 'Contable',
      description: 'Gestione y estructure su catálogo de cuentas.',
      color: '#2d3748',
      icon: 'mdi:book-open-page-variant',
      route: '/nomenclatura'
    },
    {
      id: '2',
      title: 'Registro de',
      subtitle: 'Asientos',
      description: 'Registre nuevas transacciones y movimientos contables.',
      color: '#d69e2e',
      icon: 'mdi:pencil',
      route: '/asientos'
    },
    {
      id: '3',
      title: 'Libro Mayor',
      subtitle: '',
      description: 'Consulte el detalle de los movimientos por cuenta.',
      color: '#68d391',
      icon: 'mdi:book-open',
      route: '/libro-mayor'
    },
    {
      id: '4',
      title: 'Reportes',
      subtitle: 'Financieros',
      description: 'Genere el Estado de Resultados y el Balance General.',
      color: '#9f7aea',
      icon: 'mdi:chart-line',
      route: '/balance-general'
    }
  ];

  return (
    <Container>
      <Dashboard>
        <WelcomeSection>
          <WelcomeIcon>
            <Icon icon={icon} />
          </WelcomeIcon>
          <WelcomeContent>
            <WelcomeTitle>{greeting}, Sr (a). {userName}</WelcomeTitle>
            <WelcomeSubtitle>{message}</WelcomeSubtitle>
          </WelcomeContent>
          <TimeInfo>
            <CurrentTime>{formatTime(currentTime)}</CurrentTime>
            <CurrentDate>{formatDate(currentTime)}</CurrentDate>
          </TimeInfo>
        </WelcomeSection>

        <FeaturesGrid>
          {features.map((feature) => (
            <StyledNavLink key={feature.id} to={feature.route}>
              <FeatureCardContainer $color={feature.color}>
                <CardArrow>
                  <Icon icon="mdi:arrow-right" />
                </CardArrow>
                <CardIcon $color={feature.color}>
                  <IconWrapper>
                    <Icon icon={feature.icon} />
                  </IconWrapper>
                </CardIcon>
                <CardTitle>{feature.title}</CardTitle>
                {feature.subtitle && <CardSubtitle>{feature.subtitle}</CardSubtitle>}
                <CardDescription>{feature.description}</CardDescription>
              </FeatureCardContainer>
            </StyledNavLink>
          ))}
        </FeaturesGrid>

        <RecentEntriesSection>
          <SectionHeader>
            <SectionTitle>Libro Diario - Asientos Recientes</SectionTitle>
            <ViewAllLink to="/asientos">
              Ver todos
              <Icon icon="mdi:arrow-right" />
            </ViewAllLink>
          </SectionHeader>

          {loadingEntries ? (
            <LoadingMessage>
              <Icon icon="mdi:loading" className="animate-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }} />
              <div>Cargando asientos...</div>
            </LoadingMessage>
          ) : recentEntries.length === 0 ? (
            <EmptyMessage>
              <Icon icon="mdi:file-document-outline" style={{ fontSize: '3rem', marginBottom: '1rem' }} />
              <div>No hay asientos registrados aún</div>
            </EmptyMessage>
          ) : (
            <EntriesTable>
              <TableHeader>
                <HeaderCell>#</HeaderCell>
                <HeaderCell>Fecha</HeaderCell>
                <HeaderCell>Descripción</HeaderCell>
                <HeaderCell style={{ textAlign: 'right' }}>Débito</HeaderCell>
                <HeaderCell style={{ textAlign: 'right' }}>Crédito</HeaderCell>
              </TableHeader>
              {recentEntries.map((entry, index) => (
                <EntryRow key={entry.id}>
                  <EntryNumber>#{index + 1}</EntryNumber>
                  <EntryDate>{formatEntryDate(entry.date.toISOString())}</EntryDate>
                  <EntryDescription>{entry.description}</EntryDescription>
                  <EntryAmount>{formatAmount(entry.totalDebits)}</EntryAmount>
                  <EntryAmount>{formatAmount(entry.totalCredits)}</EntryAmount>
                </EntryRow>
              ))}
            </EntriesTable>
          )}
        </RecentEntriesSection>
      </Dashboard>
    </Container>
  );
};