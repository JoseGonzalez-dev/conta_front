import styled from 'styled-components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import type { RegisterRequest } from '../types';
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas';

interface RegisterFormProps {
  onSubmit: (userData: RegisterRequest) => Promise<void>;
  onSwitchToLogin: () => void;
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
  gap: 1.25rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
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

const PasswordStrength = styled.div<{ $strength: number }>`
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.$strength}%;
    background: ${props => {
      if (props.$strength < 30) return '#e53e3e';
      if (props.$strength < 60) return '#d69e2e';
      if (props.$strength < 80) return '#38a169';
      return '#48bb78';
    }};
    transition: all 0.3s ease;
  }
`;

const PasswordHint = styled.div`
  font-size: 0.75rem;
  color: #718096;
  margin-top: 0.25rem;
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
  justify-content: center;
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

export const RegisterForm = ({
  onSubmit,
  onSwitchToLogin,
  loading = false,
  error
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const password = watch('password');

  const calculatePasswordStrength = (pwd: string): number => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password || '');

  const getPasswordHint = (): string => {
    if (!password || password.length === 0) return '';
    if (passwordStrength < 30) return 'Contraseña muy débil';
    if (passwordStrength < 60) return 'Contraseña débil';
    if (passwordStrength < 80) return 'Contraseña buena';
    return 'Contraseña fuerte';
  };

  const onSubmitForm = async (data: RegisterFormData) => {
    try {
      const registerData = {
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      await onSubmit(registerData);
      reset(); // Limpiar formulario después de éxito
    } catch (err) {
      console.error('Error en registro:', err);
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
        <LogoSubtext>Crear cuenta nueva</LogoSubtext>
      </Logo>

      {error && (
        <ErrorMessage>
          <Icon icon="mdi:alert-circle" />
          {error}
        </ErrorMessage>
      )}

      <Form onSubmit={handleFormSubmit(onSubmitForm)} noValidate>
        <FormGroup>
          <Label htmlFor="fullname">Nombre Completo</Label>
          <InputContainer>
            <InputIcon>
              <Icon icon="mdi:account" />
            </InputIcon>
            <Input
              id="fullname"
              type="text"
              placeholder="Tu nombre completo"
              autoComplete="name"
              $hasError={!!errors.fullname}
              {...register('fullname')}
              aria-invalid={errors.fullname ? 'true' : 'false'}
              aria-describedby={errors.fullname ? 'fullname-error' : undefined}
            />
          </InputContainer>
          {errors.fullname && (
            <ErrorMessage id="fullname-error" role="alert">
              <Icon icon="mdi:alert-circle" />
              {errors.fullname.message}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="username">Nombre de Usuario</Label>
          <InputContainer>
            <InputIcon>
              <Icon icon="mdi:account-circle" />
            </InputIcon>
            <Input
              id="username"
              type="text"
              placeholder="Nombre de usuario"
              autoComplete="username"
              $hasError={!!errors.username}
              {...register('username')}
              aria-invalid={errors.username ? 'true' : 'false'}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
          </InputContainer>
          {errors.username && (
            <ErrorMessage id="username-error" role="alert">
              <Icon icon="mdi:alert-circle" />
              {errors.username.message}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Correo Electrónico</Label>
          <InputContainer>
            <InputIcon>
              <Icon icon="mdi:email" />
            </InputIcon>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              $hasError={!!errors.email}
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </InputContainer>
          {errors.email && (
            <ErrorMessage id="email-error" role="alert">
              <Icon icon="mdi:alert-circle" />
              {errors.email.message}
            </ErrorMessage>
          )}
        </FormGroup>



        <FormRow>
          <FormGroup>
            <Label htmlFor="password">Contraseña</Label>
            <InputContainer>
              <InputIcon>
                <Icon icon="mdi:lock" />
              </InputIcon>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                autoComplete="new-password"
                $hasError={!!errors.password}
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
            {password && (
              <>
                <PasswordStrength $strength={passwordStrength} />
                <PasswordHint>{getPasswordHint()}</PasswordHint>
              </>
            )}
            {errors.password && (
              <ErrorMessage id="password-error" role="alert">
                <Icon icon="mdi:alert-circle" />
                {errors.password.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <InputContainer>
              <InputIcon>
                <Icon icon="mdi:lock-check" />
              </InputIcon>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirmar"
                autoComplete="new-password"
                $hasError={!!errors.confirmPassword}
                {...register('confirmPassword')}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
              >
                <Icon icon={showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'} />
              </PasswordToggle>
            </InputContainer>
            {errors.confirmPassword && (
              <ErrorMessage id="confirmPassword-error" role="alert">
                <Icon icon="mdi:alert-circle" />
                {errors.confirmPassword.message}
              </ErrorMessage>
            )}
          </FormGroup>
        </FormRow>



        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Icon icon="mdi:loading" className="animate-spin" />
              Creando cuenta...
            </>
          ) : (
            <>
              <Icon icon="mdi:account-plus" />
              Crear Cuenta
            </>
          )}
        </SubmitButton>
      </Form>

      <LinksContainer>
        <Divider>
          <DividerText>¿Ya tienes cuenta?</DividerText>
        </Divider>
        
        <Link type="button" onClick={onSwitchToLogin}>
          Iniciar sesión
        </Link>
      </LinksContainer>
    </FormContainer>
  );
};