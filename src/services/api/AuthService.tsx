import axios from "axios";
import { TUser } from "../types/types";
import { serverPath } from "./server-path";

export const login = async (username: string, password: string): Promise<TUser> => {
  const response =  await axios.post(`${serverPath}/api/login`, {
    "username": username,
    "password": password
  })
    .then((response) => {
      window.localStorage.setItem("token", response.data.token);
      window.localStorage.setItem("username", username);
      console.log(response);
      // console.log(response.data.token);
      return response.data.token;
    }).catch((error) => {
      console.log(error);
      throw new Error(error.response.data);
    }); 
    console.log(response);
  return response;
}

export const registration = async (username: string, password: string): Promise<TUser> => {
  const response =  await axios.post(`${serverPath}/api/register`, {
    "username": username,
    "password": password
  })
    .then((response) => {
      window.localStorage.setItem("token", response.data.token);
      console.log(response.data.token);
      return response.data.token;
    }).catch((error) => {
      console.log(error);
      throw new Error(error.response.data);
    }); 
  return response;
}


