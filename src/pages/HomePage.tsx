import { useState } from 'react';
import Post from "../components/Post";
import Filters from "../components/Filters";
import { getPostsByCategoryOrNot } from "../services/api/PostService";
import { useQuery } from "@tanstack/react-query";
import { TCategory } from '../services/types/types';

const HomePage = () => {
  const [filter, setFilter] = useState('popular');
  const [category, setCategory] = useState<TCategory>('all');
  const { data: posts, isLoading, error } = useQuery({
    queryFn: async () => await getPostsByCategoryOrNot(filter, category),
    queryKey: ["posts", filter, category],
    // staleTime: Infinity,
  });

  
  if (error) {
    return <>произошла ошибка</>
  }
  if (isLoading) {
    return <>загрузка</>
  }

  return (
    <div className="homepage">
      <Filters 
        filterCallback={(filterType: string) => setFilter(filterType)} 
        categoryCallback={(categoryType: TCategory) => setCategory(categoryType)}
        filter={filter}
        category={category}
      />
      <div className="posts-container">
        {posts!.map(post => <Post key={post.id} post={post}/>)}
      </div>
      <div className="homepage__blank"></div>
    </div>
  );
};

export default HomePage;