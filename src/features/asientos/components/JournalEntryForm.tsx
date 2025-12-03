import styled from 'styled-components';
import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import type { CreateJournalEntryRequest, CreateMovementRequest, AccountSummary } from '../types';
import { journalEntrySchema, type JournalEntryFormData } from '../schemas/journalEntrySchemas';

interface JournalEntryFormProps {
  onSubmit: (data: CreateJournalEntryRequest) => Promise<void>;
  accounts: AccountSummary[];
  loading?: boolean;
  initialData?: Partial<CreateJournalEntryRequest>;
}

const FormContainer = styled.div`
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

const FormTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
`;

const DateTimeSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
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
  padding: 0.5rem;
  border: 1px solid ${props => props.$hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  min-width: 0;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#e53e3e' : '#667eea'};
    box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(229, 62, 62, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }
`;

const MovementsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const MovementsTable = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.75rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1.5fr 0.75fr 0.75fr auto;
    gap: 0.5rem;
    padding: 0.5rem;
    font-size: 0.7rem;
  }
`;

const MovementRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 0.75rem;
  padding: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: start;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1.5fr 0.75fr 0.75fr auto;
    gap: 0.5rem;
    padding: 0.5rem;
  }
`;

const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const AccountSelect = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.$hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#e53e3e' : '#667eea'};
  }
`;

const AccountDetails = styled.div`
  font-size: 0.7rem;
  color: #718096;
  line-height: 1.2;
`;

const AmountInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.$hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: right;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#e53e3e' : '#667eea'};
  }
`;

const RemoveButton = styled.button`
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #c53030;
  }
`;

const AddMovementButton = styled.button`
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
  align-self: flex-start;
  
  &:hover {
    background: #2c5aa0;
  }
`;

const TotalsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0.75rem;
  }
`;

const TotalItem = styled.div`
  text-align: center;
`;

const TotalLabel = styled.div`
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 0.25rem;
`;

const TotalAmount = styled.div<{ $type?: 'balanced' | 'unbalanced' }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => {
    if (props.$type === 'balanced') return '#48bb78';
    if (props.$type === 'unbalanced') return '#e53e3e';
    return '#2d3748';
  }};
`;

const CommentsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.$hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 6px;
  font-size: 0.875rem;
  min-height: 70px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#e53e3e' : '#667eea'};
    box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(229, 62, 62, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
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
  gap: 1rem;
  justify-content: flex-end;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.$variant === 'primary' ? `
    background: #3182ce;
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: #2c5aa0;
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

