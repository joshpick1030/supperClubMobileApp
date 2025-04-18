// app/map.tsx

import React, { useEffect, useState ,useRef} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Image, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB5iaOi8llySykAv5NUqMjx7u5mU4LU0qs';

// Default region for the map
const defaultRegion = {
  latitude: 40.7128, // New York City latitude
  longitude: -74.0060, // New York City longitude
  latitudeDelta: 1,
  longitudeDelta: 1,
};

const getPriceRange = (priceLevel: number) => {
  switch (priceLevel) {
    case 0:
      return '$0';
    case 1:
      return '$1 - $10';
    case 2:
      return '$11 - $30';
    case 3:
      return '$31 - $60';
    case 4:
      return '$60+';
    default:
      return 'Not Available';
  }
};

// Mock data for visited places in New York
const visitedPlaces = [
  {
    id: '1',
    name: "L'Artusi Supper Club",
    place_id: "ChIJ69wzjklZwokRv1YuMukRVOA",
    latitude: 40.7334886,
    longitude: -74.0050292,
    city: "New York",
    state: "NY",
    rating: 4.7,
    price: "$30-60",
    address: "105 Christopher St, New York",
    images: [
      'https://via.placeholder.com/300x200',
    ],
    reviews: [
      { id: '1', text: "Excellent food and wine selection!", rating: 5 },
    ],
    visited: true,
  },
  {
    id: '2',
    name: "Bangkok Supper Club",
    place_id: "ChIJvduhDjVZwokReg77D1pNQaQ",
    latitude: 40.739047,
    longitude: -74.0057385,
    city: "New York",
    state: "NY",
    rating: 4.5,
    price: "$10-30",
    address: "641 Hudson St, New York",
    images: [
      'https://via.placeholder.com/300x200',
    ],
    reviews: [
      { id: '1', text: "Authentic Thai flavors in a cozy setting.", rating: 4 },
    ],
    visited: true,
  },
  {
    id: '3',
    name: "St. Mazie Bar & Supper Club",
    place_id: "ChIJSy8Bbl9ZwokR8QnOQHNn4hk",
    latitude: 40.7126002,
    longitude: -73.9558512,
    city: "Brooklyn",
    state: "NY",
    rating: 4.5,
    price: "$10-30",
    address: "345 Grand St, Brooklyn",
    images: [
      'https://via.placeholder.com/300x200',
    ],
    reviews: [
      { id: '1', text: "Live music and delicious cocktails!", rating: 5 },
    ],
    visited: true,
  },
  {
    id: '4',
    name: "Copper Club",
    place_id: "ChIJvx8622AtDogRizuPzfuMBaw",
    latitude: 41.8821835,
    longitude: -87.62980709999999,
    city: "Chicago",
    state: "Illinois",
    rating: 4.6,
    price: "$10-30",
    address: "V9W7+56 Chicago, Illinois",
    images: [
      'https://via.placeholder.com/300x200',
    ],
    reviews: [
      { id: '1', text: "Live music and delicious cocktails!", rating: 5 },
    ],
    visited: true,
  }
];


