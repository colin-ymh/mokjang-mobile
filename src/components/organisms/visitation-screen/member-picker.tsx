import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import {MemberApi} from '../../../api/member/member.api';
import {Member} from '../../../models/member/member';
import {MainText} from '../../atoms/common/text/main-text';
import {GRAY, MAIN, WHITE} from '../../../constants/style/color';
import {showErrorAlert} from '../../../utils/error-handler';

type MemberPickerProps = {
  visible: boolean;
  churchId?: number;
  mode: 'single' | 'multi';
  initialSelected?: Member[];
  onClose: () => void;
  onConfirm: (members: Member[]) => void;
};

// 담당자(단일)/대상자(다중) 선택용 공용 교인 선택 모달.
const MemberPicker = ({
  visible,
  churchId,
  mode,
  initialSelected,
  onClose,
  onConfirm,
}: MemberPickerProps) => {
  const memberApi = useMemo(() => new MemberApi(), []);
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Member[]>([]);

  const load = useCallback(
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
        showErrorAlert(e);
      } finally {
        setLoading(false);
      }
    },
    [churchId, cursor, hasMore, loading, memberApi, search],
  );

  useEffect(() => {
    if (visible) {
      setSelected(initialSelected ?? []);
      setSearch('');
      setMembers([]);
      setCursor(undefined);
      setHasMore(false);
      load({reset: true});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, churchId]);

  const toggle = (member: Member) => {
    if (mode === 'single') {
      setSelected([member]);
      return;
    }
    setSelected(prev =>
      prev.some(m => m.id === member.id)
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member],
    );
  };

  const onSubmitSearch = () => load({reset: true, searchText: search});

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={10}>
            <MainText fontSize={16} color={GRAY.SEMI_DARK}>
              취소
            </MainText>
          </Pressable>
          <MainText fontSize={17} fontWeight={700} color={GRAY.EXTRA_DARK}>
            {mode === 'single' ? '담당자 선택' : '대상자 선택'}
          </MainText>
          <Pressable
            onPress={() => {
              onConfirm(selected);
              onClose();
            }}
            hitSlop={10}>
            <MainText fontSize={16} color={MAIN.DEFAULT}>
              확인
            </MainText>
          </Pressable>
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
          renderItem={({item}) => {
            const isSelected = selected.some(m => m.id === item.id);
            return (
              <Pressable
                style={[styles.row, isSelected && styles.rowSelected]}
                onPress={() => toggle(item)}>
                <MainText fontSize={15} color={GRAY.EXTRA_DARK}>
                  {item.name}
                </MainText>
                {isSelected ? (
                  <MainText fontSize={13} fontWeight={600} color={MAIN.DEFAULT}>
                    선택됨
                  </MainText>
                ) : null}
              </Pressable>
            );
          }}
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: WHITE},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.LIGHT,
  },
  searchBox: {paddingHorizontal: 16, paddingVertical: 12},
  searchInput: {
    borderWidth: 1,
    borderColor: GRAY.LIGHT,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: GRAY.EXTRA_DARK,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.LIGHT,
  },
  rowSelected: {backgroundColor: GRAY.BACKGROUND},
  empty: {alignItems: 'center', paddingTop: 60},
  footer: {paddingVertical: 20},
});

export default MemberPicker;
