import { TComment } from '../services/types/types';
import { transformDate } from '../services/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../services/api/CommentService';
import { useAppSelector } from '../services/redux/hooks';
import { selectUser } from '../services/redux/fiatures/userSlice';
import { NavLink } from 'react-router-dom';

const Comment = ({comment, postId}: {comment: TComment, postId: string | undefined}) => {
  const user = useAppSelector(selectUser);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => await deleteComment(postId!, comment.id),
    onSuccess: () => queryClient.invalidateQueries({ 
      queryKey: ['post', postId], 
      exact: true,
      type: 'active', 
    })
  });

  return (
    <div className='comment'>
      <div className="comment__author-date">
        <NavLink className='comment__author' to={`/user/${comment.author.username}`}>{comment.author.username}</NavLink>
        <p className='comment__date'>{transformDate(comment.created)}</p>
      </div>
      <div className="comment__author-body">
        <p className='comment__text'>{comment.body}</p>
        {user.username == comment.author.username && <button className='comment__delete-button' onClick={() => mutation.mutate()}>удалить</button>}
        
      </div>
      
    </div>
  );
};

export default Comment;