export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyClubs, setNearbyClubs] = useState<any[]>([]);
  const [region, setRegion] = useState(defaultRegion);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [selectedClubForPrompt, setSelectedClubForPrompt] = useState<any | null>(null);
  const [selectedClubForModal, setSelectedClubForModal] = useState<any | null>(null);  
  const [showPreviewPrompt, setShowPreviewPrompt] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const { lat, lng, useCurrentLocation } = params;

  useEffect(() => {
    if (useCurrentLocation === 'true') {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission denied');
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        const newRegion = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        };
        setRegion(newRegion);
        fetchNearbyClubs(newRegion.latitude, newRegion.longitude);
      })();
    } else if (lat && lng) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      const newRegion = {
        latitude: parsedLat,
        longitude: parsedLng,
        latitudeDelta: 1,
        longitudeDelta: 1,
      };
      setRegion(newRegion);
      fetchNearbyClubs(parsedLat, parsedLng);
    }
  }, [useCurrentLocation, lat, lng]);

  const getClubReviews = (club: any) => {
    const visitedMatch = visitedPlaces.find((v) => v.place_id === club.place_id);
    if (visitedMatch?.reviews?.length) return visitedMatch.reviews;
  
    // Mock reviews for non-visited places
    return [
      {
        id: '1',
        text: 'Great ambiance and tasty dishes!',
        rating: 4,
      },
      {
        id: '2',
        text: 'Service was decent, would return.',
        rating: 3.5,
      },
    ];
  };  

  const fetchNearbyClubs = async (latitude: number, longitude: number) => {
    try {
      const nearbyResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${latitude},${longitude}`,
            radius: 50000,
            type: 'restaurant',
            keyword: 'supper club',
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );
  
      const basicResults = nearbyResponse.data.results;
  
      // Fetch details for each result
      const detailedResults = await Promise.all(
        basicResults.map(async (place) => {
          try {
            const detailsRes = await axios.get(
              `https://maps.googleapis.com/maps/api/place/details/json`,
              {
                params: {
                  place_id: place.place_id,
                  fields: 'name,rating,vicinity,formatted_phone_number,opening_hours,photos,reviews,geometry',
                  key: GOOGLE_MAPS_API_KEY,
                },
              }
            );
            return {
              ...place,
              ...detailsRes.data.result,
            };
          } catch (err) {
            console.error(`Error fetching details for ${place.name}:`, err);
            return place;
          }
        })
      );
  
      setNearbyClubs(detailedResults);
    } catch (error) {
      console.error('Error fetching nearby clubs:', error);
    }
  };
  

  const isVisited = (place: any) => {
    // Prefer to match by place_id if available
    if (place.place_id) {
      return visitedPlaces.some((visited) => visited.place_id === place.place_id);
    }
  
    // Fallback to matching name and approximate location
    return visitedPlaces.some(
      (visited) =>
        visited.name === place.name &&
        Math.abs(visited.latitude - place.geometry.location.lat) < 0.001 &&
        Math.abs(visited.longitude - place.geometry.location.lng) < 0.001
    );
  };

  const renderClubItem = ({ item }: { item: any }) => (
    <View style={styles.clubCard}>
      <Text style={styles.clubName}>{item.name}</Text>
      <Text style={styles.clubDetails}>
        {item.vicinity || `${item.city}, ${item.state}`}
      </Text>
      <Text style={styles.clubStatus}>
        {isVisited(item) ? 'Visited' : 'Not Visited'}
      </Text>

      {/* Details Button */}
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => setSelectedClubForModal(item)}
      >
        <Text style={styles.detailsButtonText}>Details</Text>
      </TouchableOpacity>

    </View>
  );

  const addToVisited = (club: any) => {
    if (!visitedPlaces.find((visited) => visited.id === club.id)) {
      visitedPlaces.push({ ...club, visited: true });
    }
    setSelectedClubForModal(null); // Close the popup
  };

  if (!location && errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  const filteredClubs = nearbyClubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );  

  const mapRef = useRef<MapView>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 1, 20);
    setZoomLevel(newZoom);
    mapRef.current?.animateCamera({ zoom: newZoom }, { duration: 300 });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 1, 2);
    setZoomLevel(newZoom);
    mapRef.current?.animateCamera({ zoom: newZoom }, { duration: 300 });
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search supper clubs..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          initialRegion={region}
          showsUserLocation
        >
          {/* Mark nearby clubs */}
          {nearbyClubs.map((club) => (
            <Marker
              key={club.place_id}
              coordinate={{
                latitude: club.geometry.location.lat,
                longitude: club.geometry.location.lng,
              }}
              onPress={() => {
                setSelectedClubForPrompt(club);
                setShowPreviewPrompt(true);
              }}              
              pinColor={isVisited(club) ? 'green' : 'red'}
            />
          ))}

        </MapView>
        
        <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={() => {
              router.push('/map?useCurrentLocation=true');
            }}
          >
            <FontAwesome name="location-arrow" size={24} color="black"  />
          </TouchableOpacity>
        {/* Zoom Controls (Correct Placement) */}
        <View style={styles.zoomControls}>
          <TouchableOpacity
            onPress={() =>
              setRegion((prev) => ({
                ...prev,
                latitudeDelta: prev.latitudeDelta / 2,
                longitudeDelta: prev.longitudeDelta / 2,
              }))
            }
            style={styles.zoomButton}
          >
            <FontAwesome name="plus" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setRegion((prev) => ({
                ...prev,
                latitudeDelta: prev.latitudeDelta * 2,
                longitudeDelta: prev.longitudeDelta * 2,
              }))
            }
            style={styles.zoomButton}
          >
            <FontAwesome name="minus" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* List Section */}
      <View style={styles.listContainer}>
      <FlatList
        data={filteredClubs}
        keyExtractor={(item) => item.place_id}
        renderItem={renderClubItem}
        contentContainerStyle={styles.listContent}
      />
      </View>

      {/* Club Details Modal */}
      {selectedClubForModal && (
        <Modal
          transparent
          animationType="slide"
          visible={!!selectedClubForModal}
          onRequestClose={() => setSelectedClubForModal(null)}
        >
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
        
              {/* Header Buttons */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedClubForModal(null)}>
                  <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => addToVisited(selectedClubForModal)}>
                  <AntDesign name="plus" size={24} color="black" />
                </TouchableOpacity>
              </View>
        
              {/* Supper Club Name */}
              <Text style={styles.modalTitle}>{selectedClubForModal.name}</Text>
        
              {/* Image Preview */}
              <ScrollView horizontal style={styles.imageCarousel}>
                {selectedClubForModal .photos?.length
                  ? selectedClubForModal .photos.map((photo: any, index: number) => (
                      <Image
                        key={index}
                        source={{
                          uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`,
                        }}
                        style={styles.modalImage}
                      />
                    ))
                  : selectedClubForModal .images?.map((img: string, index: number) => (
                      <Image key={index} source={{ uri: img }} style={styles.modalImage} />
                    ))}
              </ScrollView>
        
              {/* Rating (Star Visuals) */}
              <View style={styles.starContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <FontAwesome
                    key={index}
                    name="star"
                    size={20}
                    color={index < Math.round(selectedClubForModal .rating || 0) ? '#FACC15' : '#E5E7EB'}
                  />
                ))}
                <Text style={{ marginLeft: 8 }}>({selectedClubForModal .rating || 'N/A'})</Text>
              </View>
        
              {/* Address & Price */}
              <Text style={styles.modalDetails}>
                Address: {selectedClubForModal .vicinity || selectedClubForModal .address || 'Not Available'}
              </Text>
              <Text style={styles.modalDetails}>
                Price: {getPriceRange(selectedClubForModal .price_level)}
              </Text>
        
              {/* Club Location Mini Map */}
              <MapView
                style={styles.detailMap}
                ref = {mapRef}
                initialRegion={{
                  latitude: selectedClubForModal .geometry?.location.lat || selectedClubForModal .latitude,
                  longitude: selectedClubForModal .geometry?.location.lng || selectedClubForModal .longitude,
                  latitudeDelta: 1,
                  longitudeDelta: 1,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: selectedClubForModal .geometry?.location.lat || selectedClubForModal .latitude,
                    longitude: selectedClubForModal .geometry?.location.lng || selectedClubForModal .longitude,
                  }}
                />
              </MapView>
        
              {/* Reviews */}
              {/* Reviews */}
              <Text style={styles.modalSectionTitle}>Reviews</Text>
              {getClubReviews(selectedClubForModal)?.length > 0 ? (
                getClubReviews(selectedClubForModal).map((review: any) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <Text style={styles.reviewText}>{review.text}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <FontAwesome
                          key={idx}
                          name="star"
                          size={16}
                          color={idx < Math.round(review.rating) ? '#FACC15' : '#E5E7EB'}
                        />
                      ))}
                    </View>
                  </View>
                ))
              ) : (
                <Text>No reviews available.</Text>
              )}
            </ScrollView>
          </View>
        </Modal>
      )}
      {showPreviewPrompt && selectedClubForPrompt && (
        <View style={styles.promptOverlay}>
          {/* Blurred Background (just dimming here) */}
          <TouchableOpacity
            style={styles.blurBackground}
            activeOpacity={1}
            onPress={() => {
              setShowPreviewPrompt(false);
              setSelectedClubForPrompt(null);
            }}
          />

          {/* Prompt Card */}
          <View style={styles.promptCard}>
            {/* Image Preview */}
            {selectedClubForPrompt.photos?.[0] && (
              <Image
                source={{
                  uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=${selectedClubForPrompt.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`,
                }}
                style={styles.promptImage}
              />
            )}

            {/* Name */}
            <Text style={styles.promptTitle}>{selectedClubForPrompt.name}</Text>

            {/* Address */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <FontAwesome name="map-marker" size={14} color="#EA580C" style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 13, color: '#6B7280' }}>
                {selectedClubForPrompt.vicinity || selectedClubForPrompt.address || 'Address not available'}
              </Text>
            </View>

            {/* Rating */}
            <View style={styles.promptRow}>
              <FontAwesome name="star" size={14} color="#FACC15" />
              <Text style={styles.promptSubText}>
                {selectedClubForPrompt.rating || 'N/A'} / 5
              </Text>
            </View>

            {/* Opening Hours */}

            {selectedClubForPrompt?.opening_hours?.weekday_text?.length > 0 && (
              <View style={{ marginVertical: 8 }}>
                <FontAwesome name="clock-o" size={14} color="#10B981" />
                {selectedClubForPrompt.opening_hours.weekday_text.map((line: string, idx: number) => (
                  <Text
                    key={idx}
                    style={{
                      fontSize: 12,
                      color: '#374151', // neutral-700
                      lineHeight: 18,
                    }}
                  >
                    {line}
                  </Text>
                ))}
              </View>
            )}


            {/* Phone number */}
            <View style={styles.promptRow}>
              <FontAwesome name="phone" size={14} color="#3B82F6" />
              <Text style={styles.promptSubText}>
                {selectedClubForPrompt.formatted_phone_number || '(Contact unavailable)'}
              </Text>
            </View>

            {/* Visited */}
            <View style={styles.promptRow}>
              <FontAwesome name="check-circle" size={14} color={isVisited(selectedClubForPrompt) ? 'green' : 'gray'} />
              <Text style={styles.promptSubText}>
                {isVisited(selectedClubForPrompt) ? 'Visited' : 'Not Visited'}
              </Text>
            </View>

            {/* View Details */}
              <TouchableOpacity
                onPress={() => {
                  setShowPreviewPrompt(false);
                  setSelectedClubForModal(selectedClubForPrompt);
                }}
                style={styles.viewDetailsButton}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>View Details</Text>
              </TouchableOpacity>
            </View>

        </View>
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    padding: 10,
    backgroundColor: '#F3F4F6',
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mapContainer: {
    flex: 1,
    zIndex: 1,
  },
  map: {
    flex: 1,
  },
  callout: {
    alignItems: 'center',
    width: 200,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  clubCard: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  clubName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clubDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  clubStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },
  detailsButton: {
    marginTop: 10,
    backgroundColor: '#F59E0B',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageCarousel: {
    marginBottom: 20,
  },
  modalImage: {
    width: 300,
    height: 200,
    marginRight: 10,
    borderRadius: 8,
  },
  modalDetails: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 5,
  },
  reviewRating: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  detailMap: {
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  promptCard: {
    position: 'absolute',
    top: 100,
    width: '85%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 20,
  },
  
  promptImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  
  promptTitle: {  
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  viewDetailsButton: {
    marginTop: 10,
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  promptOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dims everything behind
  },
  currentLocationButton: {
    position: 'absolute',
    top: 60,
    right: 14,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    elevation: 3,
    zIndex: 100,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    zIndex: 100,
  },
  zoomButton: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  
  promptSubText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#6B7280',
    flexShrink: 1,
  },
  
});

