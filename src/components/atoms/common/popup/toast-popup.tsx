import React, {useEffect, useRef, useCallback} from 'react';
import {Animated, Easing} from 'react-native';
import ToastPopupView, {TOAST_DIRECTION} from './toast-popup.view';
import {FONT_WEIGHT} from '../../../../constants/style/style';

type ToastPopupProps = {
  setIsShow: (isOpen: boolean) => void;
  text?: string;
  backgroundColor?: string;
  timeout?: number;
  isDeletable?: boolean;
  direction?: TOAST_DIRECTION;
  // 텍스트 스타일
  fontSize?: number;
  fontWeight?: FONT_WEIGHT;
  color?: string;
};

const ToastPopup = ({
  setIsShow,
  text = '',
  backgroundColor = '#000',
  timeout = 3000,
  isDeletable = false,
  direction = TOAST_DIRECTION.TOP,
  fontSize = 14,
  fontWeight = '400',
  color = '#fff',
}: ToastPopupProps) => {
  // 초기 위치: TOP이면 -50 (화면 위), BOTTOM이면 50 (화면 아래)
  const initialSlide = direction === TOAST_DIRECTION.TOP ? -50 : 50;
  const slideAnim = useRef(new Animated.Value(initialSlide)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // 퇴장 애니메이션: translateY를 초기값으로, opacity를 0으로 변경
  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: initialSlide,
        duration: 500,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
      if (finished) {
        setIsShow(false);
      }
    });
  }, [initialSlide, slideAnim, opacityAnim, setIsShow]);

  // 등장 애니메이션: translateY를 0으로, opacity를 1로 변경
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true, // transform 지원
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true, // opacity 지원
      }),
    ]).start();

    const timer = setTimeout(() => {
      hideToast();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, slideAnim, opacityAnim, hideToast]);

  const onClickDeleteButton = () => {
    hideToast();
  };

  const containerStyle = {
    opacity: opacityAnim,
    transform: [{translateY: slideAnim}],
  };

  return (
    <ToastPopupView
      text={text}
      backgroundColor={backgroundColor}
      isDeletable={isDeletable}
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={color}
      containerStyle={containerStyle}
      onClickDeleteButton={onClickDeleteButton}
      direction={direction}
    />
  );
};

export default ToastPopup;
