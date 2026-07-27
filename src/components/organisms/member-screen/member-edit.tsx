import {useEffect, useMemo, useState} from 'react';
import {
  Alert,
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
import Button from '../../atoms/common/button/button';
import {DESTRUCTIVE, GRAY, MAIN, WHITE} from '../../../constants/style/color';

type MemberEditProps = {
  visible: boolean;
  churchId?: number;
  member?: Member | null;
  onClose: () => void;
  onUpdated: () => void;
};

const MemberEdit = ({
  visible,
  churchId,
  member,
  onClose,
  onUpdated,
}: MemberEditProps) => {
  const memberApi = useMemo(() => new MemberApi(), []);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  // 열릴 때 기존 값으로 초기화
  useEffect(() => {
    if (visible && member) {
      setName(member.name ?? '');
      setPhone(member.mobilePhone ?? '');
    }
  }, [visible, member]);

  const canSave = name.trim().length > 0 && phone.trim().length > 0 && !saving;

  const onSave = async () => {
    if (!churchId || !member || !canSave) return;
    setSaving(true);
    try {
      await memberApi.updateMember({
        churchId,
        memberId: member.id,
        body: {name: name.trim(), mobilePhone: phone.trim()},
      });
      onUpdated();
      onClose();
    } catch (e) {
      Alert.alert(
        '수정 실패',
        '입력값을 확인하거나 잠시 후 다시 시도해주세요.',
      );
    } finally {
      setSaving(false);
    }
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
              취소
            </MainText>
          </Pressable>
          <MainText fontSize={17} fontWeight={700} color={GRAY.EXTRA_DARK}>
            교인 수정
          </MainText>
          <View style={{width: 40}} />
        </View>

        <View style={styles.body}>
          <View style={styles.field}>
            <MainText fontSize={14} fontWeight={600} color={GRAY.EXTRA_DARK}>
              이름 <MainText color={DESTRUCTIVE.DEFAULT}>*</MainText>
            </MainText>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력해주세요."
              placeholderTextColor={GRAY.DEFAULT}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.field}>
            <MainText fontSize={14} fontWeight={600} color={GRAY.EXTRA_DARK}>
              전화번호 <MainText color={DESTRUCTIVE.DEFAULT}>*</MainText>
            </MainText>
            <TextInput
              style={styles.input}
              placeholder="전화번호를 입력해주세요."
              placeholderTextColor={GRAY.DEFAULT}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            text="저장"
            width={'auto'}
            height={44}
            disabled={!canSave}
            backgroundColor={canSave ? MAIN.DEFAULT : MAIN.LIGHT}
            onPress={onSave}
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
  body: {padding: 20, gap: 20},
  field: {gap: 8},
  input: {
    borderWidth: 1,
    borderColor: GRAY.LIGHT,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: GRAY.EXTRA_DARK,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: GRAY.LIGHT,
  },
});

export default MemberEdit;
