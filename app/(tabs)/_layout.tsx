import { Tabs } from 'expo-router';

import { AnimatedTabBar } from '@/components/animated/AnimatedTabBar';
import { COLORS } from '@/constants/Colors';
import { TabBarVisibilityProvider } from '@/Context/TabBarVisibilityContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <TabBarVisibilityProvider>
      <Tabs
        tabBar={(props) => <AnimatedTabBar {...props} />}
        screenOptions={({ route }) => ({
          lazy: true,
          headerShown: false,
          animationEnabled: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray500,
          tabBarStyle: { backgroundColor: COLORS.white },
          unmountOnBlur: true,
          tabBarLabelStyle: { fontSize: 13, fontWeight: '500' },
        })}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Trang chủ',
            lazy: true,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="(store)"
          options={{
            title: 'Cửa hàng',
            lazy: true,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'storefront-sharp' : 'storefront-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: 'Hồ sơ',
            lazy: true,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />
            ),
          }}
        />
      </Tabs>
    </TabBarVisibilityProvider>
  );
}
