import {useMemo, useState} from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import {VisitationApi} from '../../../api/visitation/visitation.api';
import {Member} from '../../../models/member/member';
import {MainText} from '../../atoms/common/text/main-text';
import Button from '../../atoms/common/button/button';
import DateField from '../../atoms/common/date-field/date-field';
import MemberPicker from './member-picker';
import {DESTRUCTIVE, GRAY, MAIN, WHITE} from '../../../constants/style/color';
import {showErrorAlert} from '../../../utils/error-handler';

type VisitationAddProps = {
  visible: boolean;
  churchId?: number;
  onClose: () => void;
  onCreated: () => void;
};

const Label = ({label, required}: {label: string; required?: boolean}) => (
  <MainText fontSize={14} fontWeight={600} color={GRAY.EXTRA_DARK}>
    {label}{' '}
    {required ? <MainText color={DESTRUCTIVE.DEFAULT}>*</MainText> : null}
  </MainText>
);

const VisitationAdd = ({
  visible,
  churchId,
  onClose,
  onCreated,
}: VisitationAddProps) => {
  const visitationApi = useMemo(() => new VisitationApi(), []);

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [inCharge, setInCharge] = useState<Member | null>(null);
  const [visitedMembers, setVisitedMembers] = useState<Member[]>([]);
  const [content, setContent] = useState('');
  const [pray, setPray] = useState('');
  const [inChargePickerVisible, setInChargePickerVisible] = useState(false);
  const [memberPickerVisible, setMemberPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const canSave =
    title.trim().length > 0 &&
    !!inCharge &&
    visitedMembers.length > 0 &&
    !saving;

  const reset = () => {
    setTitle('');
    setStartDate(new Date());
    setEndDate(new Date());
    setInCharge(null);
    setVisitedMembers([]);
    setContent('');
    setPray('');
  };

  const onSave = async () => {
    if (!churchId || !inCharge || !canSave) return;
    setSaving(true);
    try {
      await visitationApi.createVisitation({
        churchId,
        body: {
          status: 'reserve',
          visitationMethod: 'inPerson',
          title: title.trim(),
          inChargeId: inCharge.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          visitationDetails: [
            {visitationContent: content.trim(), visitationPray: pray.trim()},
          ],
          memberIds: visitedMembers.map(m => m.id),
        },
      });
      reset();
      onCreated();
      onClose();
    } catch (e) {
      showErrorAlert(e, '등록 실패');
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
            심방 추가
          </MainText>
          <View style={{width: 40}} />
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.field}>
            <Label label="제목" required />
            <TextInput
              style={styles.input}
              placeholder="제목을 입력해주세요."
              placeholderTextColor={GRAY.DEFAULT}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.field}>
            <Label label="시작 일시" required />
            <View style={styles.dateRow}>
              <DateField
                value={startDate}
                mode="date"
                onChange={setStartDate}
              />
              <DateField
                value={startDate}
                mode="time"
                onChange={setStartDate}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Label label="종료 일시" required />
            <View style={styles.dateRow}>
              <DateField value={endDate} mode="date" onChange={setEndDate} />
              <DateField value={endDate} mode="time" onChange={setEndDate} />
            </View>
          </View>

          <View style={styles.field}>
            <Label label="담당자" required />
            <Pressable
              style={styles.pickerButton}
              onPress={() => setInChargePickerVisible(true)}>
              <MainText fontSize={15} color={GRAY.EXTRA_DARK}>
                {inCharge ? inCharge.name : '담당자를 선택해주세요.'}
              </MainText>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Label label="대상자" required />
            <Pressable
              style={styles.pickerButton}
              onPress={() => setMemberPickerVisible(true)}>
              <MainText fontSize={15} color={GRAY.EXTRA_DARK}>
                {visitedMembers.length > 0
                  ? visitedMembers.map(m => m.name).join(', ')
                  : '대상자를 선택해주세요.'}
              </MainText>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Label label="심방 내용" />
            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="심방 내용을 입력해주세요."
              placeholderTextColor={GRAY.DEFAULT}
              value={content}
              onChangeText={setContent}
              multiline
            />
          </View>

          <View style={styles.field}>
            <Label label="기도 제목" />
            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="기도 제목을 입력해주세요."
              placeholderTextColor={GRAY.DEFAULT}
              value={pray}
              onChangeText={setPray}
              multiline
            />
          </View>
        </ScrollView>

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

      <MemberPicker
        visible={inChargePickerVisible}
        churchId={churchId}
        mode="single"
        initialSelected={inCharge ? [inCharge] : []}
        onClose={() => setInChargePickerVisible(false)}
        onConfirm={picked => setInCharge(picked[0] ?? null)}
      />

      <MemberPicker
        visible={memberPickerVisible}
        churchId={churchId}
        mode="multi"
        initialSelected={visitedMembers}
        onClose={() => setMemberPickerVisible(false)}
        onConfirm={setVisitedMembers}
      />
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
  dateRow: {flexDirection: 'row', gap: 8},
  input: {
    borderWidth: 1,
    borderColor: GRAY.LIGHT,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: GRAY.EXTRA_DARK,
  },
  multiline: {minHeight: 80, textAlignVertical: 'top'},
  pickerButton: {
    borderWidth: 1,
    borderColor: GRAY.LIGHT,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: GRAY.LIGHT,
  },
});

export default VisitationAdd;
