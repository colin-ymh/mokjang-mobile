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
import {MemberApi} from '../../../api/member/member.api';
import {Member} from '../../../models/member/member';
import MemberCard from '../../molecules/member/member-card';
import {MainText} from '../../atoms/common/text/main-text';
import Button from '../../atoms/common/button/button';
import {GRAY, MAIN, WHITE} from '../../../constants/style/color';

type MemberListProps = {
  onPressMember?: (memberId: string) => void;
  onPressAdd?: () => void;
};

const MemberList = ({onPressMember, onPressAdd}: MemberListProps) => {
  const memberApi = useMemo(() => new MemberApi(), []);
  const churchId = useSelector(
    (state: RootState) => state.user.user.churchUser?.[0]?.churchId,
  );

  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadMembers = useCallback(
    async (opts: {reset?: boolean; searchText?: string} = {}) => {
      if (!churchId || loading) return;
      const {reset = false, searchText} = opts;
      const nextCursor = reset ? undefined : cursor;
      if (!reset && !hasMore) return;

      setLoading(true);
      try {
        const res = await memberApi.getMembers({
          churchId,
          cursor: nextCursor,
          search: searchText ?? search,
        });
        const data: Member[] = res.data.data ?? [];
        setMembers(prev => (reset ? data : [...prev, ...data]));
        setCursor(res.data.nextCursor ?? undefined);
        setHasMore(Boolean(res.data.hasMore));
      } catch (e) {
        // TODO: 토스트로 에러 표시
      } finally {
        setLoading(false);
      }
    },
    [churchId, cursor, hasMore, loading, memberApi, search],
  );

  // 최초 로드
  useEffect(() => {
    loadMembers({reset: true});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [churchId]);

  const onSubmitSearch = () => loadMembers({reset: true, searchText: search});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MainText fontSize={22} fontWeight={700} color={GRAY.EXTRA_DARK}>
          교인
        </MainText>
        <Button
          text={'+ 교인 추가'}
          height={36}
          width={'auto'}
          onPress={onPressAdd}
        />
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder={'검색어를 입력해주세요.'}
          placeholderTextColor={GRAY.DEFAULT}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={onSubmitSearch}
          returnKeyType={'search'}
        />
      </View>

      <FlatList
        data={members}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <MemberCard member={item} onPress={id => onPressMember?.(id)} />
        )}
        onEndReachedThreshold={0.4}
        onEndReached={() => loadMembers()}
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

export default MemberList;
