import { useState } from 'react';
import Post from "../components/Post";
import Filters from "../components/Filters";
import { getPostsByUserCategoryOrNot } from "../services/api/PostService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { createPost } from '../services/api/PostService';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../services/redux/hooks';
import { setUser, selectUser } from "../services/redux/fiatures/userSlice.ts";
import { TCategory, TCategoryObject } from '../services/types/types.tsx';

const postSchema = z.object({
  title: z.string(),
  text: z.string(),
  url: z.string(),
  type: z.string(),
  category: z.string(),
});

type TPostSchema = {
  title: string,
  text: string,
  url: string,
  type: string,
  category: TCategory,
};


const ProfilePage = () => {
  const {username} = useParams();
  const [isCreating, setIsCreating] = useState(false);
  
  const [text, setText] = useState('');
  const [categoryInput, setCategoryInput] = useState<TCategory>('music');
  const queryClient = useQueryClient();

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const [filter, setFilter] = useState('popular');
  const [category, setCategory] = useState<TCategory>('all');

  const { data: posts, isLoading, error } = useQuery({
    queryFn: async () => await getPostsByUserCategoryOrNot(filter, category, username!),
    queryKey: ["profile-posts", username, filter, category],
    // staleTime: Infinity,
  });


  const {register, handleSubmit, formState: {errors}} = useForm<TPostSchema>({resolver: zodResolver(postSchema)});
  const mutation = useMutation({
    mutationFn: async (postInput: TPostSchema) => await createPost(postInput),
    onSuccess: () => queryClient.invalidateQueries({ 
      queryKey: ['profile-posts', username, filter, category], 
      exact: true,
      type: 'active', 
    })
  });

  const onSubmitHandle = (data: TPostSchema) => {
    setIsCreating(false);
    data.category = categoryInput
    data.text = text;
    mutation.mutate(data);
  }

  const onExitButton = () => {
    dispatch(setUser({username: "", id: ""}));
  }

  if (error) {
    return <>произошла ошибка</>
  }
  if (isLoading) {
    return <>загрузка</>
  }

  return (
    <div className="homepage">
      <div className="filter-cotainer">
      <Filters 
        filterCallback={(filterType: string) => setFilter(filterType)} 
        categoryCallback={(categoryType: TCategory) => setCategory(categoryType)}
        filter={filter}
        category={category}
      />
        {
          username == user.username && 
          <NavLink className='filter-container__exit-button' to={`/login`} onClick={onExitButton}>выйти из аккаунта</NavLink>
        }
        
      </div>

      <div className="posts-container">
        {user.username == username && 
          <div className="post-container__create create">
            {!isCreating && <button className='create__button' onClick={() => setIsCreating(true)}>Создать пост</button>}
            {isCreating && 
              <div className="create__form">
                <form action="" onSubmit={handleSubmit(onSubmitHandle)}>
                  <input {...register("title")} className='create__input-title' type="text" placeholder='Заголовок...'/>
                  {errors.title && <p className='error-form-message'>{`${errors.title.message}`}</p>}
                  <textarea {...register("text")} className='create__input-text' value={text} onChange={(e) => setText(e.target.value)} placeholder='Текст...'></textarea>
                  {errors.text && <p className='error-form-message'>{`${errors.text.message}`}</p>}
                  <input {...register("url")} className='create__input-url' type="text" placeholder='Ссылка...'/>
                  {errors.url && <p className='error-form-message'>{`${errors.url.message}`}</p>}
                  <select className='create__select' {...register("category")} onChange={(e) => setCategoryInput(e.target.value as keyof TCategoryObject)} name="city">
                    <option value="music" >Музыка</option>
                    <option value="funny">Мемы</option>
                    <option value="videos">Видео</option>
                    <option value="programming">Программирование</option>
                    <option value="news">Новости</option>
                    <option value="fashion">Мода</option>
                  </select>
                  <select className='create__select create__select_type' {...register("type")} name="city">
                    <option value="text">Текст</option>
                    <option value="link">Ссылка</option>
                  </select>
                  <div className="create__buttons">
                    <button className='create__create-button' type='submit'>Опубликовать</button>
                    <button className='create__cancel-button' onClick={() => setIsCreating(false)}>Отменить</button>
                  </div>
                </form>
              </div>
            }
          </div>
        }
        
        {posts!.sort((a, b) => b.score - a.score).map(post => <Post key={post.id} post={post}/>)}
        {/* {filter == "popular" && posts!.sort((a, b) => b.score - a.score).map(post => <Post key={post.id} post={post}/>)} */}
        {/* {filter == "date" && posts!.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()).map(post => <Post key={post.id} post={post}/>)} */}
      </div>
      <div className="homepage__blank"></div>
    </div>
  );
};

export default ProfilePage;