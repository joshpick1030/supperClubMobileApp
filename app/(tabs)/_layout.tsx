// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#b45309',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap
        
          switch (route.name) {
            case 'index':
              iconName = focused ? 'home' : 'home-outline'
              break
            case 'events':
              iconName = focused ? 'calendar' : 'calendar-outline'
              break
            case 'map':
              iconName = focused ? 'map' : 'map-outline'
              break
            case 'leaderboard':
              iconName = focused ? 'trophy' : 'trophy-outline'
              break
            case 'profile':
              iconName = focused ? 'person' : 'person-outline'
              break
            default:
              iconName = 'ellipse-outline'
          }
        
          return <Ionicons name={iconName} size={focused ? 26 : 22} color={color} />
        }
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="events" options={{ title: 'Events' }} />
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Leaderboard' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}
