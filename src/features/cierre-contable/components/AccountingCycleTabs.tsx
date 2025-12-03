import { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { ClosingProcess } from './ClosingProcess';
import { OpeningProcess } from './OpeningProcess';
import { useClosing } from '../hooks/useClosing';

type TabType = 'closing' | 'opening';

const Container = styled.div`
  width: 100%;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$active ? '#3182ce' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#4a5568'};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#3182ce' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#2c5aa0' : '#f7fafc'};
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
`;

const TabContent = styled.div`
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const AccountingCycleTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>('closing');

  const closing = useClosing();

  return (
    <Container>
      <TabsContainer>
        <Tab
          $active={activeTab === 'closing'}
          onClick={() => setActiveTab('closing')}
        >
          <Icon icon="mdi:lock-clock" width={20} />
          Cierre Contable
        </Tab>
        <Tab
          $active={activeTab === 'opening'}
          onClick={() => setActiveTab('opening')}
        >
          <Icon icon="mdi:lock-open" width={20} />
          Apertura Contable
        </Tab>
      </TabsContainer>

      <TabContent>
        {activeTab === 'closing' ? (
          <ClosingProcess
            availablePeriods={closing.availablePeriods}
            selectedPeriod={closing.selectedPeriod}
            closingProcess={closing.closingProcess}
            loading={closing.loading}
            onPeriodSelect={closing.selectPeriod}
            onCalculateResults={closing.calculateResults}
            onExecuteClosing={closing.executeClosing}
            onReset={closing.resetProcess}
          />
        ) : (
          <OpeningProcess />
        )}
      </TabContent>
    </Container>
  );
};
