import React, {useEffect, useRef, useState} from 'react';
import {Pressable, Animated, Easing, GestureResponderEvent} from 'react-native';
import styled from 'styled-components/native';

import Check from '../../../../../public/svg/check.svg';
import {GRAY, MAIN} from '../../../../constants/style/color';

type CheckButtonProps = {
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  isStopPropagation?: boolean;
};

const Container = styled(Pressable)<{
  $width: number;
  $height: number;
  $disabled: boolean;
}>`
  border-width: 1px;
  border-color: ${GRAY.DEFAULT};
  border-radius: 5px;
  width: ${({$width}) => $width}px;
  height: ${({$height}) => $height}px;
  align-items: center;
  justify-content: center;
  opacity: ${({$disabled}) => ($disabled ? 0.5 : 1)};
`;

const CheckContainer = styled(Animated.View)``;

const StyledCheck = styled(Check)<{strokeColor?: string}>`
  width: 25px;
  height: 25px;
`;

const CheckButton = ({
  value,
  onChange,
  disabled = false,
  width = 25,
  height = 25,
  isStopPropagation = true,
}: CheckButtonProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(value);

  const animatedOpacity = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    setIsChecked(value);
    Animated.timing(animatedOpacity, {
      toValue: value ? 1 : 0,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [value, animatedOpacity]);

  const handlePress = (event: GestureResponderEvent) => {
    if (isStopPropagation) {
      event.stopPropagation?.();
    }
    if (!disabled) {
      const newValue = !isChecked;
      setIsChecked(newValue);
      onChange?.(newValue);
      Animated.timing(animatedOpacity, {
        toValue: newValue ? 1 : 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Container
      $width={width}
      $height={height}
      $disabled={disabled}
      onPress={handlePress}
      testID="CheckButtonContainer">
      <CheckContainer style={{opacity: animatedOpacity}}>
        <StyledCheck strokeColor={MAIN.DEFAULT} />
      </CheckContainer>
    </Container>
  );
};

export default CheckButton;
