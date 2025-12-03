import styled from 'styled-components';
import { useState } from 'react';
import { AccountsList } from '../../features/nomenclatura/components/AccountsList';
import { AccountForm } from '../../features/nomenclatura/components/AccountForm';
import { useAccounts } from '../../features/nomenclatura/hooks/useAccounts';
import type { CreateAccountRequest } from '../../features/nomenclatura/types';

const Container = styled.div`
  min-height: 100vh;
  background: transparent;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const PageLayout = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 420px;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 450px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const NomenclaturaPage = () => {
  const {
    accounts,
    filteredAccounts,
    loading,
    error,
    searchTerm,
    createAccount,
    updateSearchTerm
  } = useAccounts();

  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateAccount = async (accountData: CreateAccountRequest) => {
    setFormLoading(true);
    try {
      await createAccount(accountData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating account:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  return (
    <Container>
      <PageLayout>
        <MainContent>
          <AccountsList
            accounts={filteredAccounts}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={updateSearchTerm}
          />
        </MainContent>

        <Sidebar>
          {showForm ? (
            <AccountForm
              onSubmit={handleCreateAccount}
              onCancel={handleCancelForm}
              loading={formLoading}
              accounts={accounts}
            />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '1rem 2rem',
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Crear Nueva Cuenta
              </button>
            </div>
          )}
        </Sidebar>
      </PageLayout>
    </Container>
  );
};