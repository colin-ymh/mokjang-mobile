import {Image, Pressable, StyleSheet, View} from 'react-native';

import {MainText} from '../../atoms/common/text/main-text';
import {GRAY, MAIN} from '../../../constants/style/color';
import {Member} from '../../../models/member/member';

type MemberCardProps = {
  member: Member;
  onPress: (memberId: string) => void;
};

const MemberCard = ({member, onPress}: MemberCardProps) => {
  const officer = member.officer?.name;
  const group = member.group?.name;

  return (
    <Pressable
      style={({pressed}) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(member.id)}>
      {member.profileImageUrl ? (
        <Image source={{uri: member.profileImageUrl}} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]} />
      )}

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <MainText fontSize={15} fontWeight={600} color={GRAY.EXTRA_DARK}>
            {member.name}
          </MainText>
          {officer ? (
            <MainText fontSize={13} color={GRAY.SEMI_DARK}>
              {officer}
            </MainText>
          ) : null}
          {group ? (
            <View style={styles.badge}>
              <MainText fontSize={11} color={MAIN.DARK}>
                {group}
              </MainText>
            </View>
          ) : null}
        </View>
        <MainText fontSize={13} color={GRAY.SEMI_DARK}>
          {member.mobilePhone}
        </MainText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.LIGHT,
  },
  pressed: {backgroundColor: GRAY.BACKGROUND},
  avatar: {width: 40, height: 40, borderRadius: 20},
  avatarPlaceholder: {backgroundColor: GRAY.LIGHT},
  info: {flex: 1, gap: 4},
  nameRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  badge: {
    backgroundColor: MAIN.LIGHT,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default MemberCard;
