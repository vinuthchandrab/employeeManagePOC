import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../contexts/AuthContext";
import { EmployeeProvider } from "../contexts/EmployeeContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <EmployeeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="employee-details" />
            <Stack.Screen name="add-employee" />
          </Stack>
        </EmployeeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
