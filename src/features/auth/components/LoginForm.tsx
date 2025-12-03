import styled from 'styled-components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import type { LoginRequest } from '../types';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';

interface LoginFormProps {
  onSubmit: (credentials: LoginRequest) => Promise<void>;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  loading?: boolean;
  error?: string | null;
}

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
`;

const LogoSubtext = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin: 0.5rem 0 0 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.$hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#e53e3e' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(229, 62, 62, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 1rem;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #a0aec0;
  font-size: 1rem;
  
  &:hover {
    color: #4a5568;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  accent-color: #667eea;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #4a5568;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #742a2a;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const Link = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: #5a67d8;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
`;

const DividerText = styled.span`
  font-size: 0.875rem;
  color: #718096;
`;

export const LoginForm = ({
  onSubmit,
  onSwitchToRegister,
  onForgotPassword,
  loading = false,
  error
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onBlur', // Validación al perder el foco para mejor UX
  });

  const onSubmitForm = async (data: LoginFormData) => {
    try {
      const loginData: LoginRequest = {
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe,
      };
      await onSubmit(loginData);
      reset(); // Limpiar formulario después de éxito
    } catch (err) {
      // El error se maneja en el componente padre
      console.error('Error en login:', err);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <FormContainer>
      <Logo>
        <LogoIcon>
          <Icon icon="mdi:calculator" />
        </LogoIcon>
        <LogoText>ContaFront</LogoText>
        <LogoSubtext>Sistema Contable Profesional</LogoSubtext>
      </Logo>

      {error && (
        <ErrorMessage>
          <Icon icon="mdi:alert-circle" />
          {error}
        </ErrorMessage>
      )}

      <Form onSubmit={handleFormSubmit(onSubmitForm)} noValidate>
        <FormGroup>
          <Label htmlFor="email">Nombre de usuario</Label>
          <InputContainer>
            <InputIcon>
              <Icon icon="mdi:email" />
            </InputIcon>
            <Input
              id="username"
              type="text"
              placeholder="tu nickname o usuario"
              autoComplete="current-username"
              $hasError={!!errors.username || !!error}
              {...register('username')}
              aria-invalid={errors.username ? 'true' : 'false'}
              aria-describedby={errors.username ? 'email-error' : undefined}
            />
          </InputContainer>
          {errors.username && (
            <ErrorMessage id="email-error" role="alert">
              <Icon icon="mdi:alert-circle" />
              {errors.username.message}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Contraseña</Label>
          <InputContainer>
            <InputIcon>
              <Icon icon="mdi:lock" />
            </InputIcon>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              $hasError={!!errors.password || !!error}
              {...register('password')}
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} />
            </PasswordToggle>
          </InputContainer>
          {errors.password && (
            <ErrorMessage id="password-error" role="alert">
              <Icon icon="mdi:alert-circle" />
              {errors.password.message}
            </ErrorMessage>
          )}
        </FormGroup>

        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="rememberMe"
            {...register('rememberMe')}
          />
          <CheckboxLabel htmlFor="rememberMe">
            Recordar mi sesión
          </CheckboxLabel>
        </CheckboxContainer>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Icon icon="mdi:loading" className="animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            <>
              <Icon icon="mdi:login" />
              Iniciar Sesión
            </>
          )}
        </SubmitButton>
      </Form>

      <LinksContainer>
        <Link type="button" onClick={onForgotPassword}>
          ¿Olvidaste tu contraseña?
        </Link>
        
        <Divider>
          <DividerText>¿No tienes cuenta?</DividerText>
        </Divider>
        
        <Link type="button" onClick={onSwitchToRegister}>
          Crear cuenta nueva
        </Link>
      </LinksContainer>
    </FormContainer>
  );
};