import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { LedgerAccount, LedgerFilters, LedgerReport } from '../types';

interface LedgerViewerProps {
  accounts: LedgerAccount[];
  filters: LedgerFilters;
  report: LedgerReport | null;
  loading: boolean;
  onFiltersChange: (filters: Partial<LedgerFilters>) => void;
  onGenerateReport: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
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
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin: 0 0 1.5rem 0;
`;

const FiltersSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr auto;
    align-items: end;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
`;

const Select = styled.select`
  width: 100%;
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
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const GenerateButton = styled.button`
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
  height: fit-content;
  
  &:hover:not(:disabled) {
    background: #2c5aa0;
  }
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const ReportSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ReportCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;

const ReportHeader = styled.div`
  background: #f7fafc;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReportTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const ExportButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ExportButton = styled.button`
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #4a5568;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
`;

const AccountHeader = styled.div`
  background: #667eea;
  color: white;
  padding: 1rem;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 600;
`;

const TAccountContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 300px;
`;

const DebitSide = styled.div`
  border-right: 1px solid #e2e8f0;
`;

const CreditSide = styled.div``;

const SideHeader = styled.div<{ $type: 'debit' | 'credit' }>`
  background: ${props => props.$type === 'debit' ? '#fed7d7' : '#c6f6d5'};
  color: ${props => props.$type === 'debit' ? '#742a2a' : '#22543d'};
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
`;

const MovementsList = styled.div`
  padding: 0.5rem;
  min-height: 200px;
`;

const MovementItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.75rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const MovementDate = styled.span`
  color: #718096;
  font-size: 0.7rem;
`;

const MovementDescription = styled.span`
  flex: 1;
  margin: 0 0.5rem;
  color: #4a5568;
`;

const MovementAmount = styled.span<{ $type: 'debit' | 'credit' }>`
  font-weight: 600;
  color: ${props => props.$type === 'debit' ? '#e53e3e' : '#48bb78'};
`;

const TotalsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 2px solid #e2e8f0;
`;

const TotalItem = styled.div<{ $type: 'debit' | 'credit' }>`
  padding: 0.75rem;
  text-align: center;
  background: ${props => props.$type === 'debit' ? '#fed7d7' : '#c6f6d5'};
  border-right: ${props => props.$type === 'debit' ? '1px solid #e2e8f0' : 'none'};
`;

const TotalLabel = styled.div`
  font-size: 0.75rem;
  color: #4a5568;
  margin-bottom: 0.25rem;
`;

const TotalAmount = styled.div<{ $type: 'debit' | 'credit' }>`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.$type === 'debit' ? '#e53e3e' : '#48bb78'};
`;

const FinalBalanceSection = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-top: 2px solid #e2e8f0;
  text-align: center;
`;

const FinalBalanceLabel = styled.div`
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.25rem;
`;

