import {ReactNode, useEffect, useMemo, useRef} from 'react';
import {Pressable, Animated, StyleSheet, ViewStyle} from 'react-native';

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

  const containerStyle = useMemo(() => {
    const s: ViewStyle = {};

    // width 처리
    if (width === 'auto') s.width = 'auto';
    else if (typeof width === 'number') s.width = width;
    else s.width = '100%';

    // height 처리
    if (typeof height === 'number') s.height = height;
    else s.height = '100%';

    // background / radius / border
    s.backgroundColor = backgroundColor || 'transparent';
    s.borderRadius = borderRadius ?? 5;

    if (borderColor) {
      s.borderWidth = 1;
      s.borderColor = borderColor;
    } else {
      s.borderWidth = 0;
      s.borderColor = 'transparent';
    }

    return s;
  }, [width, height, backgroundColor, borderRadius, borderColor]);

  return (
    <AnimatedPressable
      style={[
        styles.container,
        containerStyle,
        isShadow ? styles.shadow : styles.noShadow,
        animatedStyle,
      ]}
      disabled={disabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      {children ? (
        children
      ) : (
        <MainText color={color} fontWeight={fontWeight} fontSize={fontSize}>
          {text}
        </MainText>
      )}
    </AnimatedPressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // iOS / Android 그림자
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  noShadow: {
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
});
