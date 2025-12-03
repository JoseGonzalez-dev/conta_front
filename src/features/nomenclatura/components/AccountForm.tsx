import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { AccountType } from '../types';
import type { CreateAccountRequest, Account } from '../types';
import { accountSchema, type AccountFormData } from '../schemas/accountSchemas';

interface AccountFormProps {
  onSubmit: (data: CreateAccountRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  accounts?: Account[];
}

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
`;

const FormSubtitle = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin: 0 0 2rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.$hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  min-width: 0;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#e53e3e' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(229, 62, 62, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const Select = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.$hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  min-width: 0;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#e53e3e' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(229, 62, 62, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }
`;

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.$hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 0.875rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  min-width: 0;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#e53e3e' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(229, 62, 62, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #742a2a;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    justify-content: stretch;
    
    button {
      flex: 1;
    }
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.$variant === 'primary' ? `
    background: #48bb78;
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: #38a169;
    }
    
    &:disabled {
      background: #a0aec0;
      cursor: not-allowed;
    }
  ` : `
    background: transparent;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    
    &:hover:not(:disabled) {
      background: #f7fafc;
    }
  `}
`;

export const AccountForm = ({ onSubmit, onCancel, loading = false, accounts = [] }: AccountFormProps) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      code: '',
      name: '',
      type: AccountType.ACTIVO,
      parentId: undefined,
      isDetail: false,
      isActive: true,
    },
    mode: 'onBlur',
  });

  const onSubmitForm = async (data: AccountFormData) => {
    try {
      const accountData: CreateAccountRequest = {
        code: data.code,
        name: data.name,
        type: data.type,
        parentId: data.parentId || undefined,
        isDetail: data.isDetail,
        isActive: data.isActive,
      };
      await onSubmit(accountData);
      reset(); // Limpiar formulario después de éxito
    } catch (err) {
      console.error('Error al crear cuenta:', err);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <FormContainer>
      <FormTitle>Crear Nueva Cuenta</FormTitle>
      <FormSubtitle>Rellena el formulario para añadir una nueva cuenta al plan.</FormSubtitle>

      <Form onSubmit={handleFormSubmit(onSubmitForm)} noValidate>
        <FormRow>
          <FormGroup>
            <Label htmlFor="code">Código de la cuenta</Label>
            <Input
              id="code"
              type="text"
              placeholder="Ej. 1.1.01"
              $hasError={!!errors.code}
              {...register('code')}
              aria-invalid={errors.code ? 'true' : 'false'}
              aria-describedby={errors.code ? 'code-error' : undefined}
            />
            {errors.code && (
              <ErrorMessage id="code-error" role="alert">
                <Icon icon="mdi:alert-circle" />
                {errors.code.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="name">Nombre de la cuenta</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ej. Caja General"
              $hasError={!!errors.name}
              {...register('name')}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <ErrorMessage id="name-error" role="alert">
                <Icon icon="mdi:alert-circle" />
                {errors.name.message}
              </ErrorMessage>
            )}
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="type">Tipo de cuenta</Label>
            <Select
              id="type"
              $hasError={!!errors.type}
              {...register('type')}
              aria-invalid={errors.type ? 'true' : 'false'}
              aria-describedby={errors.type ? 'type-error' : undefined}
            >
              {Object.values(AccountType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
            {errors.type && (
              <ErrorMessage id="type-error" role="alert">
                <Icon icon="mdi:alert-circle" />
                {errors.type.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="parentId">Cuenta Padre (Opcional)</Label>
            <Select
              id="parentId"
              {...register('parentId', {
                setValueAs: (value) => value === '' ? undefined : Number(value)
              })}
            >
              <option value="">Ninguna</option>
              {accounts
                .filter(acc => !acc.isDetail) // Solo mostrar cuentas que no son de detalle
                .map(account => (
                  <option key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </option>
                ))}
            </Select>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="isDetail">
              <input
                id="isDetail"
                type="checkbox"
                {...register('isDetail')}
                style={{ marginRight: '0.5rem' }}
              />
              Es cuenta de detalle
            </Label>
            {errors.isDetail && (
              <ErrorMessage id="isDetail-error" role="alert">
                <Icon icon="mdi:alert-circle" />
                {errors.isDetail.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="isActive">
              <input
                id="isActive"
                type="checkbox"
                {...register('isActive')}
                style={{ marginRight: '0.5rem' }}
              />
              Cuenta activa
            </Label>
            {errors.isActive && (
              <ErrorMessage id="isActive-error" role="alert">
                <Icon icon="mdi:alert-circle" />
                {errors.isActive.message}
              </ErrorMessage>
            )}
          </FormGroup>
        </FormRow>

        <ButtonGroup>
          <Button type="button" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" $variant="primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <Icon icon="mdi:loading" className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Icon icon="mdi:plus" />
                Guardar Cuenta
              </>
            )}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};