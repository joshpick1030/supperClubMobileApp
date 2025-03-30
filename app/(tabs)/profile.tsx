import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Modal, SafeAreaView } from 'react-native';
import BadgeCard from '../../components/BadgeCard';
import { sampleUser, sampleBadges, sampleStatuses, sampleLists, sampleReviews } from '../../data/sampleProfileData';
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderBar from '@/components/HeaderBar';

export default function ProfileScreen() {
  const { name, avatar, totalVisits, reviewsWritten, badgesEarned, joinDate, location } = sampleUser;
  const [showAllBadgesPrompt, setShowAllBadgesPrompt] = useState(false);
  const [showAllStatusesPrompt, setShowAllStatusesPrompt] = useState(false);

  const currentStatus = sampleStatuses.length > 0 ? sampleStatuses[0] : null;
  const earnedBadges = sampleBadges.filter((badge) => badge.earned);
  const totalBadges = sampleBadges.length;

  const handleShareOnFacebook = () => {
    console.log('Shared on Facebook');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <HeaderBar />
      <ScrollView style={styles.container}>
        {/* Profile Section */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.joinDate}>Joined {joinDate}</Text>
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalVisits}</Text>
              <Text style={styles.statLabel}>Clubs Visited</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{reviewsWritten}</Text>
              <Text style={styles.statLabel}>Reviews Written</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{badgesEarned}</Text>
              <Text style={styles.statLabel}>Badges Earned</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.container}>
        {/* Your Status Card */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <Text style={styles.sectionTitle}>Your Status</Text>
            <TouchableOpacity onPress={() => setShowAllStatusesPrompt(true)}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          {currentStatus && (
            <View style={styles.statusContent}>
              <View style={styles.borderedCard}>
                <Text style={styles.statusTitle}>{currentStatus.title}</Text>
                <Text style={styles.statusSubtitle}>{currentStatus.description}</Text>
                <TouchableOpacity style={styles.leaderboardButton}>
                  <Text style={styles.leaderboardButtonText}>leaderboard</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <TouchableOpacity style={styles.facebookButton} onPress={handleShareOnFacebook}>
            <Text style={styles.facebookButtonText}>
              <Icon name="facebook-f" size={14} color="#333" /> Share on Facebook
            </Text>
          </TouchableOpacity>
        </View>

        {/* "See All Statuses" Prompt */}
        <Modal visible={showAllStatusesPrompt} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Your Statuses</Text>
              <ScrollView>
                {sampleStatuses.map((status) => (
                  <View key={status.id} style={styles.statusItem}>
                    <Text style={styles.statusItemTitle}>{status.title}</Text>
                    <Text style={styles.statusItemDescription}>{status.description}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowAllStatusesPrompt(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

        {/* Your Badges Section */}
        <View style={styles.card}>
          <View style={styles.badgesHeader}>
            <Text style={styles.sectionTitle}>Your Badges</Text>
            <Text style={styles.badgeStatus}>
              {earnedBadges.length} of {totalBadges} earned
            </Text>
            <TouchableOpacity onPress={() => setShowAllBadgesPrompt(true)}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.badgesContainer}>
            {sampleBadges.slice(0, 3).map((badge) => (
              <BadgeCard
                key={badge.id}
                name={badge.name}
                image={badge.image}
                current={badge.current}
                required={badge.required}
                earned={badge.earned}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.facebookButton} onPress={handleShareOnFacebook}>
            <Text style={styles.facebookButtonText}>
              <Icon name="facebook-f" size={14} color="#333" /> Share on Facebook
            </Text>
          </TouchableOpacity>
        </View>

        {/* "See All Badges" Prompt */}
        <Modal visible={showAllBadgesPrompt} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Your Badges</Text>
              <View style={styles.badgesContainer}>
                {sampleBadges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    name={badge.name}
                    image={badge.image}
                    current={badge.current}
                    required={badge.required}
                    earned={badge.earned}
                  />
                ))}
              </View>
              <TouchableOpacity onPress={() => setShowAllBadgesPrompt(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Your Reviews Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Reviews</Text>
          {sampleReviews.length > 0 ? (
            sampleReviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <Text style={styles.reviewClub}>{review.club}</Text>
                <Text style={styles.reviewText}>{review.text}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>You haven't written any reviews yet.</Text>
          )}
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add a Review</Text>
          </TouchableOpacity>
        </View>

        {/* Your Lists Section */}
        <View style={styles.card}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EDE4', // Skin-colored background
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF', // White card background
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    alignItems: 'center',
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
  joinDate: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9FAFB', // Light gray background for individual cards
    borderRadius: 10,
    paddingVertical: 20,
    marginHorizontal: 5,
    elevation: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937', // Dark text color
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280', // Muted text color
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007bff',
  },
  statusContent: {
    marginBottom: 10,
    alignItems: 'center',
    padding: 10,
    borderColor: '#c60',
    borderWidth: .8,
    marginTop: 10,
    borderRadius: 10,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 10,
    marginBottom: 5,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  leaderboardButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginBottom: 10,
  },
  leaderboardButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  facebookButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#e9ecef',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#ced4da',
    marginTop: 10,
  },
  facebookButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF', // White background for the modal
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Shadow for the modal
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937', // Dark text color
    marginBottom: 20,
  },
  closeText: {
    fontSize: 14,
    color: '#007bff', // Blue color for the close button
    marginTop: 20,
    fontWeight: 'bold',
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reviewItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 5,
  },
  reviewClub: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 12,
    color: '#6c757d',
    marginVertical: 5,
  },
  reviewDate: {
    fontSize: 10,
    color: '#adb5bd',
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
  statusItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 5,
  },
  statusItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusItemDescription: {
    fontSize: 12,
    color: '#6c757d',
    marginVertical: 5,
  },
});
