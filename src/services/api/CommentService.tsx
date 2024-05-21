import axios from "axios";
import { TComment } from "../types/types";
import { serverPath } from "./server-path";

export const createComment = async (postId: string, body: string): Promise<TComment> => {
  const response = await axios.post(`${serverPath}/api/post/${postId}`, {
    "comment": body
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
    console.log(response);
  return response;
}

export const deleteComment = async (postId: string, commentId: string): Promise<TComment> => {
  const response = await axios.delete(`${serverPath}/api/post/${postId}/${commentId}`, {
    headers: {
      "Authorization": `Bearer ${window.localStorage.getItem("token")}`
    }
  }).then((response) => {
      return response["data"];
    }).catch((error) => {
      console.log(error);
      return null;
    }); 
    console.log(response);
  return response;
}