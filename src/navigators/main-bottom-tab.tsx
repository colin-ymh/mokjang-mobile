import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  MAIN_BOTTOM_TAB,
  MainBottomTabParams,
} from '../constants/navigator/navigator';
import MemberScreen from '../screens/main-bottom-tab/member-screen';
import HomeScreen from '../screens/main-bottom-tab/home-screen';
import VisitationScreen from '../screens/main-bottom-tab/visitation-screen';
import EducationScreen from '../screens/main-bottom-tab/education-screen';
import TaskScreen from '../screens/main-bottom-tab/task-screen';
import CalendarScreen from '../screens/main-bottom-tab/calendar-screen';

const Tab = createBottomTabNavigator<MainBottomTabParams>();

type MainBottomTabProps = {};

const MainBottomTab = ({}: MainBottomTabProps) => {
  return (
    <Tab.Navigator
      initialRouteName={MAIN_BOTTOM_TAB.MEMBER.NAME}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name={MAIN_BOTTOM_TAB.HOME.NAME} component={HomeScreen} />
      <Tab.Screen name={MAIN_BOTTOM_TAB.MEMBER.NAME} component={MemberScreen} />
      <Tab.Screen
        name={MAIN_BOTTOM_TAB.VISITATION.NAME}
        component={VisitationScreen}
      />
      <Tab.Screen
        name={MAIN_BOTTOM_TAB.EDUCATION.NAME}
        component={EducationScreen}
      />
      <Tab.Screen name={MAIN_BOTTOM_TAB.TASK.NAME} component={TaskScreen} />
      <Tab.Screen
        name={MAIN_BOTTOM_TAB.CALENDAR.NAME}
        component={CalendarScreen}
      />
    </Tab.Navigator>
  );
};

export default MainBottomTab;
