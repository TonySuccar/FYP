import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '@/components/CustomHeader';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -4 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        headerShown: false,
        header: () => <CustomHeader />,
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: 'Home',
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarAccessibilityLabel: 'Home',
        }}
      />

      {/* Generate Outfit Tab */}
      <Tabs.Screen
        name="generate"
        options={{
          headerShown: true,
          title: '',
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="magic" color={color} />,
          tabBarAccessibilityLabel: 'Generate',
        }}
      />

      {/* Browse Collection Tab */}
      <Tabs.Screen
        name="browse"
        options={{
          headerShown: true,
          title: 'Browse',
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="th-large" color={color} />,
          tabBarAccessibilityLabel: 'Browse Collection',
        }}
      />
      {/* Settings Tab */}
      <Tabs.Screen
        name="Settings"
        options={{
          headerShown: true,
          title: 'Settings',
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          tabBarAccessibilityLabel: 'Settings',
        }}
      />
    </Tabs>
  );
}
