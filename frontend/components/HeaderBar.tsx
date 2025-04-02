// components/HeaderBar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function HeaderBar() {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>Midwest Supper Roadmap</Text>
      <View style={styles.rightSection}>
        <FontAwesome name="bell" size={18} color="#6B7280" style={styles.icon} />
        <TouchableOpacity style={styles.profileButton}>
          <FontAwesome name="user" size={16} color="#1F2937" />
          <Text style={styles.username}>thanzirhussain9</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F6',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    zIndex: 100,
  },
  logo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B3B2A',
    fontFamily: 'serif',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F6',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  username: {
    marginLeft: 6,
    fontSize: 12,
    color: '#6B3B2A',
    fontWeight: '500',
  },
});
