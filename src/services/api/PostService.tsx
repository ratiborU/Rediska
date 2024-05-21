import axios from "axios";
import { TAuthor, TPost, TPostInput } from "../types/types";
import { serverPath } from "./server-path";


export const getPosts = async (): Promise<TPost[]> => {
  const response = await axios.get(`${serverPath}/api/posts/`)
    .then((response) => {
      return response["data"];
    }).catch((error: Error) => {
      console.log(error.message);
      throw new Error(error.message);
    }); 
  return response;
}

export const getPostsByCategory = async (category: string): Promise<TPost[]> => {
  const response = await axios.get(`${serverPath}/api/posts/${category}`)
    .then((response) => {
      return response["data"];
    }).catch((error: Error) => {
      console.log(error.message);
      throw new Error(error.message);
    }); 
  return response;
}

export const getPostsByCategoryOrNot = async (filter: string, category: string): Promise<TPost[]> => {
  let response;
  if (category == 'all') {
    response = await getPosts();
  } else {
    response = await getPostsByCategory(category);
  }

  if (filter == 'popular') {
    return response.sort((a, b) => b.score - a.score)
  }
  return response.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
}

export const getPostsByUserCategoryOrNot = async (filter: string, category: string, username: string): Promise<TPost[]> => {
  let response;
  if (category == 'all') {
    response = await getPostsByUser(username);
  } else {
    response = await getPostsByUser(username);
    response = response.filter(x => x.category == category)
  }
  console.log(response);
  if (filter == 'popular') {
    return response.sort((a, b) => b.score - a.score)
  }
  return response.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
}


export const getPostsByUser = async (username: string): Promise<TPost[]> => {
  const response = await axios.get(`${serverPath}/api/user/${username}`)
    .then((response) => {
      return response["data"];
    }).catch((error: Error) => {
      console.log(error.message);
      throw new Error(error.message);
    }); 
  return response;
}


export const getPost = async (id: string): Promise<TPost> => {
  const response = await axios.get(`${serverPath}/api/post/${id}`)
    .then((response) => {
      return response["data"];
    }).catch((error: Error) => {
      console.log(error.message);
      throw new Error(error.message);
    }); 
  return response;
}


export const createPost = async (postInput: TPostInput): Promise<TPost> => {
  const response = await axios.post(`${serverPath}/api/posts`, {
    "title": postInput.title,
    "text": postInput.text,
    "url": "http://localhost:5173",
    "type": "text",
    "category": postInput.category,
  }, {
    headers: {
      "Authorization": `Bearer ${window.localStorage.getItem("token")}`
    }
  }).then((response) => {
      return response["data"];
    }).catch((error) => {
      console.log(error);
      return null;
    }); 
  return response;
}

export const deletePost = async (id: string): Promise<TPost> => {
  const response = await axios.delete(`${serverPath}/api/post/${id}`, {
    headers: {
      "Authorization": `Bearer ${window.localStorage.getItem("token")}`
    }
  }).then((response) => {
      return response["data"];
    }).catch((error: Error) => {
      console.log(error.message);
      throw new Error(error.message);
    }); 
  return response;
}

export const updateVotes = async (id: string, action: string): Promise<TPost> => {
  const response = await axios.get(`${serverPath}/api/post/${id}/${action}`, {
    headers: {
      "Authorization": `Bearer ${window.localStorage.getItem("token")}`
    }
  }).then((response) => {
      return response["data"];
    }).catch((error: Error) => {
      console.log(error.message);
      throw new Error(error.message);
    }); 
  return response;
}

export const setUserIdButUsingTheMostMasochisticWayPossible = async (): Promise<TAuthor> => {
  const post = await createPost({"title": "2", "text": "", "url": "", "type": "text", "category": "music"});
  await deletePost(post.id);
  return post.author;
}

