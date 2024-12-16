import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="home_screen" options={{ title: 'Список товаров' }} />
      <Stack.Screen name="cart" options={{ title: 'Корзина' }} />
    </Stack>
  );
}