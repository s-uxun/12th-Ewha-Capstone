import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Hamburger, Delete } from '@/assets/icons';

const SideBar = ({ userType, loginUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    navigate('/');
    setIsOpen(false);
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      navigate('/');
      setIsOpen(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <HamburgerButton onClick={() => setIsOpen(true)}>
        <Hamburger />
      </HamburgerButton>

      <MenuOverlay $isOpen={isOpen} onClick={() => setIsOpen(false)} />

      <MenuWrapper $isOpen={isOpen}>
        <CloseButton onClick={() => setIsOpen(false)}>
          <Delete />
        </CloseButton>

        <MenuContent>
          {userType !== 'guest' ? (
            <>
              {location.pathname === '/mypage' ? (
                <>
                  <MenuItem onClick={() => handleNavigation('/notifications')}>
                    Ding!
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleNavigation(`/home/${loginUser}`)}
                  >
                    My Wish
                  </MenuItem>
                  <MenuItem onClick={handleAuthClick}>
                    {isAuthenticated ? 'Log out' : 'Log in'}
                  </MenuItem>
                </>
              ) : location.pathname === '/notifications' ? (
                <>
                  <MenuItem onClick={() => handleNavigation('/mypage')}>
                    Setting
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleNavigation(`/home/${loginUser}`)}
                  >
                    My Wish
                  </MenuItem>
                  <MenuItem onClick={handleAuthClick}>
                    {isAuthenticated ? 'Log out' : 'Log in'}
                  </MenuItem>
                </>
              ) : location.pathname === `/home/${loginUser}` ? (
                <>
                  <MenuItem onClick={() => handleNavigation('/notifications')}>
                    Ding!
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/mypage')}>
                    Setting
                  </MenuItem>
                  <MenuItem onClick={handleAuthClick}>
                    {isAuthenticated ? 'Log out' : 'Log in'}
                  </MenuItem>
                </>
              ) : location.pathname === '/home' ? (
                <>
                  <MenuItem
                    onClick={() => handleNavigation(`/home/${loginUser}`)}
                  >
                    My Wish
                  </MenuItem>
                  <MenuItem onClick={handleAuthClick}>
                    {isAuthenticated ? 'Log out' : 'Log in'}
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem
                    onClick={() => handleNavigation(`/home/${loginUser}`)}
                  >
                    My Wish
                  </MenuItem>
                  <MenuItem onClick={handleAuthClick}>
                    {isAuthenticated ? 'Log out' : 'Log in'}
                  </MenuItem>
                </>
              )}
            </>
          ) : (
            <MenuItem onClick={handleAuthClick}>Log in</MenuItem>
          )}
        </MenuContent>
      </MenuWrapper>
    </>
  );
};

export default SideBar;

const HamburgerButton = styled.button`
  display: none;
  position: absolute;
  top: 1.69rem;
  right: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  ${({ theme }) => theme.mobile} {
    display: block;
  }
`;

const MenuOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease;
  z-index: 998;

  ${({ theme }) => theme.mobile} {
    display: block;
  }
`;

const MenuWrapper = styled.div`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
  width: 70%;
  height: 100%;
  background-color: ${({ theme }) => theme.color.orange};
  transition: right 0.3s ease;
  z-index: 999;

  display: none;
  ${({ theme }) => theme.mobile} {
    display: block;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  margin: 6rem 2rem 0 0;
`;

const MenuItem = styled.button`
  all: unset;
  cursor: pointer;
  ${({ theme }) => theme.font.m_btn}
  text-align: center;
  padding: 0.25rem 1.125rem;
  background-color: white;
  color: black;
  width: fit-content;
`;
