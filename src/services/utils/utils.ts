import { TCategory } from "../types/types";

export const transformDate = (stringDate: string) => {
  const date = new Date(stringDate);
  const day = `${date.getDate() < 10 ? '0': ''}${date.getDate()}`
  const months = `${date.getMonth() < 10 ? '0': ''}${date.getMonth()}`
  const year = `${date.getFullYear()}`
  return `${day}.${months}.${year}`;
}

export const translateCategory = (category: TCategory) => {
  const categories = {
    all: "все",
    music: "музыка",
    funny: "мемы",
    videos: "видео",
    programming: "программирование",
    news: "новости",
    fashion: "мода"
  }

  return categories[category];
}