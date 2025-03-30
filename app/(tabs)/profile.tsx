import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { sampleUser, sampleBadges, sampleLists } from '../../data/sampleProfileData';

export default function ProfileScreen() {
  const { name, avatar, totalVisits, reviewsWritten, badgesEarned } = sampleUser;

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* User Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalVisits}</Text>
          <Text style={styles.statLabel}>Clubs Visited</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{reviewsWritten}</Text>
          <Text style={styles.statLabel}>Reviews Written</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{badgesEarned}</Text>
          <Text style={styles.statLabel}>Badges Earned</Text>
        </View>
      </View>

      {/* Badges Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sampleBadges.map((badge) => (
            <View key={badge.id} style={styles.badge}>
              <Image source={{ uri: badge.image }} style={styles.badgeImage} />
              <Text style={styles.badgeName}>{badge.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Lists Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Lists</Text>
        {sampleLists.length > 0 ? (
          sampleLists.map((list) => (
            <View key={list.id} style={styles.listItem}>
              <Text style={styles.listName}>{list.name}</Text>
              <Text style={styles.listCount}>{list.clubs.length} clubs</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>You haven't created any lists yet.</Text>
        )}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Create New List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#f1f3f5',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  badge: {
    alignItems: 'center',
    marginRight: 15,
  },
  badgeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  badgeName: {
    fontSize: 12,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  listName: {
    fontSize: 14,
  },
  listCount: {
    fontSize: 12,
    color: '#6c757d',
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginVertical: 10,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
