import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false ,title:'index'}} />
      <Stack.Screen name="login" options={{headerShown: false, title: 'Login' }} />
      <Stack.Screen name="signup" options={{headerShown:false, title: 'Sign Up' }} />
      <Stack.Screen name="confirmation" options={{ headerShown:false, title: 'OTP Verification' }} />
    </Stack>
  );
}
