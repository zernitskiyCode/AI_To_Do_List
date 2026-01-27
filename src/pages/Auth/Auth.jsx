import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './Auth.scss';
import { useAuth } from '../../hooks/useAuth';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, register: registerUser, loginLoading, registerLoading, loginError, registerError } = useAuth(); 
  

  const [authMode, setAuthMode] = useState('login'); // login | register


  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);


  const loginSchema = yup.object().shape({
    email: yup.string().required('Email обязателен').email('Некорректный email'),
    password: yup.string().required('Пароль обязателен').min(6, 'Минимум 6 символов'),
  });

  const registerSchema = yup.object().shape({
    name: yup.string().required('Имя обязательно').min(2, 'Слишком короткое'),
    surname: yup.string().required('Фамилия обязательна').min(2, 'Слишком короткая'),
    email: yup.string().required('Email обязателен').email('Некорректный email'),
    password: yup.string().required('Пароль обязателен').min(6, 'Минимум 6 символов'),
  });


  const schema = authMode === 'login' ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      name: data.name?.trim(),
      surname: data.surname?.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
    };

    if (authMode === 'login') {
      login(formattedData);
    } else {
      registerUser(formattedData);
    }
  };

  const handleToggleMode = () => {
    setAuthMode((prev) => (prev === 'login' ? 'register' : 'login'));
    reset(); 
  };

  const isLoading = authMode === 'login' ? loginLoading : registerLoading;
  const error = authMode === 'login' ? loginError : registerError;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">AI To-Do List</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {authMode === 'register' && (
            <>
              <div className="form-group">
                <label htmlFor="name">Имя</label>
                <input id="name" type="text" placeholder="Ваше имя" {...register('name')} className="form-input" />
                {errors.name && <div className="error-message">{errors.name.message}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="surname">Фамилия</label>
                <input id="surname" type="text" placeholder="Ваша фамилия" {...register('surname')} className="form-input" />
                {errors.surname && <div className="error-message">{errors.surname.message}</div>}
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="Ваш email" {...register('email')} className="form-input" />
            {errors.email && <div className="error-message">{errors.email.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input id="password" type="password" placeholder="Ваш пароль" {...register('password')} className="form-input" />
            {errors.password && <div className="error-message">{errors.password.message}</div>}
          </div>

          {error && (
            <div className="error-message">
              {error.response?.data?.message || 'Ошибка'}
            </div>
          )}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Загрузка...' : authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {authMode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <button type="button" onClick={handleToggleMode} className="toggle-button">
              {authMode === 'login' ? 'Зарегистрируйтесь' : 'Войдите'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;