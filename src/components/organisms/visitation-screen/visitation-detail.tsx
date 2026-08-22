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

import {VisitationApi} from '../../../api/visitation/visitation.api';
import {Visitation} from '../../../models/visitation/visitation';
import {MainText} from '../../atoms/common/text/main-text';
import Button from '../../atoms/common/button/button';
import {DESTRUCTIVE, GRAY, MAIN, WHITE} from '../../../constants/style/color';
import {
  formatDate,
  methodLabel,
  statusColor,
  statusLabel,
} from '../../../constants/visitation';
import {showErrorAlert} from '../../../utils/error-handler';

type VisitationDetailProps = {
  visible: boolean;
  churchId?: number;
  visitationId?: string;
  onClose: () => void;
  onDeleted: () => void;
  onEdit?: (visitation: Visitation) => void;
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

const VisitationDetail = ({
  visible,
  churchId,
  visitationId,
  onClose,
  onDeleted,
  onEdit,
}: VisitationDetailProps) => {
  const visitationApi = useMemo(() => new VisitationApi(), []);
  const [visitation, setVisitation] = useState<Visitation | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!churchId || !visitationId) return;
    setLoading(true);
    try {
      const res = await visitationApi.getVisitation({churchId, visitationId});
      setVisitation(res.data?.data ?? res.data);
    } catch (e) {
      showErrorAlert(e);
    } finally {
      setLoading(false);
    }
  }, [churchId, visitationId, visitationApi]);

  useEffect(() => {
    if (visible) {
      load();
    } else {
      setVisitation(null);
    }
  }, [visible, load]);

  const sc = statusColor(visitation?.status);
  const period = visitation
    ? `${formatDate(visitation.startDate)} ~ ${formatDate(visitation.endDate)}`
    : '-';
  const memberNames = visitation?.members?.map(m => m.name).join(', ');

  const onDelete = () => {
    if (!churchId || !visitationId) return;
    Alert.alert('심방 삭제', '이 심방을 삭제할까요?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await visitationApi.deleteVisitation({churchId, visitationId});
            onDeleted();
            onClose();
          } catch (e) {
            showErrorAlert(e, '삭제 실패');
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
            심방 정보
          </MainText>
          <View style={{width: 32}} />
        </View>

        {loading || !visitation ? (
          <ActivityIndicator style={styles.loading} color={MAIN.DEFAULT} />
        ) : (
          <ScrollView contentContainerStyle={styles.body}>
            <View style={styles.titleRow}>
              <MainText fontSize={22} fontWeight={700} color={GRAY.EXTRA_DARK}>
                {visitation.title || '(제목 없음)'}
              </MainText>
              <View style={[styles.badge, {backgroundColor: sc.bg}]}>
                <MainText fontSize={12} color={sc.text}>
                  {statusLabel(visitation.status)}
                </MainText>
              </View>
            </View>

            <View style={styles.rows}>
              <Row
                label="방식"
                value={methodLabel(visitation.visitationMethod)}
              />
              <Row label="기간" value={period} />
              <Row label="담당" value={visitation.inCharge?.name} />
              <Row label="대상" value={memberNames} />
            </View>

            {visitation.visitationDetails?.length ? (
              <View style={styles.details}>
                <MainText
                  fontSize={15}
                  fontWeight={700}
                  color={GRAY.EXTRA_DARK}>
                  심방 내용
                </MainText>
                {visitation.visitationDetails.map((d, i) => (
                  <View key={d.id ?? i} style={styles.detailCard}>
                    {d.member?.name ? (
                      <MainText
                        fontSize={14}
                        fontWeight={600}
                        color={GRAY.DARK}>
                        {d.member.name}
                      </MainText>
                    ) : null}
                    <Row label="내용" value={d.visitationContent} />
                    <Row label="기도" value={d.visitationPray} />
                  </View>
                ))}
              </View>
            ) : null}
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
            onPress={() => visitation && onEdit?.(visitation)}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rows: {gap: 16},
  row: {gap: 4},
  badge: {paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4},
  details: {gap: 12},
  detailCard: {
    gap: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: GRAY.LIGHT,
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: GRAY.LIGHT,
  },
});

export default VisitationDetail;
