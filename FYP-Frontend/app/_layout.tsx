import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.log('Error checking token:', error);
        setIsAuthenticated(false);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    checkToken();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <Stack initialRouteName={isAuthenticated ? '(tabs)' : '(auth)'}>
      {/* Always declare screens statically */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="ClothingDetail" options={{ title: 'Clothing Details' }} />
      {/* <Stack.Screen name="Settings" options={{ title: 'Settings' }} /> */}
      <Stack.Screen name="ChangePassword" options={{ title: 'ChangePassword' }} />
    </Stack>
  );
}
