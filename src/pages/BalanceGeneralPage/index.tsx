import styled from 'styled-components';
import { BalanceSheetViewer } from '../../features/balance-general/components/BalanceSheetViewer';
import { useBalanceSheet } from '../../features/balance-general/hooks/useBalanceSheet';

const Container = styled.div`
  min-height: 100vh;
  background: transparent;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const PageLayout = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const BalanceGeneralPage = () => {
  const {
    currentBalance,
    availableDates,
    filters,
    loading,
    error,
    generateBalanceSheet,
    updateFilters,
    exportToPDF,
    exportToExcel
  } = useBalanceSheet();

  const handleGenerateReport = () => {
    generateBalanceSheet();
  };

  if (error) {
    return (
      <Container>
        <div style={{ 
          background: '#fed7d7', 
          color: '#742a2a', 
          padding: '1rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          Error: {error}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PageLayout>
        <BalanceSheetViewer
          balanceSheet={currentBalance}
          availableDates={availableDates}
          filters={filters}
          loading={loading}
          onFiltersChange={updateFilters}
          onGenerateReport={handleGenerateReport}
          onExportPDF={exportToPDF}
          onExportExcel={exportToExcel}
        />
      </PageLayout>
    </Container>
  );
};