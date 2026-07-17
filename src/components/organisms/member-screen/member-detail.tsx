import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {MemberApi} from '../../../api/member/member.api';
import {Member} from '../../../models/member/member';
import {MainText} from '../../atoms/common/text/main-text';
import Button from '../../atoms/common/button/button';
import {DESTRUCTIVE, GRAY, MAIN, WHITE} from '../../../constants/style/color';

type MemberDetailProps = {
  visible: boolean;
  churchId?: number;
  memberId?: string;
  onClose: () => void;
  onDeleted: () => void;
  onEdit?: (member: Member) => void;
};

const Row = ({label, value}: {label: string; value?: string}) => (
  <View style={styles.row}>
    <MainText fontSize={13} color={GRAY.SEMI_DARK}>
      {label}
    </MainText>
    <MainText fontSize={15} color={GRAY.EXTRA_DARK}>
      {value && value.length > 0 ? value : '-'}
    </MainText>
  </View>
);

const MemberDetail = ({
  visible,
  churchId,
  memberId,
  onClose,
  onDeleted,
  onEdit,
}: MemberDetailProps) => {
  const memberApi = useMemo(() => new MemberApi(), []);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!churchId || !memberId) return;
    setLoading(true);
    try {
      const res = await memberApi.getMember({churchId, memberId});
      setMember(res.data?.data ?? res.data);
    } catch (e) {
      // TODO: 토스트
    } finally {
      setLoading(false);
    }
  }, [churchId, memberId, memberApi]);

  useEffect(() => {
    if (visible) {
      load();
    } else {
      setMember(null);
    }
  }, [visible, load]);

  const onDelete = () => {
    if (!churchId || !memberId) return;
    Alert.alert('교인 삭제', '이 교인을 삭제할까요?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await memberApi.deleteMember({churchId, memberId});
            onDeleted();
            onClose();
          } catch (e) {
            Alert.alert('삭제 실패', '잠시 후 다시 시도해주세요.');
          }
        },
      },
    ]);
  };

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
              닫기
            </MainText>
          </Pressable>
          <MainText fontSize={17} fontWeight={700} color={GRAY.EXTRA_DARK}>
            교인정보
          </MainText>
          <View style={{width: 32}} />
        </View>

        {loading || !member ? (
          <ActivityIndicator style={styles.loading} color={MAIN.DEFAULT} />
        ) : (
          <ScrollView contentContainerStyle={styles.body}>
            <MainText fontSize={22} fontWeight={700} color={GRAY.EXTRA_DARK}>
              {member.name}
            </MainText>
            <View style={styles.rows}>
              <Row label="전화번호" value={member.mobilePhone} />
              <Row label="직분" value={member.officer?.name} />
              <Row label="그룹" value={member.group?.name ?? undefined} />
              <Row label="성별" value={member.gender} />
              <Row label="생년월일" value={member.birth} />
              <Row label="하시는 일" value={member.occupation} />
              <Row label="학교" value={member.school} />
              <Row
                label="주소"
                value={[member.address, member.detailAddress]
                  .filter(Boolean)
                  .join(' ')}
              />
            </View>
          </ScrollView>
        )}

        <View style={styles.footer}>
          <Button
            text="삭제"
            width={'auto'}
            height={44}
            backgroundColor={WHITE}
            color={DESTRUCTIVE.DEFAULT}
            borderColor={GRAY.LIGHT}
            onPress={onDelete}
          />
          <Button
            text="수정"
            width={'auto'}
            height={44}
            onPress={() => member && onEdit?.(member)}
          />
        </View>
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
  loading: {marginTop: 60},
  body: {padding: 20, gap: 20},
  rows: {gap: 16},
  row: {gap: 4},
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: GRAY.LIGHT,
  },
});

export default MemberDetail;
