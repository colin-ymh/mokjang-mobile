import React, {ReactNode, useEffect, useRef} from 'react';
import {Pressable, Animated} from 'react-native';
import styled from 'styled-components/native';

import {MAIN, WHITE} from '../../../../constants/style/color';
import {MainText, MainTextProps} from '../text/main-text';

export type ButtonProps = MainTextProps & {
  text?: string;
  disabled?: boolean;
  onPress?: () => void;
  width?: number | 'auto';
  height?: number;
  backgroundColor?: string;
  color?: string;
  isShadow?: boolean;
  borderRadius?: number;
  children?: ReactNode;
  borderColor?: string;
};

/** AnimatedPressable: Pressable을 Animated로 래핑 */
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** styled-components로 감싸되, transform 등은 Animated.Value로 처리 */
const ButtonContainer = styled(AnimatedPressable)<{
  $width?: number | 'auto';
  $height?: number;
  $backgroundColor?: string;
  $isShadow?: boolean;
  $borderRadius?: number;
  $borderColor?: string;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;

  /* width 처리 */
  ${({$width}) => {
    if ($width === 'auto') return 'width: auto;';
    if (typeof $width === 'number') return `width: ${$width}px;`;
    return 'width: 100%;';
  }}

  /* height 처리 */
  ${({$height}) => ($height ? `height: ${$height}px;` : 'height: 100%;')}

  background-color: ${({$backgroundColor}) =>
    $backgroundColor || 'transparent'};
  border-radius: ${({$borderRadius}) => ($borderRadius ? $borderRadius : 5)}px;
  border-width: ${({$borderColor}) => ($borderColor ? 1 : 0)}px;
  border-color: ${({$borderColor}) => $borderColor ?? 'transparent'};

  /* iOS / Android 그림자 */
  ${({$isShadow}) =>
    $isShadow
      ? `
      shadow-color: #000;
      shadow-offset: { width: 2, height: 2 };
      shadow-opacity: 0.2;
      shadow-radius: 5px;
      elevation: 3;
    `
      : `
      shadow-color: transparent;
      elevation: 0;
    `}
`;

const Button = ({
  text,
  disabled = false,
  onPress,
  width,
  height,
  backgroundColor = MAIN.DEFAULT,
  isShadow = false,
  borderRadius = 5,
  // text props
  color = WHITE,
  fontWeight,
  fontSize,
  children,
  borderColor,
}: ButtonProps) => {
  const animatedOpacity = useRef(
    new Animated.Value(disabled ? 0.6 : 1),
  ).current;

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: disabled ? 0.6 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [disabled, animatedOpacity]);

  const animatedScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(animatedScale, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const animatedStyle = {
    opacity: animatedOpacity,
    transform: [{scale: animatedScale}],
  };

  return (
    <ButtonContainer
      style={animatedStyle}
      disabled={disabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      $width={width}
      $height={height}
      $backgroundColor={backgroundColor}
      $isShadow={isShadow}
      $borderRadius={borderRadius}
      $borderColor={borderColor}>
      {children ? (
        children
      ) : (
        <MainText color={color} fontWeight={fontWeight} fontSize={fontSize}>
          {text}
        </MainText>
      )}
    </ButtonContainer>
  );
};

export default Button;
