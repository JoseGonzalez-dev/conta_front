import styled from 'styled-components';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { BalanceSheet, BalanceSheetFilters, AccountCategory } from '../types';

interface BalanceSheetViewerProps {
  balanceSheet: BalanceSheet | null;
  availableDates: Date[];
  filters: BalanceSheetFilters;
  loading: boolean;
  onFiltersChange: (filters: Partial<BalanceSheetFilters>) => void;
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
    grid-template-columns: auto auto auto auto;
    align-items: center;
  }
`;

const CalendarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f7fafc;
  border-radius: 8px;
  padding: 0.5rem;
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: #4a5568;
  
  &:hover {
    background: #e2e8f0;
  }
`;

const MonthDisplay = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #2d3748;
  min-width: 120px;
  text-align: center;
`;

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  background: #f7fafc;
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 0.75rem;
`;

const CalendarHeader = styled.div`
  text-align: center;
  font-weight: 600;
  color: #4a5568;
  padding: 0.25rem;
`;

const CalendarDay = styled.button<{ $isSelected?: boolean; $isToday?: boolean }>`
  background: ${props => {
    if (props.$isSelected) return '#3182ce';
    if (props.$isToday) return '#e2e8f0';
    return 'transparent';
  }};
  color: ${props => props.$isSelected ? 'white' : '#4a5568'};
  border: none;
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    background: ${props => props.$isSelected ? '#2c5aa0' : '#e2e8f0'};
  }
  
  &:disabled {
    color: #cbd5e0;
    cursor: not-allowed;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  
  ${props => props.$variant === 'primary' ? `
    background: #3182ce;
    color: white;
    &:hover:not(:disabled) { background: #2c5aa0; }
  ` : `
    background: transparent;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    &:hover:not(:disabled) { background: #f7fafc; }
  `}
  
  &:disabled {
    background: #a0aec0;
    color: white;
    cursor: not-allowed;
  }
`;

const VerificationSection = styled.div`
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const VerificationTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
`;

const VerificationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const VerificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VerificationLabel = styled.span`
  font-size: 0.875rem;
  color: #4a5568;
`;

const VerificationAmount = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
`;

const VerificationStatus = styled.div<{ $isBalanced: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.$isBalanced ? '#22543d' : '#742a2a'};
  font-size: 0.875rem;
  font-weight: 500;
`;

const BalanceSheetContainer = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;

const BalanceSheetHeader = styled.div`
  background: #2d3748;
  color: white;
  padding: 1rem;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 600;
`;

const BalanceSheetGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div<{ $type: 'asset' | 'liability' | 'equity' }>`
  border-right: 1px solid #e2e8f0;
  
  &:last-child {
    border-right: none;
  }
  
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const SectionHeader = styled.div<{ $type: 'asset' | 'liability' | 'equity' }>`
  background: ${props => {
    switch (props.$type) {
      case 'asset': return '#e6fffa';
      case 'liability': return '#fef5e7';
      case 'equity': return '#f0fff4';
      default: return '#f7fafc';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'asset': return '#234e52';
      case 'liability': return '#744210';
      case 'equity': return '#22543d';
      default: return '#2d3748';
    }
  }};
  padding: 0.75rem;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
`;

const CategorySection = styled.div`
  margin-bottom: 1rem;
`;

const CategoryHeader = styled.div`
  background: #f7fafc;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.875rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const AccountName = styled.span`
  color: #4a5568;
`;

const AccountBalance = styled.span`
  font-weight: 500;
  color: #2d3748;
`;

const SectionTotal = styled.div`
  background: #f7fafc;
  padding: 0.75rem;
  font-weight: 700;
  color: #2d3748;
  border-top: 2px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FinalTotal = styled.div`
  background: #2d3748;
  color: white;
  padding: 1rem;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

export const BalanceSheetViewer = ({
  balanceSheet,
  availableDates,
  filters,
  loading,
  onFiltersChange,
  onGenerateReport,
  onExportPDF,
  onExportExcel
}: BalanceSheetViewerProps) => {
  const [currentDate, setCurrentDate] = useState(filters.date);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const selectDay = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onFiltersChange({ date: selectedDate });
  };

  const isSelectedDay = (day: number) => {
    return filters.date.getDate() === day &&
           filters.date.getMonth() === currentDate.getMonth() &&
           filters.date.getFullYear() === currentDate.getFullYear();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === currentDate.getMonth() &&
           today.getFullYear() === currentDate.getFullYear();
  };

  const days = getDaysInMonth(currentDate);
  const dayHeaders = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  return (
    <Container>
      <Header>
        <Title>Balance General</Title>
        <Subtitle>Seleccione una fecha de corte para generar el reporte</Subtitle>
      </Header>

      <FiltersSection>
        <CalendarContainer>
          <MonthNavigation>
            <NavButton onClick={() => navigateMonth('prev')}>
              <Icon icon="mdi:chevron-left" />
            </NavButton>
            <MonthDisplay>{formatMonthYear(currentDate)}</MonthDisplay>
            <NavButton onClick={() => navigateMonth('next')}>
              <Icon icon="mdi:chevron-right" />
            </NavButton>
          </MonthNavigation>
        </CalendarContainer>

        <ActionButtons>
          <Button $variant="primary" onClick={onGenerateReport} disabled={loading}>
            {loading ? (
              <>
                <Icon icon="mdi:loading" className="animate-spin" />
                Generando...
              </>
            ) : (
              'Generar Reporte'
            )}
          </Button>
          
          {balanceSheet && (
            <Button onClick={onExportPDF}>
              <Icon icon="mdi:download" />
              Exportar
            </Button>
          )}
        </ActionButtons>
      </FiltersSection>

      <Calendar>
        {dayHeaders.map(header => (
          <CalendarHeader key={header}>{header}</CalendarHeader>
        ))}
        {days.map((day, index) => (
          <CalendarDay
            key={index}
            onClick={() => day && selectDay(day)}
            disabled={!day}
            $isSelected={day ? isSelectedDay(day) : false}
            $isToday={day ? isToday(day) : false}
          >
            {day || ''}
          </CalendarDay>
        ))}
      </Calendar>

      {loading && (
        <LoadingContainer>
          <Icon icon="mdi:loading" className="animate-spin" style={{ marginRight: '0.5rem' }} />
          Generando balance general...
        </LoadingContainer>
      )}

      {!loading && !balanceSheet && (
        <EmptyState>
          <Icon icon="mdi:scale-balance" style={{ fontSize: '3rem', marginBottom: '1rem' }} />
          <p>Seleccione una fecha y genere el reporte para ver el balance general</p>
        </EmptyState>
      )}

      {!loading && balanceSheet && (
        <>
          <VerificationSection>
            <VerificationTitle>Verificación de Ecuación Contable</VerificationTitle>
            <VerificationGrid>
              <VerificationItem>
                <VerificationLabel>Total Activo:</VerificationLabel>
                <VerificationAmount>{formatCurrency(balanceSheet.totalAssets)}</VerificationAmount>
              </VerificationItem>
              <VerificationItem>
                <VerificationLabel>Total Pasivo + Capital:</VerificationLabel>
                <VerificationAmount>{formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}</VerificationAmount>
              </VerificationItem>
            </VerificationGrid>
            <VerificationStatus $isBalanced={balanceSheet.isBalanced}>
              <Icon icon={balanceSheet.isBalanced ? "mdi:check-circle" : "mdi:alert-circle"} />
              {balanceSheet.isBalanced ? 'La ecuación contable se cumple.' : 'La ecuación contable NO se cumple.'}
            </VerificationStatus>
          </VerificationSection>

          <BalanceSheetContainer>
            <BalanceSheetHeader>
              {balanceSheet.title}
            </BalanceSheetHeader>

            <BalanceSheetGrid>
              {/* ACTIVOS */}
              <Section $type="asset">
                <SectionHeader $type="asset">Activo</SectionHeader>
                
                {balanceSheet.assets.categories.map(category => (
                  <CategorySection key={category.category}>
                    <CategoryHeader>
                      <span>{category.category}</span>
                      <span>{formatCurrency(category.total)}</span>
                    </CategoryHeader>
                    {category.accounts.map(account => (
                      <AccountRow key={account.id}>
                        <AccountName>{account.name}</AccountName>
                        <AccountBalance>{formatCurrency(account.balance)}</AccountBalance>
                      </AccountRow>
                    ))}
                  </CategorySection>
                ))}
                
                <SectionTotal>
                  <span>Total Activo</span>
                  <span>{formatCurrency(balanceSheet.assets.total)}</span>
                </SectionTotal>
              </Section>

              {/* PASIVOS */}
              <Section $type="liability">
                <SectionHeader $type="liability">Pasivo</SectionHeader>
                
                {balanceSheet.liabilities.categories.map(category => (
                  <CategorySection key={category.category}>
                    <CategoryHeader>
                      <span>{category.category}</span>
                      <span>{formatCurrency(category.total)}</span>
                    </CategoryHeader>
                    {category.accounts.map(account => (
                      <AccountRow key={account.id}>
                        <AccountName>{account.name}</AccountName>
                        <AccountBalance>{formatCurrency(account.balance)}</AccountBalance>
                      </AccountRow>
                    ))}
                  </CategorySection>
                ))}
                
                <SectionTotal>
                  <span>Total Pasivo</span>
                  <span>{formatCurrency(balanceSheet.liabilities.total)}</span>
                </SectionTotal>
              </Section>

              {/* CAPITAL */}
              <Section $type="equity">
                <SectionHeader $type="equity">Capital</SectionHeader>
                
                {balanceSheet.equity.categories.map(category => (
                  <CategorySection key={category.category}>
                    <CategoryHeader>
                      <span>{category.category}</span>
                      <span>{formatCurrency(category.total)}</span>
                    </CategoryHeader>
                    {category.accounts.map(account => (
                      <AccountRow key={account.id}>
                        <AccountName>{account.name}</AccountName>
                        <AccountBalance>{formatCurrency(account.balance)}</AccountBalance>
                      </AccountRow>
                    ))}
                  </CategorySection>
                ))}
                
                <SectionTotal>
                  <span>Total Capital</span>
                  <span>{formatCurrency(balanceSheet.equity.total)}</span>
                </SectionTotal>
              </Section>
            </BalanceSheetGrid>

            <FinalTotal>
              <span>Total Pasivo + Capital</span>
              <span>{formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}</span>
            </FinalTotal>
          </BalanceSheetContainer>
        </>
      )}
    </Container>
  );
};