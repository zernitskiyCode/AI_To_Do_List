import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Api from '../../api/Api';
import './Auth.scss';
import { useAuthStore } from '../../hooks/useAuthStore';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, register: registerUser } = useAuthStore(); 
  

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
    mode: 'onTouched',
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
    },
  });

  const authMutation = useMutation({
    mutationFn: (data) => {
      const endpoint = authMode === 'login' ? '/login' : '/registration';
      return Api.post(endpoint, data);
      
    },
    onSuccess: (response) => {
      const user = response.data;
      console.log(user);
      if (authMode === 'login') {
        login(user, user.token);
      } else {
        registerUser(user, user.token);
      }
      
      reset();
      navigate('/', { replace: true }); 
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

    authMutation.mutate(formattedData);
  };

  const handleToggleMode = () => {
    setAuthMode((prev) => (prev === 'login' ? 'register' : 'login'));
    reset(); 
    authMutation.reset();
  };

  const handleForgotPassword = () => {
    // TODO: Логика восстановления пароля
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">AI To-Do List</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          {authMode === 'register' && (
            <>
              <div className="form-group">
                <label htmlFor="name">Имя</label>
                <input id="name" type="text" placeholder="Ваше имя" {...register('name')} className="form-input" tabIndex={1} />
                {errors.name && <div className="error-message">{errors.name.message}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="surname">Фамилия</label>
                <input id="surname" type="text" placeholder="Ваша фамилия" {...register('surname')} className="form-input" tabIndex={2} />
                {errors.surname && <div className="error-message">{errors.surname.message}</div>}
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="Ваш email" {...register('email')} className="form-input" autoComplete="off" tabIndex={authMode === 'register' ? 3 : 1} />
            {errors.email && <div className="error-message">{errors.email.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input id="password" type="password" placeholder="Ваш пароль" {...register('password')} className="form-input" tabIndex={authMode === 'register' ? 4 : 2} />
            {errors.password && <div className="error-message">{errors.password.message}</div>}
          </div>

          {authMutation.isError && (
            <div className="error-message">
              {authMutation.error.response?.data?.message || 'Ошибка'}
            </div>
          )}

          <button type="submit" className="auth-button" disabled={authMutation.isPending} tabIndex={authMode === 'register' ? 5 : 3}>
            {authMutation.isPending ? 'Загрузка...' : authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {authMode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <button type="button" onClick={handleToggleMode} className="toggle-button" tabIndex={authMode === 'register' ? 6 : 4}>
              {authMode === 'login' ? 'Зарегистрируйтесь' : 'Войдите'}
            </button>
          </p>
          {authMode === 'login' && (
            <button type="button" onClick={handleForgotPassword} className="forgot-button" tabIndex={5}>
              Забыли пароль?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;