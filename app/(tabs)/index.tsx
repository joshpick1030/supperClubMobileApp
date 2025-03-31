import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router';
import HeaderBar from '@/components/HeaderBar';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; // Use Expo Vector Icons
import { sampleUser, sampleBadges, sampleStatuses, sampleLists, sampleReviews } from '../../data/sampleProfileData';

const screenWidth = Dimensions.get('window').width;

interface BadgeCardProps {
  label: string;
  progress: string;
  achieved?: boolean;
}

function CustomHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Midwest Supper Roadmap</Text>
      <View style={styles.headerRight}>
        <FontAwesome name="bell" size={18} color="#5A2E1E" style={styles.headerIcon} />
        <FontAwesome name="user-circle-o" size={24} color="#5A2E1E" />
      </View>
    </View>
  );
}

export default function Home() {

  const { name, avatar, totalVisits, reviewsWritten, badgesEarned, joinDate, location } = sampleUser;
  const handleFacebookShare = () => {
    // Future: Integrate Share API or deep link
    console.log('Sharing on Facebook...');
  };

  return (

    <View style={styles.screen}>
      <HeaderBar />
      <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80' }}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.headercontent}>
            <Text style={styles.title}>Welcome to Supper Club</Text>
            <Text style={styles.subtitle}>Discover the best dining experiences</Text>
          </View>

        <ScrollView >

        {/* Hero Section */}
          <View style={styles.headercontent}>
            <Text style={styles.tagline}>
              Savor the Midwest, One Supper Club at a Time
            </Text>
          </View>
          {/* CTA Buttons */}
          <View style={styles.ctaContainer}>

            <Link href="/map" asChild>
              <TouchableOpacity style={styles.discoverButton}>
                <FontAwesome5 name="compass" size={20} color="#000" />
                <Text style={styles.discoverButtonText}>Discover</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/leaderboard" asChild>
              <TouchableOpacity style={styles.leaderboardButton}>
                <FontAwesome5 name="trophy" size={15} color="#000" style={styles.icon} />
                <Text style={styles.leaderboardButtonText}>Leaderboard</Text>
              </TouchableOpacity>
            </Link>
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

          {/* Nearby Clubs */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Nearby Clubs</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.nearbyClubsContainer}>
              {[
                { name: 'The Supper Club', city: 'Wausau', miles: 26 },
                { name: 'Northwoods Dining', city: 'Minocqua', miles: 56 },
                { name: 'Lakeside Supper', city: 'Madison', miles: 65 },
                { name: 'Dutch Mill', city: 'Kenosha', miles: 97 },
                { name: 'The Pines Resort', city: 'Mercer', miles: 75 },
              ].map((club, i) => (
                <View key={i} style={styles.clubCard}>
                  <View style={styles.clubImagePlaceholder} />
                  <View style={styles.clubInfo}>
                    <Text style={styles.clubName}>{club.name}</Text>
                    <Text style={styles.clubDetails}>{club.city} • {club.miles} miles away</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Status & Journey Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <View style={styles.badgeBox}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.badgesContainer}>
                  <BadgeCard label="Supper Club Newbie" progress="1/1" achieved />
                  <BadgeCard label="Experienced Foodie" progress="1/5" />
                  <BadgeCard label="Midwest Master" progress="1/10" />
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.shareButton} onPress={handleFacebookShare}>
                <FontAwesome name="facebook" size={18} color="#1877F2" style={{ marginRight: 6 }} />
                <Text style={styles.shareButtonText}>Share on Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Your Supper Club Journey</Text>
          <View style={styles.journeyBox}>
            <Text style={styles.journeyText}>Interactive map of your supper club visits coming soon!</Text>
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Explore Supper Clubs</Text>
            </TouchableOpacity>
          </View>

          {/* About Supper Clubs */}
          <Text style={styles.sectionTitle}>About Supper Clubs</Text>
          <View style={styles.aboutBox}>
            <Text style={styles.aboutHeading}>What is a Supper Club?</Text>
            <Text style={styles.aboutText}>
              Supper clubs are traditional dining establishments found primarily in the Upper Midwestern states.
              They offer a relaxed, homey atmosphere with classic American cuisine like prime rib, fish fry, and cocktails.
            </Text>
            <Text style={styles.aboutHeading}>Supper Club Etiquette</Text>
            <Text style={styles.aboutText}>
              Order a brandy old-fashioned before dinner, take your time, and don't rush the experience. Many clubs have a relaxed dress code, but some may request business casual attire.
            </Text>
            <Pressable style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </Pressable>
          </View>
        
        
      </ScrollView>
      </ImageBackground>
    </View>
    
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function BadgeCard({ label, progress, achieved = false }: BadgeCardProps) {
  return (
    <View style={styles.badgeCard}>
      <View style={[styles.badgeIcon, achieved ? styles.badgeAchieved : styles.badgePending]} />
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text style={styles.badgeProgress}>{progress} visits</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9F6F2',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 24,
    marginBottom: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },  
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5A2E1E',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    marginRight: 12,
  },
  
  heroSection: {
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
  heroTextContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    margin: 16,
    fontWeight: 'bold',
    color: '#1F2937', // Navy-like color
    textAlign: 'center',
    backdropFilter: 'blur(10px)', // Optional blur effect
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  tagline: {
    textAlign: 'center',
    fontSize: 21,
    color: '#1D3557',
    marginBottom: 16,
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  discoverButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 8,
    width: 170,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoverButtonText: {
    color: '#000',
    fontWeight: '600',
    marginLeft: 8,
  },
  leaderboardButton: {
    borderColor: '#F59E0B',
    backgroundColor: '#F59E0B',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 170,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardButtonText: {
    color: '#000',
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    color: '#F59E0B',
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  nearbyClubsContainer: {
    paddingBottom: 16,
    marginBottom: 24,
  },
  clubCard: {
    width: 192,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  clubImagePlaceholder: {
    width: '100%',
    height: 112,
    backgroundColor: '#E5E7EB',
  },
  clubInfo: {
    padding: 8,
  },
  clubName: {
    fontSize: 14,
    fontWeight: '600',
  },
  clubDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  badgeBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    alignItems: 'flex-start',
  },
  badgesContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  badgeCard: {
    width: 112,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    marginRight: 12,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 9999,
  },
  badgeAchieved: {
    backgroundColor: '#F59E0B',
  },
  badgePending: {
    backgroundColor: '#D1D5DB',
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  badgeProgress: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statusBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  statusButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  journeyBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    alignItems: 'center',
  },
  journeyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  exploreButton: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  aboutBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 48,
    elevation: 2,
  },
  aboutHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  learnMoreButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  shareButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  shareButtonText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional overlay for better text contrast
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
    backdropFilter: 'blur(10px)', // Optional blur effect
  },
  headercontent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    margin: 16,
    fontWeight: 'bold',
    color: '#1F2937', // Navy-like color
    textAlign: 'center',
    backdropFilter: 'blur(10px)', // Optional blur effect
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF', // White card background
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    marginLeft: 20,
    marginRight: 20,
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
});
