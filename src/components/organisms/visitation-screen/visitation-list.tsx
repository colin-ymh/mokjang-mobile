import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../redux/store';
import {VisitationApi} from '../../../api/visitation/visitation.api';
import {Visitation} from '../../../models/visitation/visitation';
import VisitationCard from '../../molecules/visitation/visitation-card';
import VisitationDetail from './visitation-detail';
import {MainText} from '../../atoms/common/text/main-text';
import {GRAY, MAIN, WHITE} from '../../../constants/style/color';

const TAKE = 20;

const VisitationList = () => {
  const visitationApi = useMemo(() => new VisitationApi(), []);
  const churchId = useSelector(
    (state: RootState) => state.user.user.churchUser?.[0]?.churchId,
  );

  const [visitations, setVisitations] = useState<Visitation[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailId, setDetailId] = useState<string | undefined>(undefined);

  const load = useCallback(
    async (opts: {reset?: boolean; searchText?: string} = {}) => {
      if (!churchId || loading) return;
      const {reset = false, searchText} = opts;
      if (!reset && !hasMore) return;
      const nextPage = reset ? 1 : page + 1;

      setLoading(true);
      try {
        const res = await visitationApi.getVisitations({
          churchId,
          page: nextPage,
          take: TAKE,
          title: searchText ?? search,
        });
        const data: Visitation[] = res.data.data ?? [];
        setVisitations(prev => (reset ? data : [...prev, ...data]));
        setPage(nextPage);
        setHasMore(data.length === TAKE);
      } catch (e) {
        // TODO: 토스트로 에러 표시
      } finally {
        setLoading(false);
      }
    },
    [churchId, hasMore, loading, page, search, visitationApi],
  );

  useEffect(() => {
    load({reset: true});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [churchId]);

  const onSubmitSearch = () => load({reset: true, searchText: search});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MainText fontSize={22} fontWeight={700} color={GRAY.EXTRA_DARK}>
          심방
        </MainText>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder={'제목으로 검색해주세요.'}
          placeholderTextColor={GRAY.DEFAULT}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={onSubmitSearch}
          returnKeyType={'search'}
        />
      </View>

      <FlatList
        data={visitations}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <VisitationCard visitation={item} onPress={id => setDetailId(id)} />
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

      <VisitationDetail
        visible={!!detailId}
        churchId={churchId}
        visitationId={detailId}
        onClose={() => setDetailId(undefined)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: WHITE},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {paddingHorizontal: 16, paddingBottom: 12},
  searchInput: {
    borderWidth: 1,
    borderColor: GRAY.LIGHT,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: GRAY.EXTRA_DARK,
  },
  empty: {alignItems: 'center', paddingTop: 60},
  footer: {paddingVertical: 20},
});

export default VisitationList;
