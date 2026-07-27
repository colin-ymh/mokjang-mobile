import {SafeAreaView, StyleSheet, View} from 'react-native';

import {MainText} from '../text/main-text';
import {GRAY, WHITE} from '../../../../constants/style/color';

type ComingSoonProps = {
  title: string;
};

// 아직 네이티브로 전환되지 않은 화면용 자리표시자.
// (WebView는 app.ekkly.life 세션을 못 받아 빈 화면이 되므로 스텁으로 대체)
const ComingSoon = ({title}: ComingSoonProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MainText fontSize={22} fontWeight={700} color={GRAY.EXTRA_DARK}>
          {title}
        </MainText>
      </View>
      <View style={styles.body}>
        <MainText fontSize={15} color={GRAY.DEFAULT}>
          준비 중입니다.
        </MainText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: WHITE},
  header: {paddingHorizontal: 16, paddingVertical: 12},
  body: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default ComingSoon;
