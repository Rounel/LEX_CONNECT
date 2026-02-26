import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppHeader } from '@/components/app-header';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
        header: ({ options }) => <AppHeader title={options.title ?? ''} />,
      }}>
      <Tabs.Screen
        name="bibliotheque"
        options={{
          title: 'Bibliothèque',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="building.columns.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Actualités',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="newspaper.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="alexia"
        options={{
          title: 'Alexia',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="sparkles" color={color} />,
        }}
      />
      <Tabs.Screen
        name="concours"
        options={{
          title: 'Concours',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="competition.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen name="favorites" options={{ href: null }} />
      <Tabs.Screen name="preparation" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
