import { THEME } from "app/constants";
import { Tabs } from "expo-router";
import { setStatusBarBackgroundColor, setStatusBarStyle } from "expo-status-bar";
import React, { useEffect } from "react";
import { Appbar, Icon } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_TITLES: Record<string, string> = { index: "Lista zakupów", receipt: "Paragon" };

const TAB_BAR_HEIGHT = 60;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setStatusBarBackgroundColor("#36302c", false);
    setStatusBarStyle("light");
  }, []);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        header: () => (
          <Appbar.Header>
            <Appbar.Content title={SCREEN_TITLES[route.name] ?? route.name} />
          </Appbar.Header>
        ),
        tabBarStyle: {
          backgroundColor: THEME.shoppingList.backgroundColor,
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(255,255,255,0.6)",
        tabBarLabelStyle: { fontSize: 12 }
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Lista zakupów",
          tabBarIcon: ({ color, size }) => <Icon source="home" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="receipt"
        options={{
          title: "Paragon",
          tabBarIcon: ({ color, size }) => <Icon source="cart-check" color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
