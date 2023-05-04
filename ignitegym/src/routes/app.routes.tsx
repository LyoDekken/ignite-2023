import { Platform } from "react-native";

import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import { Box, useTheme } from "native-base";

import Home from "@screens/Home";
import History from "@screens/History";
import Profile from "@screens/Profile";
import Exercise from "@screens/Exercise";

import HomeSvg from "@assets/home.svg";
import HistorySvg from "@assets/history.svg";
import ProfileSvg from "@assets/profile.svg";

type AppRoutes = {
  home: undefined;
  profile: undefined;
  history: undefined;
  exercise: {
    id: string;
  };
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { sizes, colors } = useTheme();

  const iconSize = sizes[7];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[6],
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Box // envolve o icone para dar uma area de toque maior do que a do icone
              width={24}
              height={12}
              pt={4}
              alignContent={"center"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <HomeSvg fill={color} width={iconSize} height={iconSize} />
            </Box>
          ),
        }}
      />
      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <Box // envolve o icone para dar uma area de toque maior do que a do icone
              width={24}
              height={12}
              pt={4}
              alignContent={"center"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <HistorySvg fill={color} width={iconSize} height={iconSize} />
            </Box>
          ),
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Box // envolve o icone para dar uma area de toque maior do que a do icone
              width={24}
              height={12}
              pt={4}
              alignContent={"center"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <ProfileSvg fill={color} width={iconSize} height={iconSize} />
            </Box>
          ),
        }}
      />
      <Screen
        name="exercise"
        component={Exercise}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Navigator>
  );
}