const FinalBalanceAmount = styled.div<{ $positive: boolean }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.$positive ? '#3182ce' : '#e53e3e'};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #718096;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #718096;
`;

export const LedgerViewer = ({
  accounts,
  filters,
  report,
  loading,
  onFiltersChange,
  onGenerateReport,
  onExportPDF,
  onExportExcel
}: LedgerViewerProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const debitMovements = report?.movements.filter(mov => mov.debit > 0) || [];
  const creditMovements = report?.movements.filter(mov => mov.credit > 0) || [];

  return (
    <Container>
      <Header>
        <Title>Visualizador de T Gráfica</Title>
        <Subtitle>Seleccione una cuenta y un rango de fechas para ver sus movimientos</Subtitle>
      </Header>

      <FiltersSection>
        <FormGroup>
          <Label>Cuenta</Label>
          <Select
            value={filters.accountId}
            onChange={(e) => onFiltersChange({ accountId: e.target.value })}
          >
            <option value="">Seleccionar cuenta</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.code} - {account.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Fecha de Inicio</Label>
          <Input
            type="date"
            value={filters.startDate.toISOString().split('T')[0]}
            onChange={(e) => onFiltersChange({ startDate: new Date(e.target.value) })}
          />
        </FormGroup>

        <FormGroup>
          <Label>Fecha de Fin</Label>
          <Input
            type="date"
            value={filters.endDate.toISOString().split('T')[0]}
            onChange={(e) => onFiltersChange({ endDate: new Date(e.target.value) })}
          />
        </FormGroup>

        <GenerateButton
          onClick={onGenerateReport}
          disabled={loading || !filters.accountId}
        >
          {loading ? (
            <>
              <Icon icon="mdi:loading" className="animate-spin" />
              Generando...
            </>
          ) : (
            'Generar Reporte'
          )}
        </GenerateButton>
      </FiltersSection>

      {loading && (
        <LoadingContainer>
          <Icon icon="mdi:loading" className="animate-spin" style={{ marginRight: '0.5rem' }} />
          Generando reporte...
        </LoadingContainer>
      )}

      {!loading && !report && (
        <EmptyState>
          <Icon icon="mdi:chart-line" style={{ fontSize: '3rem', marginBottom: '1rem' }} />
          <p>Seleccione una cuenta y genere el reporte para ver la T gráfica</p>
        </EmptyState>
      )}

      {!loading && report && (
        <ReportSection>
          <ReportCard>
            <ReportHeader>
              <ReportTitle>T Gráfica de {report.account.name}</ReportTitle>
              <ExportButtons>
                <ExportButton onClick={onExportPDF}>
                  <Icon icon="mdi:file-pdf" />
                  PDF
                </ExportButton>
                <ExportButton onClick={onExportExcel}>
                  <Icon icon="mdi:file-excel" />
                  Excel
                </ExportButton>
              </ExportButtons>
            </ReportHeader>

            <AccountHeader>
              {report.account.name}
            </AccountHeader>

            <TAccountContainer>
              <DebitSide>
                <SideHeader $type="debit">Cargos (Débitos)</SideHeader>
                <MovementsList>
                  {debitMovements.map((movement) => (
                    <MovementItem key={movement.id}>
                      <MovementDate>{formatDate(movement.date)}</MovementDate>
                      <MovementDescription>{movement.description}</MovementDescription>
                      <MovementAmount $type="debit">
                        {formatCurrency(movement.debit)}
                      </MovementAmount>
                    </MovementItem>
                  ))}
                </MovementsList>
              </DebitSide>

              <CreditSide>
                <SideHeader $type="credit">Abonos (Créditos)</SideHeader>
                <MovementsList>
                  {creditMovements.map((movement) => (
                    <MovementItem key={movement.id}>
                      <MovementDate>{formatDate(movement.date)}</MovementDate>
                      <MovementDescription>{movement.description}</MovementDescription>
                      <MovementAmount $type="credit">
                        {formatCurrency(movement.credit)}
                      </MovementAmount>
                    </MovementItem>
                  ))}
                </MovementsList>
              </CreditSide>
            </TAccountContainer>

            <TotalsSection>
              <TotalItem $type="debit">
                <TotalLabel>Total Cargos:</TotalLabel>
                <TotalAmount $type="debit">
                  {formatCurrency(report.totalDebits)}
                </TotalAmount>
              </TotalItem>
              <TotalItem $type="credit">
                <TotalLabel>Total Abonos:</TotalLabel>
                <TotalAmount $type="credit">
                  {formatCurrency(report.totalCredits)}
                </TotalAmount>
              </TotalItem>
            </TotalsSection>

            <FinalBalanceSection>
              <FinalBalanceLabel>Saldo Final:</FinalBalanceLabel>
              <FinalBalanceAmount $positive={report.finalBalance >= 0}>
                {formatCurrency(Math.abs(report.finalBalance))}
              </FinalBalanceAmount>
            </FinalBalanceSection>
          </ReportCard>
        </ReportSection>
      )}
    </Container>
  );
};