import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../redux/store';
import {WorshipSessionsApi} from '../../../api/worship/worship-sessions.api';
import {WorshipAttendancesApi} from '../../../api/worship/worship-attendances.api';
import {WorshipAttendance} from '../../../models/worship/worship';
import {MainText} from '../../atoms/common/text/main-text';
import Button from '../../atoms/common/button/button';
import DateField from '../../atoms/common/date-field/date-field';
import {GRAY, MAIN, WHITE} from '../../../constants/style/color';
import {
  attendanceStatusColor,
  attendanceStatusLabel,
} from '../../../constants/worship';
import {
  ATTENDANCE_STACK,
  AttendanceStackParams,
} from '../../../constants/navigator/navigator';
import {showErrorAlert} from '../../../utils/error-handler';

const STATUSES: Array<'unknown' | 'present' | 'absent'> = [
  'unknown',
  'present',
  'absent',
];

const toDateOnlyString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const RosterScreen = () => {
  const navigation = useNavigation();
  const route =
    useRoute<
      RouteProp<AttendanceStackParams, typeof ATTENDANCE_STACK.ROSTER.NAME>
    >();
  const {worshipId, worshipTitle} = route.params;

  const sessionsApi = useMemo(() => new WorshipSessionsApi(), []);
  const attendancesApi = useMemo(() => new WorshipAttendancesApi(), []);
  const churchId = useSelector(
    (state: RootState) => state.user.user.churchUser?.[0]?.churchId,
  );

  const [sessionDate, setSessionDate] = useState(new Date());
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [attendances, setAttendances] = useState<WorshipAttendance[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadAttendances = useCallback(
    async (targetSessionId: string, opts: {reset?: boolean} = {}) => {
      if (!churchId || loading) return;
      const {reset = false} = opts;
      const nextCursor = reset ? undefined : cursor;
      if (!reset && !hasMore) return;

      setLoading(true);
      try {
        const res = await attendancesApi.getWorshipAttendances({
          churchId,
          worshipId,
          sessionId: targetSessionId,
          cursor: nextCursor,
        });
        const data: WorshipAttendance[] = res.data.data ?? [];
        setAttendances(prev => (reset ? data : [...prev, ...data]));
        setCursor(res.data.nextCursor ?? undefined);
        setHasMore(Boolean(res.data.hasMore));
      } catch (e) {
        showErrorAlert(e);
      } finally {
        setLoading(false);
      }
    },
    [attendancesApi, churchId, cursor, hasMore, loading, worshipId],
  );

  const loadSession = useCallback(
    async (date: Date) => {
      if (!churchId) return;
      setSessionLoading(true);
      setAttendances([]);
      setCursor(undefined);
      setHasMore(false);
      try {
        const res = await sessionsApi.getWorshipSessionByDate({
          churchId,
          worshipId,
          sessionDate: toDateOnlyString(date),
        });
        const session = res.data?.data ?? res.data;
        setSessionId(session.id);
        await loadAttendances(session.id, {reset: true});
      } catch (e) {
        showErrorAlert(e);
      } finally {
        setSessionLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [churchId, sessionsApi, worshipId],
  );

  useEffect(() => {
    loadSession(sessionDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [churchId, sessionDate.getTime()]);

  const onChangeStatus = async (
    attendance: WorshipAttendance,
    status: 'unknown' | 'present' | 'absent',
  ) => {
    if (!churchId || !sessionId) return;
    const prevStatus = attendance.attendanceStatus;
    setAttendances(prev =>
      prev.map(a =>
        a.id === attendance.id ? {...a, attendanceStatus: status} : a,
      ),
    );
    try {
      await attendancesApi.editWorshipAttendance({
        churchId,
        worshipId,
        sessionId,
        attendanceId: attendance.id,
        body: {attendanceStatus: status},
      });
    } catch (e) {
      setAttendances(prev =>
        prev.map(a =>
          a.id === attendance.id ? {...a, attendanceStatus: prevStatus} : a,
        ),
      );
      showErrorAlert(e);
    }
  };

  const onChangeNote = (attendanceId: string, note: string) => {
    setAttendances(prev =>
      prev.map(a => (a.id === attendanceId ? {...a, note} : a)),
    );
  };

  const onSaveNote = async (attendance: WorshipAttendance) => {
    if (!churchId || !sessionId) return;
    try {
      await attendancesApi.editWorshipAttendance({
        churchId,
        worshipId,
        sessionId,
        attendanceId: attendance.id,
        body: {note: attendance.note ?? ''},
      });
    } catch (e) {
      showErrorAlert(e);
    }
  };

  const onPressAllAttended = () => {
    if (!churchId || !sessionId) return;
    Alert.alert(
      '전원 출석 처리',
      '이 세션의 모든 대상자를 출석으로 표시할까요?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '확인',
          onPress: async () => {
            try {
              await attendancesApi.patchAllAttended({
                churchId,
                worshipId,
                sessionId,
              });
              await loadAttendances(sessionId, {reset: true});
            } catch (e) {
              showErrorAlert(e);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <MainText fontSize={16} color={GRAY.SEMI_DARK}>
            목록
          </MainText>
        </Pressable>
        <MainText fontSize={17} fontWeight={700} color={GRAY.EXTRA_DARK}>
          {worshipTitle}
        </MainText>
        <View style={{width: 40}} />
      </View>

      <View style={styles.dateRow}>
        <MainText fontSize={13} color={GRAY.SEMI_DARK}>
          세션 날짜
        </MainText>
        <DateField value={sessionDate} mode="date" onChange={setSessionDate} />
      </View>

      {sessionLoading ? (
        <ActivityIndicator style={styles.loading} color={MAIN.DEFAULT} />
      ) : (
        <FlatList
          data={attendances}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            const member = item.worshipEnrollment?.member;
            return (
              <View style={styles.row}>
                <View style={styles.rowTop}>
                  <MainText
                    fontSize={15}
                    fontWeight={600}
                    color={GRAY.EXTRA_DARK}>
                    {member?.name ?? '-'}
                  </MainText>
                  <View style={styles.chipRow}>
                    {STATUSES.map(status => {
                      const active = item.attendanceStatus === status;
                      const sc = attendanceStatusColor(status);
                      return (
                        <Pressable
                          key={status}
                          style={[
                            styles.chip,
                            active && {backgroundColor: sc.bg},
                          ]}
                          onPress={() => onChangeStatus(item, status)}>
                          <MainText
                            fontSize={12}
                            fontWeight={active ? 700 : 400}
                            color={active ? sc.text : GRAY.SEMI_DARK}>
                            {attendanceStatusLabel(status)}
                          </MainText>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
                <TextInput
                  style={styles.noteInput}
                  placeholder="메모 (선택)"
                  placeholderTextColor={GRAY.DEFAULT}
                  value={item.note ?? ''}
                  onChangeText={text => onChangeNote(item.id, text)}
                  onEndEditing={() => onSaveNote(item)}
                />
              </View>
            );
          }}
          onEndReachedThreshold={0.4}
          onEndReached={() => sessionId && loadAttendances(sessionId)}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.empty}>
                <MainText color={GRAY.DEFAULT}>대상자가 없습니다.</MainText>
              </View>
            ) : null
          }
          ListFooterComponent={
            loading ? (
              <ActivityIndicator style={styles.footer} color={MAIN.DEFAULT} />
            ) : null
          }
        />
      )}

      <View style={styles.bottomBar}>
        <Button
          text="모두 출석 표시"
          width={'auto'}
          height={44}
          onPress={onPressAllAttended}
        />
      </View>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.LIGHT,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loading: {marginTop: 60},
  row: {
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.LIGHT,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chipRow: {flexDirection: 'row', gap: 6},
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: GRAY.BACKGROUND,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: GRAY.LIGHT,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: GRAY.EXTRA_DARK,
  },
  empty: {alignItems: 'center', paddingTop: 60},
  footer: {paddingVertical: 20},
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: GRAY.LIGHT,
  },
});

export default RosterScreen;
