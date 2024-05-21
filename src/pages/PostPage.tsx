import { useEffect, useState } from 'react';
import arrowUp from "../assets/icons/Keyboard arrow up.svg"
import arrowDown from "../assets/icons/Keyboard arrow down.svg"
import comment from "../assets/icons/Mode comment.svg"
import share from "../assets/icons/Ios share.svg"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from 'react-hook-form';
import { createComment } from '../services/api/CommentService';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { getPost, updateVotes } from '../services/api/PostService';
import Comment from '../components/Comment';
import { transformDate, translateCategory } from '../services/utils/utils';
import { TComment, TVote } from '../services/types/types';
import { useAppSelector } from '../services/redux/hooks';
import { selectUser } from '../services/redux/fiatures/userSlice';
import { deletePost } from '../services/api/PostService';
import { frontendPath } from '../services/api/server-path';


const commentSchema = z.object({
  body: z.string().min(1, "Комментарий не должен быть пустым")
});

type TCommentSchema = z.infer<typeof commentSchema>;


const PostPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [vote, setVote] = useState<TVote>();
  const queryClient = useQueryClient();
  const { data: post, isLoading, error, status } = useQuery({
    queryFn: async () => await getPost(id!),
    queryKey: ["post", id],
    // staleTime: Infinity,
  });

  useEffect(() => {
    setVote(post?.votes.find(x => x.user == user.id))
  }, [post, status, user.id]);

  const mutationDeletePost = useMutation({
    mutationFn: async () => await deletePost(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['profile-posts', user.username], 
        exact: true,
        type: 'active', 
      });
      navigate(`/user/${user.username}`);
    }
  });

  const {register, handleSubmit, formState: {errors}, resetField} = useForm<TCommentSchema>({resolver: zodResolver(commentSchema)});
  const mutationComment = useMutation({
    mutationFn: async (body: string) => await createComment(id!, body),
    onSuccess: () => queryClient.invalidateQueries({ 
      queryKey: ['post', id], 
      exact: true,
      type: 'active', 
    })
  });

  const onSubmitHandle = (data: TCommentSchema) => {
    mutationComment.mutate(data.body);
    resetField("body");
    console.log(data);
  }

  const mutation = useMutation({
    mutationFn: async (action: string) => await updateVotes(post!.id, action),
    onSuccess: (data) => post!.score = data.score
  });

  const onVoteUpHandler = () => {
    if (vote?.vote == 1) {
      setVote({...vote, vote: 0});
      mutation.mutate("unvote")
    } else {
      mutation.mutate("upvote")
      setVote({...vote!, vote: 1});
    }
  }

  const onVoteDownHandler = () => {
    if (vote?.vote == -1) {
      setVote({...vote, vote: 0});
      mutation.mutate("unvote")
    } else {
      mutation.mutate("downvote")
      setVote({...vote!, vote: -1});
    }
  }


  if (error) {
    return <>произошла ошибка</>
  }
  if (isLoading) {
    return <>загрузка</>
  }

  return (
    <div className='post post-page'>
      <div className="post__first-line">
        <NavLink className='post__author' to={`/user/${post?.author.username}`}>{post?.author.username}</NavLink>
        <p className="post__category">{translateCategory(post!.category)}</p>
        <p className='post__date'>{transformDate(post!.created)}</p>
      </div>
      <h2 className='post__title'>{post?.title}</h2>
      <p className='post__text'>{post?.text}</p>
      <div className="post__buttons post-page__buttons">
        <div className="post__votes-buttons">
          <img className={`post__votes-buttons-img ${vote?.vote == 1 ? "post__votes-buttons-active" : ""}`} onClick={onVoteUpHandler} src={arrowUp} alt="" />
          <span className="post__votes-amount">{post?.score}</span>
          <img className={`post__votes-buttons-img ${vote?.vote == -1 ? "post__votes-buttons-active" : ""}`} onClick={onVoteDownHandler} src={arrowDown} alt="" />
        </div>
        <div className="post__comments">
          <img src={comment} alt="" />
          <span className="post__comments-amount">{post?.comments.length}</span>
        </div>
        
        <div className="post__share">
          <img src={share} alt="" />
          <span className="post__share-text" onClick={() => navigator.clipboard.writeText(`${frontendPath}/post/${post!.id}`).then(() => alert("Ссылка скопирована в буффер обмена"))}>поделиться</span>
        </div>
      </div>
      <div className="comments">
        {post?.comments.map((x: TComment) => <Comment key={x.id} comment={x} postId={id}/>)}
      </div>

      <div className="post__add-comment">
        <div className="post__add-comment-title">Добавить комментарий</div>
        <form action="" onSubmit={handleSubmit(onSubmitHandle)}>
          <input {...register("body")} className="post__add-comment-input" type="text" placeholder='Введите комментарий...'/>
          {errors.body && <p className='error-form-message'>{`${errors.body.message}`}</p>}
          <div className="post__add-comment-buttons">
            <button className='post__add-comment-button' type='submit' >Добавить</button>
            {user.username == post?.author.username && <button className='comment__delete-button' onClick={() => mutationDeletePost.mutate()} type='button'>удалить</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostPage;