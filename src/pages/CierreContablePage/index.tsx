import styled from 'styled-components';
import { AccountingCycleTabs } from '../../features/cierre-contable/components';

const Container = styled.div`
  min-height: 100vh;
  background: transparent;
  padding: 1rem;
  font-family: -apple-system, Blink MacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const PageLayout = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #718096;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const CierreContablePage = () => {
  return (
    <Container>
      <PageLayout>
        <Header>
          <Title>Ciclo Contable</Title>
          <Subtitle>Gestión de cierre y apertura de períodos contables</Subtitle>
        </Header>
        <AccountingCycleTabs />
      </PageLayout>
    </Container>
  );
};