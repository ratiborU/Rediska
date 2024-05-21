import { useEffect, useState } from 'react';
import SidebarButton from './SidebarButton';
import { TCategory } from '../services/types/types';

type FiltersProps = {
  filterCallback: (filter: string) => void, 
  categoryCallback: (category: TCategory) => void, 
  filter: string, 
  category: TCategory
}

const filterNumbers = {
  popular: 0,
  date: 1
}

const categoriesNumbers = {
  all: 0,
  news: 1,
  fashion: 2,
  funny: 3,
  videos: 4,
  music: 5,
  programming: 6,
}



const Filters = ({filterCallback, categoryCallback, filter, category}: FiltersProps) => {
  const [filters, setFilters] = useState([true, false])
  const [categories, setCategories] = useState([true, false, false, false, false, false, false])

  useEffect(() => {
    setFilters(new Array(2).fill(false).map((_x, i) => Object.keys(filterNumbers)[i] == filter));
    setCategories(new Array(7).fill(false).map((_x, i) => Object.keys(categoriesNumbers)[i] == category));
  }, [filter, category])

  return (
    <div className='sidebar'>
      <div className="sidebar__filters">
        <p className='sidebar__title'>Фильтры</p>
        <SidebarButton 
          text="По популярности" 
          callback={() => filterCallback("popular")}
          active={filters[0]}
        />
        <SidebarButton 
          text="По дате" 
          callback={() => filterCallback("date")}
          active={filters[1]}
          // setActive={setActiveFilter}
        />
      </div>
      <div className="sidebar__categories">
        <p className='sidebar__title'>Категории</p>
        <SidebarButton 
          text="Все" 
          callback={() => categoryCallback("all")}
          active={categories[0]}
          // setActive={setActiveCategory}
        />
        <SidebarButton 
          text="Новости" 
          callback={() => categoryCallback("news")}
          active={categories[1]}
          // setActive={setActiveCategory}
        />
        <SidebarButton 
          text="Мода" 
          callback={() => categoryCallback("fashion")}
          active={categories[2]}
          // setActive={setActiveCategory}
        />
        <SidebarButton 
          text="Мемы" 
          callback={() => categoryCallback("funny")}
          active={categories[3]}
          // setActive={setActiveCategory}
        />
        <SidebarButton 
          text="Видео" 
          callback={() => categoryCallback("videos")}
          active={categories[4]}
          // setActive={setActiveCategory}
        />
        <SidebarButton 
          text="Музыка" 
          callback={() => categoryCallback("music")}
          active={categories[5]}
          // setActive={setActiveCategory}
        />
        <SidebarButton 
          text="Программирование" 
          callback={() => categoryCallback("programming")}
          active={categories[6]}
          // setActive={setActiveCategory}
        />
      </div>
    </div>
  );
};

export default Filters;