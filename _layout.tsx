import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      placeholderData: (prev: unknown) => prev,
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#F8F5F2' },
            headerTintColor: '#2C2C2C',
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: '#F8F5F2' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Valid', headerShown: false }} />
          <Stack.Screen name="find-help" options={{ title: 'Find Help Nearby' }} />
          <Stack.Screen name="facility/[id]" options={{ title: 'Facility' }} />
          <Stack.Screen name="book/[professionalId]" options={{ title: 'Book Appointment' }} />
          <Stack.Screen name="booking-success" options={{ title: 'Booking Confirmed', headerBackVisible: false }} />
          <Stack.Screen name="reflect" options={{ title: 'Reflect' }} />
          <Stack.Screen name="facility-register" options={{ title: 'Register Facility' }} />
          <Stack.Screen name="auth" options={{ title: 'Sign in', presentation: 'modal' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          <Stack.Screen name="crisis" options={{ title: 'Immediate Help', presentation: 'modal' }} />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
