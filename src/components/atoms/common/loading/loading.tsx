import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';

type LoadingProps = {
  isShow: boolean; // 로딩 표시 여부
  loadingText?: string; // 표시할 텍스트
};

const Loading = ({isShow, loadingText = 'Loading...'}: LoadingProps) => {
  // 0.5초 이상 지속되는 로딩만 표시하기 위한 state
  const [shouldRender, setShouldRender] = useState(false);

  // 오퍼시티 애니메이션: 0 -> 1
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 지연 로직
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isShow) {
      // 0.5초 뒤에 shouldRender = true
      timer = setTimeout(() => {
        setShouldRender(true);
      }, 500);
    } else {
      // isShow가 false면 즉시 표시 안 함
      setShouldRender(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isShow]);

  // shouldRender가 true가 되는 순간에만 fade-in
  useEffect(() => {
    if (shouldRender) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else {
      // mount 되기 전에 fadeAnim을 초기화할 수도 있음
      fadeAnim.setValue(0);
    }
  }, [shouldRender, fadeAnim]);

  // 아직 shouldRender가 false면 null
  if (!shouldRender) return null;

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>{loadingText}</Text>
      </Animated.View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});
