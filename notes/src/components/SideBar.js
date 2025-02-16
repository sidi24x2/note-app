import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';

function Header(props) {
  let userDetails = useContext(UserContext);
  // console.log(props);
  let { user, logUser } = userDetails;

  function LoggedInUser() {
    return (
      <>
        <div className="userLog flex center">
          <span className="userImage flex center">
            {user.email.split('')[0]}
          </span>
          <span>{user.username}</span>
          <button
            onClick={() => {
              logUser(null);
              localStorage.clear('note');
            }}
          >
            LogOut
          </button>
        </div>
      </>
    );
  }

  function NonLoggedUser() {
    return (
      <>
        <NavLink
          to="signup"
          className={({ isActive }) => (isActive ? 'active-nav' : '')}
        >
          Sign Up
        </NavLink>
        <NavLink
          to="login"
          className={({ isActive }) => (isActive ? 'active-nav' : '')}
        >
          Login
        </NavLink>
      </>
    );
  }
  return (
    <aside className="sidebar container flex col">
      <div className="flex col start">
        <div className="flex start">
          <span>Logo</span>
          <span>All Notes</span>
        </div>
        <div className="flex col">
          <nav className="flex col">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active-nav' : '')}
            >
              <i className="fa-solid fa-house"></i> Home
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => (isActive ? 'active-nav' : '')}
            >
              <i className="fa-solid fa-star"></i>
              Favorites
            </NavLink>
          </nav>
        </div>
      </div>
      <div className="user width-100">
        {user ? <LoggedInUser /> : <NonLoggedUser />}
        <span onClick={props.handleTheme}>
          {props.theme === 'light' ? (
            <i class="fa-regular fa-moon"></i>
          ) : (
            <i class="fa-solid fa-sun"></i>
          )}
        </span>
      </div>
    </aside>
  );
}
export default Header;
