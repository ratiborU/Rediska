import arrowUp from "../assets/icons/Keyboard arrow up.svg"
import arrowDown from "../assets/icons/Keyboard arrow down.svg"
import comment from "../assets/icons/Mode comment.svg"
import share from "../assets/icons/Ios share.svg"

import { NavLink } from "react-router-dom"
import { TPost } from "../services/types/types"
import { updateVotes } from "../services/api/PostService"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useAppSelector } from "../services/redux/hooks"
import { selectUser } from "../services/redux/fiatures/userSlice"
import { transformDate, translateCategory } from "../services/utils/utils"
import { frontendPath } from "../services/api/server-path"


const Post = ({post}: {post: TPost}) => {
  const user = useAppSelector(selectUser);
  const [vote, setVote] = useState(post.votes.find(x => x.user == user.id));
  const mutation = useMutation({
    mutationFn: async (action: string) => await updateVotes(post.id, action),
    onSuccess: (data) => post.score = data.score
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

  return (
    <div className='post'>
      <div className="post__first-line">
        <NavLink className='post__author' to={`/user/${post.author.username}`}>{post.author.username}</NavLink>
        <p className="post__category">{translateCategory(post.category)}</p>
        <p className='post__date'>{transformDate(post.created)}</p>
      </div>
      <h2 className='post__title'>{post.title}</h2>
      <p className='post__text'>{post.text}</p>
      <div className="post__buttons">
        <div className="post__votes-buttons">
          <img className={`post__votes-buttons-img ${vote?.vote == 1 ? "post__votes-buttons-active" : ""}`} onClick={onVoteUpHandler} src={arrowUp} alt=""/>
          <span className="post__votes-amount">{post.score}</span>
          <img className={`post__votes-buttons-img ${vote?.vote == -1 ? "post__votes-buttons-active" : ""}`} onClick={onVoteDownHandler} src={arrowDown} alt=""/>
        </div>
        <NavLink to={`/post/${post.id}`}>
          <div className="post__comments">
            <img src={comment} alt="" />
            <span className="post__comments-amount">{post.comments.length}</span>
          </div>
        </NavLink>
        
        <div className="post__share">
          <img src={share} alt="" />
          <span className="post__share-text" onClick={() => navigator.clipboard.writeText(`${frontendPath}/post/${post.id}`).then(() => alert("Ссылка скопирована в буффер обмена"))}>поделиться</span>
        </div>
      </div>
    </div>
  );
};

export default Post;