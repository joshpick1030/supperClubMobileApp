import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Dimensions,
  StyleSheet, FlatList, Image, SafeAreaView
} from 'react-native';
import HeaderBar from '@/components/HeaderBar';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const mockData = {
  overall: [
    { name: 'Michael Johnson', visits: 8, role: 'Midwest Supper Club Champion', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Sarah Williams', visits: 6, role: 'Master of the Midwest Dining', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Jennifer Smith', visits: 2, role: 'Supper Club Virtuoso', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', currentUser: true },
    { name: 'Sarah Williams', visits: 5, role: 'Master of the Midwest Dining', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Jennifer Smith', visits: 4, role: 'Supper Club Virtuoso', avatar: 'https://randomuser.me/api/portraits/women/3.jpg'},
  ],
  state: [
    { name: 'Michael Johnson', visits: 8, role: 'Midwest Supper Club Champion', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Sarah Williams', visits: 6, role: 'Master of the Midwest Dining', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Jennifer Smith', visits: 2, role: 'Supper Club Virtuoso', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', currentUser: true },
    { name: 'Sarah Williams', visits: 5, role: 'Master of the Midwest Dining', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    ], // Same structure
  city: [
    { name: 'Michael Johnson', visits: 8, role: 'Midwest Supper Club Champion', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Sarah Williams', visits: 6, role: 'Master of the Midwest Dining', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Jennifer Smith', visits: 2, role: 'Supper Club Virtuoso', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', currentUser: true },
    { name: 'Sarah Williams', visits: 5, role: 'Master of the Midwest Dining', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Jennifer Smith', visits: 4, role: 'Supper Club Virtuoso', avatar: 'https://randomuser.me/api/portraits/women/3.jpg'}
    ],  // Same structure
};

export default function LeaderboardScreen() {
  const [selectedTab, setSelectedTab] = useState<'overall' | 'state' | 'city'>('overall');
  const data = mockData[selectedTab];

  const renderItem = ({ item, index }: any) => {
    const isCurrent = item.currentUser;
    return (
      <View style={[styles.card, isCurrent && styles.currentUserCard]}>
        <Text style={styles.rank}>#{index + 1}</Text>
        <Image source={{ uri: item.avatar }} style={styles.cardAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name} {isCurrent && <Text style={styles.you}>(you)</Text>}</Text>
          <Text style={styles.role}>{item.role}</Text>
          <Text style={styles.visits}>Visited {item.visits} clubs</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileBtnText}>View Profile ↗</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [50, 10, 40, 95, 85],
      },
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>
          See how you stack up against other food explorers in the Midwest, your state, and your city
        </Text>

        {/* Tabs */}
        <View style={styles.card}>
          {['overall', 'state', 'city'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab as any)}
              style={[styles.tabButton, selectedTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bar Chart */}
        <BarChart
          data={chartData}
          width={screenWidth - 32} // Adjust width as needed
          height={220}
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />

        {/* Leaderboard List */}
        <Text style={styles.listTitle}>{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Leaderboard</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, i) => `${item.name}-${i}`}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    paddingBottom: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#FFF',
    borderBottomColor: '#C2410C',
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    fontWeight: '600',
    color: '#000',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1F2937',
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
    elevation: 2,
  },
  currentUserCard: {
    backgroundColor: '#EEF6FF',
  },
  rank: {
    fontSize: 18,
    fontWeight: '700',
    color: '#C2410C',
    width: 32,
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  you: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  role: {
    fontSize: 12,
    color: '#FB923C',
  },
  visits: {
    fontSize: 12,
    color: '#6B7280',
  },
  profileBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
  },
  profileBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
  },
});
