import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const TopMenu = ({ userType, loginUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    navigate('/');
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      navigate('/');
    }
  };

  return (
    <MenuWrapper>
      {userType !== 'guest' ? (
        <>
          <MenuButton
            $isActive={location.pathname === '/notifications'}
            onClick={() => navigate('/notifications')}
          >
            Ding!
          </MenuButton>
          {userType !== 'guest' && userType !== 'owner' ? (
            <MenuButton
              $isActive={location.pathname === '/mywish'}
              onClick={() => navigate(`/home/${loginUser}`)}
            >
              My Wish
            </MenuButton>
          ) : (
            <MenuButton
              $isActive={location.pathname === '/mypage'}
              onClick={() => navigate('/mypage')}
            >
              Setting
            </MenuButton>
          )}
          <MenuButton onClick={handleAuthClick}>
            {isAuthenticated ? 'Log out' : 'Log in'}
          </MenuButton>
        </>
      ) : (
        <MenuButton onClick={handleAuthClick}>Log in</MenuButton>
      )}
    </MenuWrapper>
  );
};

export default TopMenu;

const MenuWrapper = styled.div`
  display: flex;
  gap: 1.25rem;
  position: absolute;
  top: 2.34rem;
  right: 3.75rem;

  ${({ theme }) => theme.mobile} {
    display: none;
  }
`;

const MenuButton = styled.button`
  all: unset;
  cursor: pointer;
  ${({ theme }) => theme.font.m_btn}
  padding: 0.25rem 1.125rem;
  background-color: ${(props) => (props.$isActive ? 'black' : 'white')};
  color: ${(props) => (props.$isActive ? 'white' : 'black')};

  &:hover {
    background-color: black;
    color: white;
  }
`;
