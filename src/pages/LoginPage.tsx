// import { useState } from 'react';
// import Button from '../components/UI/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
// import AuthService from '../services/api/AuthService';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppDispatch } from "../services/redux/hooks";
import { setUser } from "../services/redux/fiatures/userSlice.ts";
// import { useAppDispatch, useAppSelector } from '../services/redux/hooks.ts';

import { login } from '../services/api/AuthService.tsx';
import { setUserIdButUsingTheMostMasochisticWayPossible } from '../services/api/PostService.tsx';


const loginSchema = z.object({
  username: z.string().min(2, "Username не должен быть меньше 2 символов"),
  password: z.string().min(4, "Пароль не должен быть меньше 4 символов")
});

type TLoginSchema = z.infer<typeof loginSchema>;



const LoginPage = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const {register, handleSubmit, formState: {errors}, setError, getValues} = useForm<TLoginSchema>({resolver: zodResolver(loginSchema)});
  const loginMutation = useMutation({
    mutationFn: async ({username, password}: TLoginSchema) => await login(username, password),
    onSuccess: async () => {
      const user = await setUserIdButUsingTheMostMasochisticWayPossible();
      dispatch(setUser(user));
      navigate(`/user/${getValues().username}`);
    },
    onError: () => {
      setError("password", {
        type: "server",
        message: "неверный логин или пароль"
      });
    }
  });

  const onSubmitHandle = (data: TLoginSchema) => {
    loginMutation.mutate(data);
  }

  
  return (
    <div className="login">
      <div className="login__title">Вход</div>
      <form onSubmit={handleSubmit(onSubmitHandle)}>
        <input {...register("username")} className="login__email form-input" type="text" placeholder='Логин...' autoComplete="new-password"/>
          {errors.username && <p className='error-form-message'>{`${errors.username.message}`}</p>}
        <input {...register("password")} className="login__password form-input" type="password" placeholder='Пароль...' autoComplete="new-password"/>
          {errors.password && <p className='error-form-message'>{`${errors.password.message}`}</p>}
        <button className="login__button" onClick={() => {}} type='submit'>Войти</button>
      </form>
      <div className="login__text">
        <p className='login__text-ask'>Еще нет аккаунта?</p>
        <NavLink to={`/signin`} className='login__text-registration'>Зарегистрироваться</NavLink>
      </div>
    </div>
  );
};

export default LoginPage;