import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { AccountType } from '../types';
import type { Account } from '../types';

interface AccountsListProps {
  accounts: Account[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
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

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  min-width: 0;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 1rem;
`;

const AccountsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TableScrollContainer = styled.div`
  height: 500px;
  overflow-y: auto;
  padding-right: 8px;
  
  /* Estilos personalizados para la barra de scroll */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
    
    &:hover {
      background: #94a3b8;
    }
  }
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StickyTableHeader = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr 120px 80px;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  position: sticky;
  top: 0;
  z-index: 10;
  
  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr 100px 60px;
    gap: 0.5rem;
    font-size: 0.7rem;
  }
`;

const AccountGroup = styled.div`
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  border-left: 4px solid #e2e8f0;
`;

const GroupHeader = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$color) {
      case '#48bb78': return 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)'; // Verde activo
      case '#e53e3e': return 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)'; // Rojo pasivo
      case '#3182ce': return 'linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%)'; // Azul capital
      case '#d69e2e': return 'linear-gradient(135deg, #fbd38d 0%, #f6ad55 100%)'; // Naranja ingreso
      case '#d53f8c': return 'linear-gradient(135deg, #fbb6ce 0%, #f687b3 100%)'; // Rosa gasto
      default: return 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
    }
  }};
  color: #2d3748;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const GroupIcon = styled.div<{ $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

const AccountRow = styled.div<{ $isChild?: boolean; $typeColor?: string }>`
  display: grid;
  grid-template-columns: 100px 1fr 120px 80px;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  align-items: center;
  border-bottom: 1px solid #f0f4f8;
  transition: all 0.2s ease;
  min-width: 400px;
  background: ${props => props.$isChild ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.5)'};
  border-left: 3px solid ${props => props.$typeColor ? `${props.$typeColor}33` : 'transparent'};
  
  &:hover {
    background: ${props => props.$isChild ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.8)'};
    border-left-color: ${props => props.$typeColor ? props.$typeColor : 'transparent'};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr 100px 60px;
    gap: 0.5rem;
    min-width: 350px;
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

const AccountTypeTag = styled.span<{ $type: AccountType }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch (props.$type) {
      case AccountType.ACTIVO:
        return 'background: #c6f6d5; color: #22543d;';
      case AccountType.PASIVO:
        return 'background: #fed7d7; color: #742a2a;';
      case AccountType.PATRIMONIO:
        return 'background: #bee3f8; color: #2a4365;';
      case AccountType.INGRESO:
        return 'background: #faf089; color: #744210;';
      case AccountType.GASTO:
        return 'background: #fbb6ce; color: #702459;';
      default:
        return 'background: #e2e8f0; color: #4a5568;';
    }
  }}
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #718096;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #718096;
`;

const getAccountTypeColor = (type: AccountType): string => {
  switch (type) {
    case AccountType.ACTIVO: return '#48bb78';
    case AccountType.PASIVO: return '#e53e3e';
    case AccountType.PATRIMONIO: return '#3182ce';
    case AccountType.INGRESO: return '#d69e2e';
    case AccountType.GASTO: return '#d53f8c';
    default: return '#718096';
  }
};

const getAccountTypeIcon = (type: AccountType): string => {
  switch (type) {
    case AccountType.ACTIVO: return 'mdi:trending-up';
    case AccountType.PASIVO: return 'mdi:trending-down';
    case AccountType.PATRIMONIO: return 'mdi:bank';
    case AccountType.INGRESO: return 'mdi:plus-circle';
    case AccountType.GASTO: return 'mdi:minus-circle';
    default: return 'mdi:circle';
  }
};

export const AccountsList = ({ accounts, loading, searchTerm, onSearchChange }: AccountsListProps) => {
  // Agrupar cuentas por tipo
  const groupedAccounts = accounts.reduce((groups, account) => {
    const type = account.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(account);
    return groups;
  }, {} as Record<AccountType, Account[]>);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Icon icon="mdi:loading" className="animate-spin" style={{ marginRight: '0.5rem' }} />
          Cargando cuentas...
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Nomenclatura Contable</Title>
        <Subtitle>Visualiza, crea y gestiona las cuentas de tu empresa.</Subtitle>

        <SearchContainer>
          <SearchIcon>
            <Icon icon="mdi:magnify" />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar cuenta por código o nombre..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </SearchContainer>
      </Header>

      <TableWrapper>
        <StickyTableHeader>
          <span>Código</span>
          <span>Nombre de la Cuenta</span>
          <span>Tipo</span>
        </StickyTableHeader>

        <TableScrollContainer>
          <AccountsTable>
            {Object.entries(groupedAccounts).map(([type, typeAccounts]) => (
              <AccountGroup key={type}>
                <GroupHeader $color={getAccountTypeColor(type as AccountType)}>
                  <GroupIcon $color={getAccountTypeColor(type as AccountType)}>
                    <Icon icon={getAccountTypeIcon(type as AccountType)} />
                  </GroupIcon>
                  {type}
                </GroupHeader>

                {typeAccounts.map((account) => (
                  <AccountRow
                    key={account.id}
                    $isChild={!!account.parentId}
                    $typeColor={getAccountTypeColor(type as AccountType)}
                  >
                    <AccountCode>{account.code}</AccountCode>
                    <AccountName>{account.name}</AccountName>
                    <AccountTypeTag $type={account.type}>
                      {account.type}
                    </AccountTypeTag>
                    {/* Podrian ir acciones para editar y eliminar la cuenta */}
                  </AccountRow>
                ))}
              </AccountGroup>
            ))}

            {accounts.length === 0 && !loading && (
              <EmptyState>
                <Icon icon="mdi:folder-open" style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                <p>No se encontraron cuentas</p>
              </EmptyState>
            )}
          </AccountsTable>
        </TableScrollContainer>
      </TableWrapper>
    </Container>
  );
};