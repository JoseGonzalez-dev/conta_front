import styled from 'styled-components';
import { LedgerViewer } from '../../features/libro-mayor/components/LedgerViewer';
import { useLedger } from '../../features/libro-mayor/hooks/useLedger';

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

export const LibroMayorPage = () => {
  const {
    accounts,
    currentReport,
    loading,
    error,
    filters,
    generateReport,
    updateFilters,
    exportToPDF,
    exportToExcel
  } = useLedger();

  const handleGenerateReport = () => {
    generateReport();
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
        <LedgerViewer
          accounts={accounts}
          filters={filters}
          report={currentReport}
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