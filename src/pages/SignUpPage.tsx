import { NavLink, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { setUser } from "../services/redux/fiatures/userSlice.ts";
import { useAppDispatch } from '../services/redux/hooks.ts';

import { registration } from '../services/api/AuthService.tsx';
import { setUserIdButUsingTheMostMasochisticWayPossible } from '../services/api/PostService.tsx';


const signUpSchema = z.object({
  username: z.string().min(2, "Имя не должно быть меньше 2 символов"),
  password: z.string().min(4, "Пароль не должен быть меньше 4 символов"),
  confirmPassword: z.string()
})
.refine(data => data.password === data.confirmPassword, {
  message: "Пароли должны совпадать",
  path: ["confirmPassword"]
});

type TSignUpSchema = z.infer<typeof signUpSchema>;

const SignUPpage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {register, handleSubmit, formState: {errors}, setError, getValues} = useForm<TSignUpSchema>({resolver: zodResolver(signUpSchema)});
  const loginMutation = useMutation({
    mutationFn: async ({username, password}: TSignUpSchema) => await registration(username, password),
    onSuccess: async () => {
      const user = await setUserIdButUsingTheMostMasochisticWayPossible();
      dispatch(setUser(user));
      navigate(`/user/${getValues().username}`);
    },
    onError: () => {
      setError("username", {
        type: "server",
        message: "пользователь с таким именем уже существует"
      });
    }
  });

  const onSubmitHandle = (data: TSignUpSchema) => {
    loginMutation.mutate(data);
    console.log(data);
  }
  
  return (
    <div className='signin'>
      <div className="signin__title">Регистрация</div>
      <form onSubmit={handleSubmit(onSubmitHandle)}>
        <input {...register("username")} className="signin__name form-input" type="text" placeholder='Имя...' autoComplete="new-password"/>
          {errors.username && <p className='error-form-message'>{`${errors.username.message}`}</p>}
        
        <input {...register("password")} className="signin__password form-input" type="password" placeholder='Пароль...' autoComplete="new-password"/>
          {errors.password && <p className='error-form-message'>{`${errors.password.message}`}</p>}
        <input {...register("confirmPassword")} className="signin__password-check form-input" type="password" placeholder='Повторите пароль...' autoComplete="new-password"/>
          {errors.confirmPassword && <p className='error-form-message'>{`${errors.confirmPassword.message}`}</p>}
        <button className="signin__button" onClick={() => {}} type='submit'>Зарегистрироваться</button>
      </form>
      <div className="signin__text">
        <p className='signin__text-ask'>Уже есть аккаунт?</p>
        <NavLink to={`/login`} className='signin__text-registration'>Войти</NavLink>
      </div>
    </div>
  );
};

export default SignUPpage;