export const JournalEntryForm = ({
  onSubmit,
  accounts,
  loading = false,
  initialData
}: JournalEntryFormProps) => {
  const defaultDate = initialData?.date || new Date();
  const defaultTime = initialData?.time || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const {
    register,
    handleSubmit: handleFormSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      date: defaultDate,
      time: defaultTime,
      description: initialData?.description || '',
      movements: initialData?.movements && initialData.movements.length > 0
        ? initialData.movements
        : [
          { accountId: '', debit: 0, credit: 0 },
          { accountId: '', debit: 0, credit: 0 },
        ],
    },
    mode: 'onChange', // Cambiar a onChange para que watch funcione en tiempo real
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'movements',
  });

  const movements = useWatch({
    control,
    name: 'movements',
  });

  const totals = useMemo(() => {
    if (!movements || movements.length === 0) {
      return { totalDebits: 0, totalCredits: 0, difference: 0, isBalanced: false };
    }

    const totalDebits = movements.reduce((sum, mov) => {
      const debitValue = Number(mov.debit) || 0;
      return sum + debitValue;
    }, 0);

    const totalCredits = movements.reduce((sum, mov) => {
      const creditValue = Number(mov.credit) || 0;
      return sum + creditValue;
    }, 0);

    const difference = totalDebits - totalCredits;
    const isBalanced = Math.abs(difference) < 0.01 && totalDebits > 0 && totalCredits > 0;

    console.log('Totals calculated:', { totalDebits, totalCredits, difference, isBalanced, movements });

    return { totalDebits, totalCredits, difference, isBalanced };
  }, [movements]);

  // Sincronizar con initialData cuando cambie
  useEffect(() => {
    if (initialData) {
      reset({
        date: initialData.date || defaultDate,
        time: initialData.time || defaultTime,
        description: initialData.description || '',
        movements: initialData?.movements && initialData.movements.length > 0
          ? initialData.movements
          : [
            { accountId: '', debit: 0, credit: 0 },
            { accountId: '', debit: 0, credit: 0 },
          ],
      });
    }
  }, [initialData, defaultDate, defaultTime, reset]);

  const addMovement = () => {
    append({ accountId: '', debit: 0, credit: 0 });
  };

  const removeMovement = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const onSubmitForm = async (data: any) => {
    try {
      const entryData: CreateJournalEntryRequest = {
        date: data.date,
        time: data.time,
        description: data.description,
        movements: data.movements.map((mov: any) => ({
          accountId: mov.accountId,
          debit: Number(mov.debit) || 0,
          credit: Number(mov.credit) || 0,
        })),
      };
      await onSubmit(entryData);
      reset();
    } catch (err) {
      console.error('Error al crear asiento:', err);
    }
  };

  const isLoading = loading || isSubmitting;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getSelectedAccount = (accountId: string) => {
    return accounts.find(acc => acc.id === accountId);
  };

  return (
    <FormContainer>
      <FormTitle>Registrar Nueva Transacción en el Libro Diario</FormTitle>

      <Form onSubmit={handleFormSubmit(onSubmitForm)} noValidate id="Journal">
        <DateTimeSection>
          <FormGroup>
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              $hasError={!!errors.date}
              {...register('date', {
                valueAsDate: true,
              })}
              aria-invalid={errors.date ? 'true' : 'false'}
              aria-describedby={errors.date ? 'date-error' : undefined}
            />
            {errors.date && (
              <ErrorMessage id="date-error" role="alert">
                <Icon icon="mdi:alert-circle" />
                {errors.date.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="time">Hora</Label>
            <Input
              id="time"
              type="time"
              $hasError={!!errors.time}
              {...register('time')}
              aria-invalid={errors.time ? 'true' : 'false'}
              aria-describedby={errors.time ? 'time-error' : undefined}
            />
            {errors.time && (
              <ErrorMessage id="time-error" role="alert">
                <Icon icon="mdi:alert-circle" />
                {errors.time.message}
              </ErrorMessage>
            )}
          </FormGroup>
        </DateTimeSection>

        <MovementsSection>
          <SectionTitle>Cuentas y Movimientos</SectionTitle>

          <MovementsTable>
            <TableHeader>
              <span>Cuenta Contable</span>
              <span>Débito</span>
              <span>Crédito</span>
              <span>Acciones</span>
            </TableHeader>

            {fields.map((field, index) => {
              const selectedAccount = getSelectedAccount(watch(`movements.${index}.accountId`));
              const movementError = errors.movements?.[index];

              return (
                <MovementRow key={field.id}>
                  <AccountInfo>
                    <AccountSelect
                      $hasError={!!movementError?.accountId}
                      {...register(`movements.${index}.accountId`, {
                        valueAsNumber: false,
                      })}
                      aria-invalid={movementError?.accountId ? 'true' : 'false'}
                    >
                      <option value="">Seleccionar cuenta...</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                    </AccountSelect>
                    {selectedAccount && (
                      <AccountDetails>
                        Saldo Actual: {formatCurrency(selectedAccount.balance)} (Naturaleza {selectedAccount.nature})
                      </AccountDetails>
                    )}
                    {movementError?.accountId && (
                      <ErrorMessage role="alert">
                        {movementError.accountId.message}
                      </ErrorMessage>
                    )}
                  </AccountInfo>

                  <AmountInput
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    $hasError={!!movementError?.debit}
                    {...register(`movements.${index}.debit`, { valueAsNumber: true })}
                    aria-invalid={movementError?.debit ? 'true' : 'false'}
                  />
                  {movementError?.debit && (
                    <ErrorMessage role="alert">
                      {movementError.debit.message}
                    </ErrorMessage>
                  )}

                  <AmountInput
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    $hasError={!!movementError?.credit}
                    {...register(`movements.${index}.credit`, { valueAsNumber: true })}
                    aria-invalid={movementError?.credit ? 'true' : 'false'}
                  />
                  {movementError?.credit && (
                    <ErrorMessage role="alert">
                      {movementError.credit.message}
                    </ErrorMessage>
                  )}

                  <RemoveButton
                    type="button"
                    onClick={() => removeMovement(index)}
                    disabled={fields.length <= 2}
                    aria-label={`Eliminar movimiento ${index + 1}`}
                  >
                    <Icon icon="mdi:delete" />
                  </RemoveButton>
                </MovementRow>
              );
            })}
          </MovementsTable>

          <AddMovementButton type="button" onClick={addMovement}>
            <Icon icon="mdi:plus" />
            Agregar Asiento
          </AddMovementButton>
        </MovementsSection>

        {errors.movements && typeof errors.movements.message === 'string' && (
          <ErrorMessage role="alert">
            <Icon icon="mdi:alert-circle" />
            {errors.movements.message}
          </ErrorMessage>
        )}

        <TotalsSection>
          <TotalItem>
            <TotalLabel>Total Débitos:</TotalLabel>
            <TotalAmount>{formatCurrency(totals.totalDebits)}</TotalAmount>
          </TotalItem>

          <TotalItem>
            <TotalLabel>Total Créditos:</TotalLabel>
            <TotalAmount>{formatCurrency(totals.totalCredits)}</TotalAmount>
          </TotalItem>

          <TotalItem>
            <TotalLabel>Diferencia:</TotalLabel>
            <TotalAmount $type={totals.isBalanced ? 'balanced' : 'unbalanced'}>
              {formatCurrency(Math.abs(totals.difference))}
            </TotalAmount>
          </TotalItem>
        </TotalsSection>

        <CommentsSection>
          <Label htmlFor="description">Comentarios</Label>
          <TextArea
            id="description"
            placeholder="Añade una descripción detallada de la transacción..."
            $hasError={!!errors.description}
            {...register('description')}
            aria-invalid={errors.description ? 'true' : 'false'}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && (
            <ErrorMessage id="description-error" role="alert">
              <Icon icon="mdi:alert-circle" />
              {errors.description.message}
            </ErrorMessage>
          )}
          <span>La partida debe estar balanceada es decir los debitos deben ser iguales a los creditos</span>
        </CommentsSection>

        <ButtonGroup>
          <Button type="button">
            Cancelar
          </Button>
          <Button type="submit" $variant="primary" disabled={isLoading || !totals.isBalanced}>
            {isLoading ? (
              <>
                <Icon icon="mdi:loading" className="animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Transacción'
            )}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};