import React, { useEffect, useState } from 'react';
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
import { Link, useFocusEffect, useRouter  } from 'expo-router';
import HeaderBar from '@/components/HeaderBar';
import BadgeCard from '../../components/BadgeCard';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; 
import { sampleUser, sampleBadges, sampleStatuses, sampleLists, sampleReviews } from '../../data/sampleProfileData';

const screenWidth = Dimensions.get('window').width;

interface BadgeCardProps {
  label: string;
  progress: string;
  achieved?: boolean;
}

const midwestStates = [
  {
    name: 'Wisconsin',
    cities: [
      { name: 'Madison', lat: 43.0731, lng: -89.4012 },
      { name: 'Milwaukee', lat: 43.0389, lng: -87.9065 },
    ],
  },
  {
    name: 'Illinois',
    cities: [
      { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
      { name: 'Peoria', lat: 40.6936, lng: -89.5889 },
    ],
  },
  // Add more states
];

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
  
  const router = useRouter();

  const { name, avatar, totalVisits, reviewsWritten, badgesEarned, joinDate, location } = sampleUser;
  const handleFacebookShare = () => {
    // Future: Integrate Share API or deep link
    console.log('Sharing on Facebook...');
  };

  const [discoverVisible, setDiscoverVisible] = useState(false); // show/hide layered map UI
  const [currentStep, setCurrentStep] = useState<'midwest' | 'state' | 'city' | null>('midwest');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);



  const nearbyClubs = [
    {
      name: 'Norwood Pines Supper Club',
      city: 'Minocqua',
      miles: 56,
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D%3D&auto=format&fit=crop&w=500&q=60',
    },
    {
      name: 'Sardine',
      city: 'Madison',
      miles: 65,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    },
    {
      name: 'Dutch Mill',
      city: 'Kenosha',
      miles: 97,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    },
    {
      name: 'The Pines',
      city: 'Mercer',
      miles: 75,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    },
  ];
  
  useFocusEffect(
    React.useCallback(() => {
      // Reset discover UI each time Home is focused
      setDiscoverVisible(false);
      setCurrentStep(null);
      setSelectedState(null);
      setSelectedCity(null);
    }, [])
  );

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
            <Text style={styles.title}>Welcome to Supper Club </Text>
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

            <TouchableOpacity
              style={styles.discoverButton}
              onPress={() => {
                setDiscoverVisible(true);         // Show the discover flow
                setCurrentStep('midwest');        // Set step to Midwest view
                setSelectedState(null);          // Clear previous state/city
                setSelectedCity(null);
              }}
            >
              <FontAwesome5 name="compass" size={20} color="#000" />
              <Text style={styles.discoverButtonText}>Discover</Text>
            </TouchableOpacity>

            <Link href="/leaderboard" asChild>
              <TouchableOpacity style={styles.leaderboardButton}>
                <FontAwesome5 name="trophy" size={15} color="#000" style={styles.icon} />
                <Text style={styles.leaderboardButtonText}>Leaderboard</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Statistics Section */}
          <View style={styles.card}>
            
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
              {nearbyClubs.map((club, i) => (
                <View key={i} style={styles.clubCard}>
                  <Image source={{ uri: club.image }} style={styles.clubImage} />
                  <View style={styles.clubInfo}>
                    <Text style={styles.clubName}>{club.name}</Text>
                    <Text style={styles.clubDetails}>
                      {club.city} • {club.miles} miles away
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Status & Journey Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <View style={styles.badgeBox}>
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
              <TouchableOpacity style={styles.shareButton} onPress={handleFacebookShare}>
                <FontAwesome name="facebook" size={18} color="#1877F2" style={{ marginRight: 6 }} />
                <Text style={styles.shareButtonText}>Share on Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.journeyBox}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
              <FontAwesome5 name="map" size={20} color="#600" />
              <Text style={styles.tagline}>Your Supper Club Journey</Text>
            </View>
            <Text style={styles.journeyText}>Interactive map of your supper club visits coming soon!</Text>
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Explore Supper Clubs</Text>
            </TouchableOpacity>
          </View>

          {/* About Supper Clubs */}
         
          <View style={styles.aboutBox}>
            <Text style={styles.sectionTitle}>About Supper Clubs</Text>
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

      {discoverVisible && currentStep === 'midwest' && (
        <View style={styles.popupContainer}>
          <Text style={styles.popupTitle}>Select a State</Text>
          <ScrollView>
            {midwestStates.map((state) => (
              <TouchableOpacity
                key={state.name}
                onPress={() => {
                  setSelectedState(state);
                  setCurrentStep('state');
                }}
                style={styles.listItem}
              >
                <Text style={styles.listText}>{state.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => setDiscoverVisible(false)} style={styles.closeBtn}>
            <Text style={{ color: 'white' }}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {discoverVisible && currentStep === 'state' && selectedState && (
        <View style={styles.popupContainer}>
          <Text style={styles.popupTitle}>Select a City in {selectedState.name}</Text>
          <ScrollView>
            {selectedState.cities.map((city) => (
              <TouchableOpacity
                key={city.name}
                onPress={() => {
                  setSelectedCity(city);
                  setCurrentStep('city');
                }}
                style={styles.listItem}
              >
                <Text style={styles.listText}>{city.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => setCurrentStep('midwest')} style={styles.backBtn}>
            <Text style={{ color: 'white' }}>Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {discoverVisible && currentStep === 'city' && selectedCity && (
        <View style={styles.popupContainer}>
          <Text style={styles.popupTitle}>Explore Supper Clubs in {selectedCity.name}</Text>
          
          <TouchableOpacity
            onPress={() => {
              setDiscoverVisible(false);
              setCurrentStep(null);
              setSelectedState(null);
              setSelectedCity(null);

              // Navigate to map with params
              router.push(`/map?lat=${selectedCity.lat}&lng=${selectedCity.lng}&city=${selectedCity.name}&state=${selectedState.name}`);

            }}
            style={styles.confirmBtn}
          >
            <Text style={{ color: 'white' }}>View Map</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentStep('state')} style={styles.backBtn}>
            <Text style={{ color: 'white' }}>Back</Text>
          </TouchableOpacity>
        </View>
      )}

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
    marginLeft: 8,
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
    color: '#000',
    marginBottom: 8,
    alignSelf: 'flex-start',
    paddingBottom: 8,
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
  clubImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    marginLeft: 20,
    marginRight: 20,
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
    marginLeft: 20,
    marginRight: 20,
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
    marginLeft: 10,
    paddingVertical: 4,
    borderRadius: 8,
    margin: 16,
    fontWeight: 'bold',
    color: '#1F2937', // Navy-like color
    textAlign: 'center',
    backdropFilter: 'blur(10px)', // Optional blur effect
    // flexDirection: 'row',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    // marginBottom: 10,
    // paddingLeft: 5,
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
  icon: {
    marginRight: 8,
    marginLeft: 15,
    marginTop: 3,
  },
  popupContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    bottom: 80,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    zIndex: 999,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  confirmBtn: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backBtn: {
    marginTop: 10,
    backgroundColor: '#9CA3AF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#B91C1C',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  }
  
});
