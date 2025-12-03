import { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { closingService } from '../services/closingService';

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
  margin: 0;
`;

const InfoBox = styled.div`
  background: #ebf8ff;
  border: 1px solid #90cdf4;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: start;
  gap: 0.75rem;
`;

const InfoIcon = styled.div`
  color: #3182ce;
  flex-shrink: 0;
`;

const InfoText = styled.div`
  font-size: 0.875rem;
  color: #2c5282;
  line-height: 1.5;
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

const Input = styled.input`
  max-width: 300px;
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
  
  &:disabled {
    background: #f7fafc;
    color: #a0aec0;
  }
`;

const TextInput = styled(Input)``;
const DateInput = styled(Input).attrs({ type: 'date' })``;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' }>`
  padding: 0.75rem 2rem;
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
    opacity: 0.6;
  }
`;

const SuccessMessage = styled.div`
  background: #c6f6d5;
  border: 1px solid #9ae6b4;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SuccessIcon = styled.div`
  color: #22543d;
  flex-shrink: 0;
`;

const SuccessText = styled.div`
  font-size: 0.875rem;
  color: #22543d;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ErrorIcon = styled.div`
  color: #742a2a;
  flex-shrink: 0;
`;

const ErrorText = styled.div`
  font-size: 0.875rem;
  color: #742a2a;
`;

export const OpeningProcess = () => {
    const [startDate, setStartDate] = useState('');
    const [periodName, setPeriodName] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExecuteOpening = async () => {
        if (!startDate) {
            setError('Debe seleccionar una fecha de apertura');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await closingService.executeOpening({
                startDate: new Date(startDate),
                periodName: periodName || undefined
            });

            setSuccess(true);
            // Reset form after 3 seconds
            setTimeout(() => {
                setStartDate('');
                setPeriodName('');
                setSuccess(false);
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Error al realizar la apertura contable');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setStartDate('');
        setPeriodName('');
        setSuccess(false);
        setError(null);
    };

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <Container>
            <Header>
                <Title>Apertura Contable</Title>
                <Subtitle>Inicia un nuevo período contable transfiriendo los saldos de balance</Subtitle>
            </Header>

            <InfoBox>
                <InfoIcon>
                    <Icon icon="mdi:information" width={24} />
                </InfoIcon>
                <InfoText>
                    <strong>¿Qué es la apertura contable?</strong><br />
                    La apertura contable consiste en registrar los saldos iniciales de las cuentas de balance
                    (Activo, Pasivo y Patrimonio) al inicio de un nuevo ejercicio contable. Este proceso
                    transfiere automáticamente los saldos finales del período anterior a las mismas cuentas
                    para el nuevo período.
                </InfoText>
            </InfoBox>

            {success && (
                <SuccessMessage>
                    <SuccessIcon>
                        <Icon icon="mdi:check-circle" width={24} />
                    </SuccessIcon>
                    <SuccessText>
                        ¡Apertura contable realizada exitosamente! Los saldos han sido transferidos.
                    </SuccessText>
                </SuccessMessage>
            )}

            {error && (
                <ErrorMessage>
                    <ErrorIcon>
                        <Icon icon="mdi:alert-circle" width={24} />
                    </ErrorIcon>
                    <ErrorText>{error}</ErrorText>
                </ErrorMessage>
            )}

            <Section>
                <SectionTitle>Información del Nuevo Período</SectionTitle>

                <FormGroup>
                    <Label htmlFor="periodName">Nombre del Período (Opcional)</Label>
                    <TextInput
                        id="periodName"
                        value={periodName}
                        onChange={(e) => setPeriodName(e.target.value)}
                        placeholder="Ej: Período Fiscal 2025"
                        disabled={loading}
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="startDate">Fecha de Apertura *</Label>
                    <DateInput
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={today}
                        disabled={loading}
                    />
                </FormGroup>
            </Section>

            <ButtonGroup>
                <Button
                    $variant="secondary"
                    onClick={handleReset}
                    disabled={loading || (!startDate && !periodName)}
                >
                    <Icon icon="mdi:refresh" width={18} />
                    Limpiar
                </Button>
                <Button
                    $variant="success"
                    onClick={handleExecuteOpening}
                    disabled={loading || !startDate}
                >
                    {loading ? (
                        <>
                            <Icon icon="mdi:loading" className="animate-spin" width={18} />
                            Procesando...
                        </>
                    ) : (
                        <>
                            <Icon icon="mdi:lock-open-check" width={18} />
                            Ejecutar Apertura
                        </>
                    )}
                </Button>
            </ButtonGroup>
        </Container>
    );
};
