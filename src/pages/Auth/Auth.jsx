import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { LoginApi } from '../../api/loginApi';
import './Auth.scss';


            // id SERIAL PRIMARY KEY,
            // NAME TEXT NOT NULL,
            // SURNAME TEXT NOT NULL,
            // email TEXT NOT NULL UNIQUE,
            // password TEXT NOT NULL,

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  // YUP
  const schema = yup.object().shape({
    firstName: yup.string()
      .required('Имя обязательно')
      .min(2, 'Слишком короткое имя'),
    lastName: yup.string()
      .required('Фамилия обязательна')
      .min(3, 'Слишком короткая фамилия')
  });

  // RHF
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: ''
    },
  });

  // Mutation
  const loginMutation = useMutation({
    mutationFn: (data) => LoginApi.post('/login', data),
    onSuccess: (response) => { 
      localStorage.setItem('user', JSON.stringify(response.data));
      onAuthSuccess(response.data);
      reset();
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data) => LoginApi.post('/registration', data),
    onSuccess: (response) => { 
      localStorage.setItem('user', JSON.stringify(response.data));
      onAuthSuccess(response.data);
      reset();
    },
  });


  const onSubmit = (data) => {
    const mutation = isLogin ? loginMutation : registerMutation;
    
    mutation.reset();

    mutation.mutate({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim()
    });
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    reset();

    loginMutation.reset();
    registerMutation.reset();
  };

  const activeMutation = isLogin ? loginMutation : registerMutation;

   return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">AI To-Do List</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="firstName">Имя</label>
            <input
              id="firstName"
              type="text"
              placeholder="Введите ваше имя"
              {...register('firstName')}
              className="form-input"
            />
            {errors.firstName && <div className="error-message">{errors.firstName.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Фамилия</label>
            <input
              id="lastName"
              type="text"
              placeholder="Введите вашу фамилию"
              {...register('lastName')}
              className="form-input"
            />
            {errors.lastName && <div className="error-message">{errors.lastName.message}</div>}
          </div>

          {activeMutation.isError && (
            <div className="error-message">
              {activeMutation.error.response?.data?.message || 'Произошла ошибка'}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button" 
            disabled={activeMutation.isPending}
          >
            {activeMutation.isPending ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <button 
              type="button"
              onClick={handleToggleMode}
              className="toggle-button"
            >
              {isLogin ? 'Зарегистрируйтесь' : 'Войдите'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;