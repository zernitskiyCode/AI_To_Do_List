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
    mode: 'onSubmit',
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

          {authMutation.isError && (
            <div className="error-message">
              {authMutation.error.response?.data?.message || 'Ошибка'}
            </div>
          )}

          <button type="submit" className="auth-button" disabled={authMutation.isPending}>
            {authMutation.isPending ? 'Загрузка...' : authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
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