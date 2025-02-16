import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './stylesheets/style.scss';
import UserContext from './context/UserContext';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';
import { notesURL } from './constants/urls';

const Main = React.lazy(() => import('./components/Main'));
const SignUp = React.lazy(() => import('./components/SignUp'));
const Login = React.lazy(() => import('./components/Login'));
const SideBar = React.lazy(() => import('./components/SideBar'));

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('');

  function logUser(user) {
    setUser(user);
  }
  useEffect(() => {
    let rawData = localStorage.getItem('note');
    let rawTheme = localStorage.getItem('theme');
    if (rawData) {
      setUser(JSON.parse(rawData));
    }
    if (theme) {
      setTheme(JSON.parse(rawTheme));
    } else {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('note', JSON.stringify(user));
    }
    localStorage.setItem('theme', JSON.stringify(theme));
    appTheme();
  }, [user, theme]);

  function handleTheme() {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }

  function appTheme() {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <UserContext.Provider value={{ user, logUser }}>
          <Suspense fallback={<Loader />}>
            <div className="grid">
              <SideBar handleTheme={handleTheme} theme={theme} />

              <>
                <Routes>
                  <Route path="/" element={<Main url={notesURL} />} />
                  <Route
                    path="/favorites"
                    element={<Main url={notesURL + '/favorites'} />}
                  />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </>
            </div>
          </Suspense>
        </UserContext.Provider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
