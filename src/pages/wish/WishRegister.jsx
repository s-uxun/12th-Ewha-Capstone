import styled from 'styled-components';
import { HeartLine, HeartFull } from '@/assets/icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import SideBar from '@/common/SideBar';
import Loader from './components/Loader';

const WishRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { itemToEdit } = location.state || {};
  const [heartCount, setHeartCount] = useState(0);
  const [formData, setFormData] = useState({
    item_name: '',
    wish_link: '',
    item_image: '',
    price: '',
    size: '',
    color: '',
    other_option: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userType, setUserType] = useState('');
  const user_id = localStorage.getItem('id');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1230);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        item_name: itemToEdit.item.item_name || '',
        wish_link: itemToEdit.item.wish_link || '',
        item_image: itemToEdit.item.item_image || '',
        price: itemToEdit.item.price || '',
        size: itemToEdit.item.size || '',
        color: itemToEdit.item.color || '',
        other_option: itemToEdit.item.other_option || '',
        category: itemToEdit.item.category || '',
      });
      setHeartCount(itemToEdit.item.heart || 0);
    }
  }, [itemToEdit]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (itemToEdit) {
      setFormData((prev) => ({
        ...prev,
        category: itemToEdit.item.category,
      }));
    }
  }, [itemToEdit]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUserType('guest');
      } else {
        setUserType('authenticated');
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/mypages/category/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleHeartClick = (index) => {
    setHeartCount(index + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWishLinkBlur = async () => {
    if (!formData.wish_link) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No access token found');
      }

      const baseUrl = process.env.REACT_APP_BASE_URL;
      if (!baseUrl) {
        throw new Error(
          'Base URL is undefined. Check your .env configuration.',
        );
      }

      const response = await axios.post(
        `${baseUrl}/crawler/crawl/`,
        { url: formData.wish_link },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { product_name, product_price, product_image } = response.data;
      setFormData((prev) => ({
        ...prev,
        item_name: product_name || prev.item_name,
        price: product_price || prev.price,
        item_image:
          product_image ||
          'https://minsihihi-wish-bucket.s3.ap-northeast-2.amazonaws.com/items/Frame_318.png',
      }));
    } catch (err) {
      console.error('Error fetching product details:', err.message);
      setError('Fetching product details failed');
      setFormData((prev) => ({
        ...prev,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const dataToSend = {
      item_name: formData.item_name,
      wish_link: formData.wish_link,
      item_image: formData.item_image,
      price: Number(formData.price),
      size: formData.size,
      color: formData.color,
      other_option: formData.other_option,
      heart: heartCount,
      category: Number(formData.category),
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No access token found');

      let response;

      if (itemToEdit) {
        // 수정 모드: PATCH 요청
        response = await axios.patch(
          `${process.env.REACT_APP_BASE_URL}/wish/items/${itemToEdit.item.id}/`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        alert('Wish update succeeded!');
        navigate('/wishDetail', {
          state: { itemId: itemToEdit.item.id },
        });
      } else {
        // 등록 모드: POST 요청
        const user_id = localStorage.getItem('id');
        const token = localStorage.getItem('token');
        if (!user_id) throw new Error('User ID not found');

        response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/wish/${user_id}/`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        alert('Wish registration succeeded!');
        navigate(`/home/${user_id}`);
      }

      console.log(response.data);
    } catch (err) {
      console.error('Error submitting wish:', err.message);
      alert('Wish registration failed');
    }
  };

  const handleCategoryClick = (selectedCategory) => {
    setFormData((prev) => ({
      ...prev,
      category: String(selectedCategory.id),
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    navigate('/');
    alert('Complete Logout.');
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const navigateToCategory = () => {
    navigate('/mypage', { state: { activeTitle: 'Category' } });
  };

  return (
    <Wrapper>
      <Container>
        <Block />
        <SideBar
          handleLogout={handleLogout}
          userType={userType}
          loginUser={user_id}
        />

        <Line position="top" />
        <Line position="bottom" />
        <Line position="left" />
        <Line position="right" />

        <TitleContainer>
          {isSmallScreen ? (
            <>
              <Title>WHAT DO</Title>
              <Title style={{ marginTop: '1rem' }}>YOU WANT ?</Title>
            </>
          ) : (
            <Title>WHAT DO YOU WANT ?</Title>
          )}
        </TitleContainer>

        <Content>
          <ImgInput>
            {formData.item_image ? (
              <img
                src={formData.item_image}
                alt="상품 이미지"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <>
                <label className="input-file-button" htmlFor="input-file">
                  Add your
                </label>
                <label className="input-file-button" htmlFor="input-file">
                  wish link!
                </label>
              </>
            )}
          </ImgInput>
          <OtherInput>
            <p>Wish Link.*</p>
            <input
              name="wish_link"
              value={formData.wish_link}
              onBlur={handleWishLinkBlur}
              onChange={handleInputChange}
            />
            {loading && <Loader />}
            {error && (
              <p style={{ color: 'red', marginBottom: '3rem' }}>{error}</p>
            )}
            <p>Wish Name.*</p>
            <input
              name="item_name"
              value={formData.item_name}
              onChange={handleInputChange}
            />
            <p>Wish Price.*</p>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
            />
            <p>Wish Option.</p>
            <OptionInput>
              <div>ⓢ</div>
              <input
                name="size"
                placeholder="size"
                style={{ width: '24%', margin: '0 1rem 0 0.563rem' }}
                onChange={handleInputChange}
                value={formData.size}
              />
              <div>ⓒ</div>
              <input
                name="color"
                placeholder="color"
                style={{ width: '24%', margin: '0 1rem 0 0.563rem' }}
                onChange={handleInputChange}
                value={formData.color}
              />
              <div>ⓞ</div>
              <input
                name="other_option"
                placeholder="other option"
                style={{ width: '24%', margin: '0 0 0 0.563rem' }}
                onChange={handleInputChange}
                value={formData.other_option}
              />
            </OptionInput>

            <p>Wish Category.*</p>
            <CategoryInput>
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={
                    formData.category === String(category.id) ? 'active' : ''
                  }
                >
                  {category.category}
                </div>
              ))}
              <Plus onClick={navigateToCategory}>+</Plus>
            </CategoryInput>

            <p>Heart Your Wish.*</p>
            <HeartInput>
              {[...Array(5)].map((_, index) => (
                <div key={index} onClick={() => handleHeartClick(index)}>
                  {index < heartCount ? <HeartFull /> : <HeartLine />}
                </div>
              ))}
            </HeartInput>
          </OtherInput>
        </Content>
        <DoneBtn onClick={handleSubmit}>Done</DoneBtn>
      </Container>
    </Wrapper>
  );
};

export default WishRegister;

const Block = styled.div`
  height: 5.5rem;
  ${({ theme }) => theme.mobile} {
    height: 4.1rem;
  }
`;

const DoneBtn = styled.button`
  position: relative;
  left: 54.1rem;
  bottom: 3.2rem;
  border: 0;
  background-color: #bebebe;
  color: #fff;
  ${({ theme }) => theme.font.m_btn}
  width: 5rem;
  height: 1.813rem;
  padding: 0.25rem 1.125rem;
  cursor: pointer;
  &:hover,
  &:active {
    background-color: #000;
  }

  @media (max-width: 768px) {
    position: relative;
    left: 70%;
    bottom: 0rem;
  }
`;

const HeartInput = styled.div`
  display: flex;
  gap: 0.4375rem;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const CategoryInput = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  div {
    cursor: pointer;
    width: max-content;
    height: 2rem;
    border-radius: 1.25rem;
    border: 1px solid #fff;
    ${({ theme }) => theme.font.common_detail}
    padding: 0 2.688rem;
    display: flex;
    justify-content: center;
    align-items: center;
    &.active,
    &:hover {
      background-color: ${({ theme }) => theme.color.orange};
      border: 1px solid ${({ theme }) => theme.color.orange};
    }
  }
`;

const Plus = styled.h1`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 0.0625rem solid white;
  border-radius: 50%;
  ${({ theme }) => theme.font.common_detail}
  margin-bottom: 0;
  font-size: 1.5rem;
  font-weight: 300;
`;

const OptionInput = styled.div`
  display: flex;
  align-items: center;
  height: 2.625rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    width: 100%;
  }
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.5rem;
    height: 1.5rem;
    font-family: Pridi;
    font-size: 1.7rem;
    font-style: normal;
    font-weight: 100;
    line-height: normal;
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
`;

const OtherInput = styled.div`
  width: 31.25rem;
  @media (max-width: 768px) {
    width: 100%;
  }
  p {
    ${({ theme }) => theme.font.common_detail}
    margin-bottom: 0.25rem;
    @media (max-width: 768px) {
      ${({ theme }) => theme.font.common_detail}
    }
  }
  input {
    margin-bottom: 1.6rem;
    background-color: transparent;
    border: 1px solid #fff;
    width: 23.375rem;
    height: 2.25rem;
    padding: 0.438em 1.063rem;
    ${({ theme }) => theme.font.common_input}
    color: white;
    @media (max-width: 768px) {
      position: relative;
      width: 100%;
      padding: 0.438rem 0.5rem;
    }
  }
  input::placeholder {
    ${({ theme }) => theme.font.common_input}
    color: #BEBEBE;
    @media (max-width: 768px) {
    }
  }
`;

const ImgInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 20rem;
  height: 25rem;
  border: 1px solid #fff;
  margin-right: 4rem;
  background-color: ${({ theme }) => theme.color.mint};
  background-image: linear-gradient(
      45deg,
      ${({ theme }) => theme.color.orange} 25%,
      transparent 25%,
      transparent 75%,
      ${({ theme }) => theme.color.orange} 75%
    ),
    linear-gradient(
      45deg,
      ${({ theme }) => theme.color.orange} 25%,
      transparent 25%,
      transparent 75%,
      ${({ theme }) => theme.color.orange} 75%
    );
  background-size: 7.68rem 7.68rem;
  background-position:
    0 0,
    3.84rem 3.84rem;
  @media (max-width: 768px) {
    width: 100%;
    height: 19.3rem;
    margin-right: 0rem;
  }

  label {
    text-align: center;
    font-family: Pridi;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    color: ${({ theme }) => theme.color.white};
  }
`;

const Content = styled.div`
  display: flex;
  margin: 1.875rem 3.25rem 1.25rem 4.1875rem;
  position: relative;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    margin: 5rem 2.25rem 7.188rem 2.25rem;
    gap: 5rem;
  }
`;

const Title = styled.p`
  ${({ theme }) => theme.font.p_homeTitle_eng}
  background-color:  ${({ theme }) => theme.color.yellow};
  color: black;
  padding: 0 0.521rem;
  margin: 0;
  width: fit-content;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    ${({ theme }) => theme.font.m_homeTitle_eng}
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.625rem 0.521rem;
  width: fit-content;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    font-family: Pretendard;
    font-size: 2rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin: 3rem 0.5rem 0.5rem 0.5rem;
  }
`;

const Line = styled.div`
  position: absolute;
  background-color: #fff;
  z-index: 100;

  ${({ position }) =>
    position === 'top' &&
    `
    top: 6.25rem; 
    left: 0rem; 
    right: 0rem; 
    height: 1px;
  `}

  ${({ position }) =>
    position === 'bottom' &&
    `
    top: 11.063rem; 
    left: 0rem; 
    right: 0rem; 
    height: 1px;
  `}

  ${({ position }) =>
    position === 'left' &&
    `
    top: 0rem; 
    bottom: 0rem; 
    left: 8.75rem; 
    width: 1px;
    height: 200vh;
  `}

  ${({ position }) =>
    position === 'right' &&
    `
    top: 0rem; 
    bottom: 0rem; 
    right: 8.75rem; 
    width: 1px;
    height: 200vh;
  `}


    @media (max-width: 768px) {
    ${({ position }) =>
      position === 'top' &&
      `
    top: 6.25rem; 
    left: 0rem; 
    right: 0rem; 
    height: 1px;
  `}

    ${({ position }) =>
      position === 'bottom' &&
      `
    top: 15.25rem; 
    left: 0rem; 
    right: 0rem; 
    height: 1px;
  `}

  ${({ position }) =>
      position === 'left' &&
      `
    top: 0rem; 
    bottom: 0rem; 
    left: 3.14%; 
    width: 1px;
    height: 250vh;
  `}

  ${({ position }) =>
      position === 'right' &&
      `
    top: 0rem; 
    bottom: 0rem; 
    right: 3.14%; 
    width: 1px;
    height: 250vh;
  `}
  }
`;

const Container = styled.div`
  margin: 0.8rem 8.75rem 6.25rem 8.75rem;
  width: 62.5rem;
  @media (max-width: 768px) {
    margin: 6.25rem 8.75rem;

    display: flex;
    flex-direction: column;
    margin: 0 3.14%;
    width: 94.24%;
  }
`;

const Wrapper = styled.div`
  display: flex;
  height: 200vh;
  background-color: ${({ theme }) => theme.color.mint};

  @media (max-width: 768px) {
    height: 250vh;
  }
`;
