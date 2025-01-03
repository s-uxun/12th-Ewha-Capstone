import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

// 디자인
import { Iwi } from '@/assets/icons';
import GlobalStyle from '@/styles/Globalstyle';
import { styled, ThemeProvider } from 'styled-components';
import Theme from '@/styles/Theme';

// auth
import LogIn from '@auth/LogIn';
import SignUp from '@auth/SignUp';
import KakaoRedirection from './pages/auth/components/Kakao';

// user
import Mypage from '@user/MyPage';
import Notifications from '@user/Notifications';

// home
import Home from '@/pages/home/Home';

// wish
import WishRegister from '@/pages/wish/WishRegister';
import WishDetail from '@/pages/wish/WishDetail';
import WishAddMine from './pages/wish/WishAddMine';

const Logo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const id = localStorage.getItem('id');
    if (id) {
      navigate(`/home/${id}`);
    }
  };

  return <StyledIwi onClick={handleLogoClick} />;
};

function App() {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={Theme}>
        <Router>
          <Logo />
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="home/:userId" element={<Home />} />
            <Route path="/wishRegister" element={<WishRegister />} />
            <Route path="/wishDetail" element={<WishDetail />} />
            <Route path="/wishAdd" element={<WishAddMine />} />
            <Route
              path="/oauth/callback/kakao"
              element={<KakaoRedirection />}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

const StyledIwi = styled(Iwi)`
  width: 3.875rem;
  position: absolute;
  top: 1.69rem;
  left: 9.75rem;

  cursor: pointer;

  div[class*='AuthLayout'] ~ & {
    left: 3.75rem;
  }

  ${({ theme }) => theme.mobile} {
    top: 2.3rem;
    left: 8.14%;
  }
`;

export default App;
