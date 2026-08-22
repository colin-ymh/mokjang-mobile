import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  ATTENDANCE_STACK,
  AttendanceStackParams,
} from '../constants/navigator/navigator';
import WorshipList from '../components/organisms/worship-screen/worship-list';
import RosterScreen from '../components/organisms/worship-screen/roster-screen';

const Stack = createNativeStackNavigator<AttendanceStackParams>();

// 출석 탭 전용 스택: 예배 목록 -> 출석 체크(로스터). worshipId/sessionDate는 route params로 전달.
const AttendanceStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ATTENDANCE_STACK.WORSHIP_LIST.NAME}
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={ATTENDANCE_STACK.WORSHIP_LIST.NAME}
        component={WorshipList}
      />
      <Stack.Screen
        name={ATTENDANCE_STACK.ROSTER.NAME}
        component={RosterScreen}
      />
    </Stack.Navigator>
  );
};

export default AttendanceStack;
