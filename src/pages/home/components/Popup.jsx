import React from 'react';
import styled from 'styled-components';

const Popup = ({ productToDelete, cancelDelete, confirmDelete }) => {
  if (!productToDelete) return null;

  return (
    <PopupOverlay>
      <PopupContainer>
        <PopupText>Do you wanna delete this?</PopupText>
        <div>
          <PopupItemImage
            src={productToDelete.item_image}
            alt={productToDelete.name}
          />
          <PopupMiddleWrapper>
            <PopupItemName>{productToDelete.name}</PopupItemName>
            <PopupOption>
              <span>option. </span>
              <span>ⓒ {productToDelete.color} </span>
              <span>ⓢ {productToDelete.size} </span>
              <span>ⓞ {productToDelete.other_option} </span>
            </PopupOption>
            <PopupPrice>
              price. {productToDelete.price?.toLocaleString()} 원
            </PopupPrice>
            <PopupActions>
              <PopupButton onClick={cancelDelete}>No</PopupButton>
              <PopupButton onClick={confirmDelete}>Yes</PopupButton>
            </PopupActions>
          </PopupMiddleWrapper>
        </div>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default Popup;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background: white;
  background-color: #168395;
  box-shadow: 4px 4px 0px 0px #0e0a04;
  width: 32.55rem;
  height: 21.75rem;

  > div {
    display: flex;
    padding: 1.1rem 2.1rem 1.9rem 2.1rem;
  }
`;

const PopupMiddleWrapper = styled.div`
  gap: 1.05rem;
  padding-left: 1rem;
  width: 19rem;
`;
const PopupText = styled.p`
  width: 100%;
  background-color: black;
  margin-bottom: 1rem;
  height: 3.9rem;
  padding: 1rem 1.25rem;
  ${({ theme }) => theme.font.p_popTitle}
`;
const PopupItemImage = styled.img`
  width: 9.2rem;
  height: 11.5rem;
`;
const PopupItemName = styled.div`
  ${({ theme }) => theme.font.p_popTitle_eng}
`;
const PopupPrice = styled.div`
  ${({ theme }) => theme.font.common_text}
  margin-top: 1rem;
`;
const PopupOption = styled.div`
  ${({ theme }) => theme.font.common_text}
  margin-top: 1rem;
`;
const PopupActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: end;
  width: 97%;
`;

const PopupButton = styled.button`
  padding: 0.25rem 1.125rem;
  width: 4.375rem;
  color: white;
  border: none;
  cursor: pointer;
  ${({ theme }) => theme.font.p_btn}

  &:nth-child(1) {
    background: black;
  }
  &:nth-child(2) {
    background: #ffa100;
  }
`;