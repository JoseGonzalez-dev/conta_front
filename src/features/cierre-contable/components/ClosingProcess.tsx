import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { ClosingPeriod, ClosingProcess as ClosingProcessType } from '../types';

interface ClosingProcessProps {
  availablePeriods: ClosingPeriod[];
  selectedPeriod: ClosingPeriod | null;
  closingProcess: ClosingProcessType | null;
  loading: boolean;
  onPeriodSelect: (periodId: string) => void;
  onCalculateResults: () => void;
  onExecuteClosing: () => void;
  onReset: () => void;
}

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  flex: 1;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #718096;
`;

const ProgressBar = styled.div`
  width: 100px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: #3182ce;
  transition: width 0.3s ease;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1rem 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
`;

const Select = styled.select`
  width: 100%;
  max-width: 300px;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
  
  &:disabled {
    background: #f7fafc;
    color: #a0aec0;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div<{ $type: 'income' | 'expense' }>`
  background: ${props => props.$type === 'income' ? '#c6f6d5' : '#fed7d7'};
  border: 1px solid ${props => props.$type === 'income' ? '#9ae6b4' : '#feb2b2'};
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const SummaryAmount = styled.div<{ $type: 'income' | 'expense' }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.$type === 'income' ? '#22543d' : '#742a2a'};
`;

const ResultsTable = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const TableHeader = styled.div`
  background: #f7fafc;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr auto;
    gap: 0.5rem;
    padding: 0.5rem;
  }
`;

const AccountCode = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
`;

const AccountName = styled.span`
  font-size: 0.875rem;
  color: #2d3748;
`;

const AccountBalance = styled.span<{ $type: 'income' | 'expense' }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$type === 'income' ? '#48bb78' : '#e53e3e'};
  text-align: right;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: #3182ce;
          color: white;
          &:hover:not(:disabled) { background: #2c5aa0; }
        `;
      case 'success':
        return `
          background: #48bb78;
          color: white;
          &:hover:not(:disabled) { background: #38a169; }
        `;
      case 'danger':
        return `
          background: #e53e3e;
          color: white;
          &:hover:not(:disabled) { background: #c53030; }
        `;
      default:
        return `
          background: transparent;
          color: #4a5568;
          border: 1px solid #e2e8f0;
          &:hover:not(:disabled) { background: #f7fafc; }
        `;
    }
  }}
  
  &:disabled {
    background: #a0aec0;
    color: white;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #718096;
`;

const SuccessMessage = styled.div`
  background: #c6f6d5;
  border: 1px solid #9ae6b4;
  color: #22543d;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
`;

export const ClosingProcess = ({
  availablePeriods,
  selectedPeriod,
  closingProcess,
  loading,
  onPeriodSelect,
  onCalculateResults,
  onExecuteClosing,
  onReset
}: ClosingProcessProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getProgressPercentage = () => {
    if (!closingProcess) return 0;
    return (closingProcess.currentStep / closingProcess.totalSteps) * 100;
  };

  const openPeriods = availablePeriods.filter(p => p.status === 'open');

  return (
    <Container>
      <Header>
        <Title>Cierre Contable del Período</Title>
        {closingProcess && (
          <StepIndicator>
            <span>Paso {closingProcess.currentStep} de {closingProcess.totalSteps}: 
              {closingProcess.currentStep === 1 ? ' Revisión' : ' Ejecución'}
            </span>
            <ProgressBar>
              <ProgressFill $progress={getProgressPercentage()} />
            </ProgressBar>
          </StepIndicator>
        )}
      </Header>

      {closingProcess?.isComplete && (
        <SuccessMessage>
          <Icon icon="mdi:check-circle" style={{ marginRight: '0.5rem' }} />
          ¡Cierre contable completado exitosamente para {selectedPeriod?.name}!
        </SuccessMessage>
      )}

      <Section>
        <SectionTitle>Seleccione el período a cerrar</SectionTitle>
        <FormGroup>
          <Label>Período</Label>
          <Select
            value={selectedPeriod?.id || ''}
            onChange={(e) => onPeriodSelect(e.target.value)}
            disabled={loading || closingProcess?.isComplete}
          >
            <option value="">Seleccionar período...</option>
            {openPeriods.map(period => (
              <option key={period.id} value={period.id}>
                {period.name}
              </option>
            ))}
          </Select>
        </FormGroup>
      </Section>

      {loading && (
        <LoadingContainer>
          <Icon icon="mdi:loading" className="animate-spin" style={{ marginRight: '0.5rem' }} />
          Procesando...
        </LoadingContainer>
      )}

      {!loading && closingProcess && (
        <>
          <Section>
            <SummaryGrid>
              <SummaryCard $type="income">
                <SummaryLabel>Total Ingresos del Período</SummaryLabel>
                <SummaryAmount $type="income">
                  {formatCurrency(closingProcess.incomeStatement.totalIncome)}
                </SummaryAmount>
              </SummaryCard>
              
              <SummaryCard $type="expense">
                <SummaryLabel>Total Egresos del Período</SummaryLabel>
                <SummaryAmount $type="expense">
                  {formatCurrency(closingProcess.incomeStatement.totalExpenses)}
                </SummaryAmount>
              </SummaryCard>
            </SummaryGrid>
          </Section>

          <Section>
            <SectionTitle>Resumen de Cuentas de Resultados</SectionTitle>
            
            <ResultsTable>
              <TableHeader>Cuentas de Ingresos</TableHeader>
              {closingProcess.incomeStatement.incomeAccounts.map(account => (
                <TableRow key={account.id}>
                  <AccountCode>{account.code}</AccountCode>
                  <AccountName>{account.name}</AccountName>
                  <AccountBalance $type="income">
                    {formatCurrency(account.balance)}
                  </AccountBalance>
                </TableRow>
              ))}
            </ResultsTable>

            <ResultsTable>
              <TableHeader>Cuentas de Gastos</TableHeader>
              {closingProcess.incomeStatement.expenseAccounts.map(account => (
                <TableRow key={account.id}>
                  <AccountCode>{account.code}</AccountCode>
                  <AccountName>{account.name}</AccountName>
                  <AccountBalance $type="expense">
                    {formatCurrency(account.balance)}
                  </AccountBalance>
                </TableRow>
              ))}
            </ResultsTable>
          </Section>
        </>
      )}

      <ButtonGroup>
        {!closingProcess && selectedPeriod && (
          <Button 
            $variant="primary" 
            onClick={onCalculateResults}
            disabled={loading}
          >
            <Icon icon="mdi:calculator" />
            Calcular Resultado del Ejercicio
          </Button>
        )}

        {closingProcess && !closingProcess.isComplete && (
          <Button 
            $variant="success" 
            onClick={onExecuteClosing}
            disabled={loading}
          >
            <Icon icon="mdi:check" />
            Ejecutar Cierre Contable
          </Button>
        )}

        {(closingProcess || selectedPeriod) && (
          <Button onClick={onReset} disabled={loading}>
            <Icon icon="mdi:refresh" />
            Nuevo Proceso
          </Button>
        )}
      </ButtonGroup>
    </Container>
  );
};