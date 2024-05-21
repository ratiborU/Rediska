import { NavLink, Outlet } from 'react-router-dom';
import redis from "../assets/icons/Radish.svg";
import { useAppSelector } from '../services/redux/hooks';
import { selectUser } from '../services/redux/fiatures/userSlice';


const Layout = () => {
  const user = useAppSelector(selectUser);
  return (
    <div className='wrapper'>
      <header className='header'>
        <nav className='header__nav nav'>
          <NavLink className="header__navlink header__navlink_image" to={`/`}>
              <img src={redis} alt="" />
          </NavLink>
          <NavLink className="header__navlink header__navlink_text" to={`/`}>
            <h1>Редис</h1>
          </NavLink>
          {
            user.username 
              ? <NavLink className="header__navlink header__navlink_username" to={`/user/${user.username}`}>
                  {user.username}
                </NavLink>
              : <NavLink className="header__navlink header__navlink_button" to={`/login`}>
                  Войти
                </NavLink>
          }
        </nav>
      </header>

      <main className='main'>
        <Outlet/>
      </main>
    </div>
  );
};

export default Layout;