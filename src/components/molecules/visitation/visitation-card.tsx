import {Pressable, StyleSheet, View} from 'react-native';

import {MainText} from '../../atoms/common/text/main-text';
import {GRAY} from '../../../constants/style/color';
import {Visitation} from '../../../models/visitation/visitation';
import {
  formatDate,
  methodLabel,
  statusColor,
  statusLabel,
} from '../../../constants/visitation';

type VisitationCardProps = {
  visitation: Visitation;
  onPress: (visitationId: string) => void;
};

const VisitationCard = ({visitation, onPress}: VisitationCardProps) => {
  const sc = statusColor(visitation.status);
  const inCharge = visitation.inCharge?.name;
  const memberCount = visitation.members?.length ?? 0;

  return (
    <Pressable
      style={({pressed}) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(visitation.id)}>
      <View style={styles.titleRow}>
        <MainText fontSize={15} fontWeight={600} color={GRAY.EXTRA_DARK}>
          {visitation.title || '(제목 없음)'}
        </MainText>
        <View style={[styles.badge, {backgroundColor: sc.bg}]}>
          <MainText fontSize={11} color={sc.text}>
            {statusLabel(visitation.status)}
          </MainText>
        </View>
      </View>

      <View style={styles.metaRow}>
        <MainText fontSize={13} color={GRAY.SEMI_DARK}>
          {formatDate(visitation.startDate)}
        </MainText>
        <MainText fontSize={13} color={GRAY.SEMI_DARK}>
          {methodLabel(visitation.visitationMethod)}
        </MainText>
        {inCharge ? (
          <MainText fontSize={13} color={GRAY.SEMI_DARK}>
            담당 {inCharge}
          </MainText>
        ) : null}
        {memberCount > 0 ? (
          <MainText fontSize={13} color={GRAY.SEMI_DARK}>
            대상 {memberCount}명
          </MainText>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.LIGHT,
  },
  pressed: {backgroundColor: GRAY.BACKGROUND},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4},
});

export default VisitationCard;
