import {useMemo} from 'react';
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import {FONT_WEIGHT} from '../../../../constants/style/style';
import {WHITE} from '../../../../constants/style/color';

export enum TOAST_DIRECTION {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

type ToastPopupViewProps = {
  text: string;
  backgroundColor: string;
  isDeletable: boolean;
  fontSize: number;
  fontWeight: FONT_WEIGHT;
  color: string;
  direction: TOAST_DIRECTION;
  // Animated.View 스타일 (top/bottom, opacity 등)
  containerStyle: any;
  onClickDeleteButton: () => void;
};

export default function ToastPopupView({
  text,
  backgroundColor,
  isDeletable,
  fontSize,
  fontWeight,
  color,
  containerStyle,
  onClickDeleteButton,
  direction,
}: ToastPopupViewProps) {
  const wrapperStyle = useMemo<ViewStyle>(
    () => ({
      justifyContent:
        direction === TOAST_DIRECTION.TOP ? 'flex-start' : 'flex-end',
    }),
    [direction],
  );

  const containerBaseStyle = useMemo<ViewStyle>(
    () => ({
      backgroundColor,
    }),
    [backgroundColor],
  );

  return (
    <View style={[styles.wrapper, wrapperStyle]} pointerEvents="none">
      <Animated.View
        pointerEvents="auto"
        style={[styles.container, containerBaseStyle, containerStyle]}>
        <Text style={{color, fontSize, fontWeight: String(fontWeight) as any}}>
          {text}
        </Text>

        {isDeletable && (
          <Pressable style={styles.closeButton} onPress={onClickDeleteButton}>
            <Text style={{color: WHITE}}>X</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    left: 30,
    right: 30,
    height: 40,
    bottom: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 5,
  },
});
