import styled from 'styled-components/native';

import {SIZE} from '../../../../constants/style/style';
import {BLACK} from '../../../../constants/style/color';

export type MainTextProps = {
  size?: SIZE;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
};

const getFontSize = (size?: SIZE, fontSize?: number) => {
  if (fontSize) {
    return `${fontSize}px`; // fontSize 가 설정된 경우 그대로 사용
  }

  switch (size) {
    case SIZE.EXTRA_SMALL:
      return `${10}px`;
    case SIZE.SMALL:
      return `${12}px`;
    case SIZE.LARGE:
      return `${16}px`;
    case SIZE.EXTRA_LARGE:
      return `${20}px`;
    case SIZE.MEDIUM:
    default:
      return `${14}px`;
  }
};

// size에 따라 font-weight를 조정
const getFontWeight = (size?: SIZE, fontWeight?: number) => {
  if (fontWeight) {
    return fontWeight; // fontWeight가 설정된 경우 그대로 사용
  }

  // size에 따른 기본 font-weight 값 설정
  switch (size) {
    case SIZE.EXTRA_SMALL:
      return 200;
    case SIZE.SMALL:
      return 300;
    case SIZE.LARGE:
      return 500;
    case SIZE.EXTRA_LARGE:
      return 600;
    case SIZE.MEDIUM:
    default:
      return 400;
  }
};

export const MainText = styled.Text<MainTextProps>`
  margin: 0;
  font-size: ${({size, fontSize}) => getFontSize(size, fontSize)};
  color: ${({color}) => color || BLACK};
  font-weight: ${({size, fontWeight}) => getFontWeight(size, fontWeight)};

  max-width: 100%; /* 버튼 크기를 벗어나지 않도록 제한 */
`;
