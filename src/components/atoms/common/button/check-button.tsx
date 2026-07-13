import  {useEffect, useRef, useState, useMemo} from 'react';
import {
  Pressable,
  Animated,
  Easing,
  GestureResponderEvent,
  StyleSheet,
  ViewStyle,
} from 'react-native';

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

  const containerStyle = useMemo<ViewStyle>(
    () => ({
      width,
      height,
      opacity: disabled ? 0.5 : 1,
    }),
    [width, height, disabled],
  );

  return (
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={handlePress}
      testID="CheckButtonContainer">
      <Animated.View style={{opacity: animatedOpacity}}>
        <Check width={25} height={25} stroke={MAIN.DEFAULT} />
      </Animated.View>
    </Pressable>
  );
};

export default CheckButton;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: GRAY.DEFAULT,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
