import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';

import {RootState} from '../../../redux/store';
import {WorshipApi} from '../../../api/worship/worship.api';
import {Worship} from '../../../models/worship/worship';
import {MainText} from '../../atoms/common/text/main-text';
import {GRAY, MAIN, WHITE} from '../../../constants/style/color';
import {weekdayLabel} from '../../../constants/worship';
import {
  ATTENDANCE_STACK,
  AttendanceStackParams,
} from '../../../constants/navigator/navigator';
import {showErrorAlert} from '../../../utils/error-handler';

const TAKE = 20;

const WorshipList = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AttendanceStackParams>>();
  const worshipApi = useMemo(() => new WorshipApi(), []);
  const churchId = useSelector(
    (state: RootState) => state.user.user.churchUser?.[0]?.churchId,
  );

  const [worships, setWorships] = useState<Worship[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (opts: {reset?: boolean} = {}) => {
      if (!churchId || loading) return;
      const {reset = false} = opts;
      if (!reset && !hasMore) return;
      const nextPage = reset ? 1 : page + 1;

      setLoading(true);
      try {
        const res = await worshipApi.getWorships({
          churchId,
          page: nextPage,
          take: TAKE,
        });
        const data: Worship[] = res.data.data ?? [];
        setWorships(prev => (reset ? data : [...prev, ...data]));
        setPage(nextPage);
        setHasMore(data.length === TAKE);
      } catch (e) {
        showErrorAlert(e);
      } finally {
        setLoading(false);
      }
    },
    [churchId, hasMore, loading, page, worshipApi],
  );

  useEffect(() => {
    load({reset: true});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [churchId]);

  const onPressWorship = (worship: Worship) => {
    navigation.navigate(ATTENDANCE_STACK.ROSTER.NAME, {
      worshipId: worship.id,
      worshipTitle: worship.title,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MainText fontSize={22} fontWeight={700} color={GRAY.EXTRA_DARK}>
          출석
        </MainText>
      </View>

      <FlatList
        data={worships}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable
            style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => onPressWorship(item)}>
            <MainText fontSize={16} fontWeight={600} color={GRAY.EXTRA_DARK}>
              {item.title}
            </MainText>
            <MainText fontSize={13} color={GRAY.SEMI_DARK}>
              {weekdayLabel(item.worshipDay)}
            </MainText>
          </Pressable>
        )}
        onEndReachedThreshold={0.4}
        onEndReached={() => load()}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <MainText color={GRAY.DEFAULT}>목록이 비어있습니다.</MainText>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator style={styles.footer} color={MAIN.DEFAULT} />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: WHITE},
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.LIGHT,
  },
  cardPressed: {backgroundColor: GRAY.BACKGROUND},
  empty: {alignItems: 'center', paddingTop: 60},
  footer: {paddingVertical: 20},
});

export default WorshipList;
