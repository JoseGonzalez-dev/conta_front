import styled from 'styled-components';
import { JournalEntryForm } from '../../features/asientos/components/JournalEntryForm';
import { useJournalEntries } from '../../features/asientos/hooks/useJournalEntries';
import { CreateJournalEntryRequest } from '../../features/asientos/types';

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
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

export const AsientosPage = () => {
  const { 
    currentEntry,
    accounts,
    loading,
    error,
    createEntry,
    updateCurrentEntry,
    resetCurrentEntry
  } = useJournalEntries();

  const handleCreateEntry = async (entryData: CreateJournalEntryRequest) => {
    try {
      await createEntry(entryData);
      // Opcional: mostrar mensaje de éxito o redirigir
      console.log('Asiento creado exitosamente');
    } catch (error) {
      console.error('Error creating journal entry:', error);
      // Aquí podrías mostrar un toast o mensaje de error
    }
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
        <JournalEntryForm
          onSubmit={handleCreateEntry}
          accounts={accounts}
          loading={loading}
          initialData={currentEntry}
        />
      </PageLayout>
    </Container>
  );
};