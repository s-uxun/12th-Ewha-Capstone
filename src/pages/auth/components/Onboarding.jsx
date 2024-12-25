import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import AuthInput from './AuthInput';
import { PlusSquare } from '@/assets/icons';

const Onboarding = () => {
  const nameRef = useRef(null);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [color, setColor] = useState('');
  const [typo, setTypo] = useState('');

  const colors = ['#FEF78C', '#FFA100', '#FF5356', '#0C4CFF', '#6D29FF'];
  const typos = ['Pridi', 'Pretendard', 'Gothic A1', 'Gowun Batang'];

  const validateName = (name) => {
    return name.length > 0 && name.length <= 7;
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const nameIsValid = validateName(name);
    setIsNameValid(nameIsValid);

    if (!nameIsValid) {
      nameRef.current?.focus();
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/mypage/`,
        {
          name,
          background_photo: photo,
          color,
          typography: typo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      navigate('/home');
    } catch (error) {
      console.error('프로필 설정 실패:', error);
    }
  };

  return (
    <>
      <AuthInput
        ref={nameRef}
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        isValid={isNameValid}
        errorText="You can enter up to 7 letters."
      />

      <Section>
        <Label>Background Photo</Label>
        {photo ? (
          <PhotoLabel>
            <PreviewBox>
              <Preview src={photo} alt="photo preview" />
              <EditBtn>Edit</EditBtn>
            </PreviewBox>
            <HiddenInput
              type="file"
              onChange={handlePhotoUpload}
              accept="image/*"
            />
          </PhotoLabel>
        ) : (
          <PhotoLabel>
            <PlusSquare style={{ width: '2.75rem' }} />
            <HiddenInput
              type="file"
              onChange={handlePhotoUpload}
              accept="image/*"
            />
          </PhotoLabel>
        )}
      </Section>

      <Section>
        <Label>Your Color</Label>
        {colors.map((color) => (
          <ColorButton $color={color} />
        ))}
      </Section>

      <Section>
        <Label>typography</Label>
        {typos.map((typo) => (
          <TypeButton $typo={typo}>Aa</TypeButton>
        ))}
        <DoneButton onClick={handleSubmit}>Done</DoneButton>
      </Section>
    </>
  );
};

export default Onboarding;

const Label = styled.p`
  ${({ theme }) => theme.font.common_detail};
  margin-bottom: 0.4rem;
`;

const Section = styled.div`
  margin-bottom: 0.88rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PhotoLabel = styled.label`
  cursor: pointer;
`;

const PreviewBox = styled.div`
  position: relative;
  width: 9rem;
  height: 9rem;
`;

const Preview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EditBtn = styled.div`
  ${({ theme }) => theme.font.common_input}
  width: 2.75rem;
  height: 2.75rem;
  padding: 0.45rem;
  background-color: white;
  color: black;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  transition: all 0.15s ease-in-out;

  ${PreviewBox}:hover & {
    background-color: #ff0000;
    color: white;
  }
`;

const ColorButton = styled.button`
  width: 2.8rem;
  height: 2.8rem;
  background-color: ${(props) => props.$color};
  border: none;
  margin-right: 0.625rem;
`;

const TypeButton = styled.button`
  all: unset;
  font-family: ${(props) => props.$typo};
  font-size: 2rem;
  margin-right: 1.47rem;
  font-weight: 600;
`;

const DoneButton = styled.div`
  ${({ theme }) => theme.font.m_btn};
  width: fit-content;
  padding: 0.25rem 0.75rem;
  margin: 0 auto;
  background-color: black;
`;
