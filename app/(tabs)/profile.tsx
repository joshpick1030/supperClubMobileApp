import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ImageBackground, Modal, SafeAreaView } from 'react-native';
import BadgeCard from '../../components/BadgeCard';
import { sampleUser, sampleBadges, sampleStatuses, sampleLists, sampleReviews } from '../../data/sampleProfileData';
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderBar from '@/components/HeaderBar';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; // Use Expo Vector Icons
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { name, avatar, totalVisits, reviewsWritten, badgesEarned, joinDate, location } = sampleUser;
  const navigation = useNavigation();
  const [showAllBadgesPrompt, setShowAllBadgesPrompt] = useState(false);
  const [showAllStatusesPrompt, setShowAllStatusesPrompt] = useState(false);

  const currentStatus = sampleStatuses.length > 0 ? sampleStatuses[0] : null;
  const earnedBadges = sampleBadges.filter((badge) => badge.earned);
  const totalBadges = sampleBadges.length;

  const handleShareOnFacebook = () => {
    console.log('Shared on Facebook');
  };

  const handleLeaderboardNavigation = () => {
    navigation.navigate('leaderboard');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5EDE4' }}>
      <HeaderBar />    
      <ScrollView>
        {/* Profile Section */}
        <View style={styles.card}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07' }}
            style={styles.headerBackground}
            resizeMode="cover"
          >
            <View style={styles.overlay} />
          </ImageBackground>
          <View style={styles.header}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text style={styles.name}>{name}</Text>
            <View style={{flexDirection: 'row', marginHorizontal: 10, marginTop: 5}}>
              <FontAwesome name="calendar" size={16} color="#6B7280" style={styles.icon} />
              <Text style={styles.joinDate}>Joined {joinDate}</Text>
              <FontAwesome name="map-marker" size={16} color="#6B7280" style={styles.icon} />
              <Text style={styles.location}>{location}</Text>
            </View>
          </View>
        </View>
        
        {/* Statistics Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <FontAwesome5 name="compass" size={20} color="#cc6600" />
              <Text style={styles.statValue}>{totalVisits}</Text>
              <Text style={styles.statLabel}>Clubs Visited</Text>
            </View>
            <View style={styles.statCard}>
              <FontAwesome5 name="star" size={20} color="#cc6600" /> 
              <Text style={styles.statValue}>{reviewsWritten}</Text>
              <Text style={styles.statLabel}>Reviews Written</Text>
            </View>
            <View style={styles.statCard}>
              <FontAwesome5 name="map-marker-alt" size={20} color="#cc6600" />
              <Text style={styles.statValue}>{badgesEarned}</Text>
              <Text style={styles.statLabel}>Badges Earned</Text>
            </View>
          </View>
        </View>

        {/* Your Status Card */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="award" size={25} color="#cc6600" style={styles.icon} />
              <Text style={styles.sectionTitle}>Your Status</Text>
            </View>
            <TouchableOpacity onPress={() => setShowAllStatusesPrompt(true)}>
              <Text style={styles.seeAllText}>See all  &gt;</Text>
            </TouchableOpacity>
          </View>
          {currentStatus && (
            <View style={styles.statusContent}>
              <View style={{alignItems: 'center' }}>
                <FontAwesome5 name="award" size={25} color="#cc6600" style={styles.icon} />
                <Text style={styles.statusTitle}>{currentStatus.title}</Text>
                <Text style={styles.statusSubtitle}>{currentStatus.description}</Text>
                <TouchableOpacity style={styles.leaderboardButton}>
                  <Text style={styles.leaderboardButtonText} onPress={handleLeaderboardNavigation} >leaderboard</Text>
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

        {/* Your Badges Section */}
        <View style={styles.card}>
          <View style={styles.badgesHeader}>
            <Text style={styles.sectionTitle}>Your Badges</Text>
            <Text style={styles.badgeStatus}>
              {earnedBadges.length} of {totalBadges} earned
            </Text>
            <TouchableOpacity onPress={() => setShowAllBadgesPrompt(true)}>
              <Text style={styles.seeAllText}>See all  &gt;</Text>
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
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add a Review</Text>
          </TouchableOpacity>
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
  
  card: {
    backgroundColor: '#FFFFFF', // White card background
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: -80,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderColor: '#fff',
    borderWidth: 5,
  },
  name: {
    fontSize: 23,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10,
    fontFamily: 'serif',
    alignSelf: 'flex-start',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  seeAllText: {
    fontSize: 15,
    fontFamily: 'serif',
    color: '#cc6600',
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
    fontFamily: 'serif',
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
    fontFamily: 'serif',
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
    fontFamily: 'serif',
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
    fontFamily: 'serif',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#eee',
    paddingVertical: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    borderWidth: 0.1,
    marginBottom: 10,
    marginLeft: 2,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'serif',
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
    fontFamily: 'serif',
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
    fontFamily: 'serif',
  },
  statusItemDescription: {
    fontSize: 12,
    color: '#6c757d',
    marginVertical: 5,
    fontFamily: 'serif',
  },
  icon: {
    marginRight: 8,
    marginLeft: 15,
    marginTop: 3,
  },
  headerBackground: {
    height: 150, // Adjust height as needed
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional dark overlay for better text contrast
  },
});
