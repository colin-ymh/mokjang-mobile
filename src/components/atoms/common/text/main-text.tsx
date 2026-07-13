import {Text, StyleSheet, TextProps, TextStyle} from 'react-native';

import {SIZE} from '../../../../constants/style/style';
import {BLACK} from '../../../../constants/style/color';

export type MainTextProps = TextProps & {
  size?: SIZE;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
};

const getFontSize = (size?: SIZE, fontSize?: number): number => {
  if (fontSize) return fontSize;

  switch (size) {
    case SIZE.EXTRA_SMALL:
      return 10;
    case SIZE.SMALL:
      return 12;
    case SIZE.LARGE:
      return 16;
    case SIZE.EXTRA_LARGE:
      return 20;
    case SIZE.MEDIUM:
    default:
      return 14;
  }
};

const getFontWeight = (
  size?: SIZE,
  fontWeight?: number,
): TextStyle['fontWeight'] => {
  if (fontWeight) return String(fontWeight) as TextStyle['fontWeight'];

  switch (size) {
    case SIZE.EXTRA_SMALL:
      return '200';
    case SIZE.SMALL:
      return '300';
    case SIZE.LARGE:
      return '500';
    case SIZE.EXTRA_LARGE:
      return '600';
    case SIZE.MEDIUM:
    default:
      return '400';
  }
};

export const MainText = ({
  size,
  color = BLACK,
  fontSize,
  fontWeight,
  style,
  children,
  ...rest
}: MainTextProps) => {
  const dynamicStyle: TextStyle = {
    fontSize: getFontSize(size, fontSize),
    color,
    fontWeight: getFontWeight(size, fontWeight),
  };

  return (
    <Text style={[styles.base, dynamicStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    maxWidth: '100%', // 버튼 크기를 벗어나지 않도록 제한
  },
});
