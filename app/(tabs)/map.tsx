// app/map.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Image, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB5iaOi8llySykAv5NUqMjx7u5mU4LU0qs';

// Default region for the map
const defaultRegion = {
  latitude: 40.7128, // New York City latitude
  longitude: -74.0060, // New York City longitude
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
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
    name: 'Joe’s Supper Club',
    latitude: 40.73061,
    longitude: -73.935242,
    city: 'New York',
    state: 'NY',
    rating: 4.5,
    price: '$50-100',
    address: '123 Main St, New York, NY',
    images: [
      'https://via.placeholder.com/300x200',
      'https://via.placeholder.com/300x200',
    ],
    reviews: [
      { id: '1', text: 'Amazing food and great atmosphere!', rating: 5 },
      { id: '2', text: 'Highly recommend the steak!', rating: 4.5 },
    ],
    visited: true,
  },
  {
    id: '2',
    name: 'The Manhattan Supper Club',
    latitude: 40.712776,
    longitude: -74.005974,
    city: 'New York',
    state: 'NY',
    rating: 4.8,
    price: '$100-150',
    address: '456 Broadway, New York, NY',
    images: [
      'https://via.placeholder.com/300x200',
      'https://via.placeholder.com/300x200',
    ],
    reviews: [
      { id: '1', text: 'Upscale dining experience with great seafood!', rating: 5 },
    ],
    visited: true,
  },
];

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyClubs, setNearbyClubs] = useState<any[]>([]);
  const [region, setRegion] = useState(defaultRegion);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [selectedClub, setSelectedClub] = useState<any | null>(null); // State for selected club details

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        if (currentLocation) {
          setRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          fetchNearbyClubs(currentLocation.coords.latitude, currentLocation.coords.longitude);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        setErrorMsg('Unable to fetch location.');
      }
    })();
  }, []);

  const fetchNearbyClubs = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${latitude},${longitude}`,
            radius: 5000,
            type: 'restaurant',
            keyword: 'supper club',
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );
      setNearbyClubs(response.data.results);
    } catch (error) {
      console.error('Error fetching nearby clubs:', error);
    }
  };

  const isVisited = (place: any) => {
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
        onPress={() => setSelectedClub(item)}
      >
        <Text style={styles.detailsButtonText}>Details</Text>
      </TouchableOpacity>
    </View>
  );

  const addToVisited = (club: any) => {
    if (!visitedPlaces.find((visited) => visited.id === club.id)) {
      visitedPlaces.push({ ...club, visited: true });
    }
    setSelectedClub(null); // Close the popup
  };

  if (!location && errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

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
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
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
              onPress={() => setSelectedClub(club)}
              pinColor={isVisited(club) ? 'green' : 'red'} // Green for visited, red for non-visited
            >
            </Marker>
          ))}
        </MapView>
      </View>

      {/* List Section */}
      <View style={styles.listContainer}>
        <FlatList
          data={nearbyClubs}
          keyExtractor={(item) => item.place_id}
          renderItem={renderClubItem}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Club Details Modal */}
      {selectedClub && (
        <Modal
          transparent
          animationType="slide"
          visible={!!selectedClub}
          onRequestClose={() => setSelectedClub(null)}
        >
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
        
              {/* Header Buttons */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedClub(null)}>
                  <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => addToVisited(selectedClub)}>
                  <AntDesign name="plus" size={24} color="black" />
                </TouchableOpacity>
              </View>
        
              {/* Supper Club Name */}
              <Text style={styles.modalTitle}>{selectedClub.name}</Text>
        
              {/* Image Preview */}
              <ScrollView horizontal style={styles.imageCarousel}>
                {selectedClub.photos?.length
                  ? selectedClub.photos.map((photo: any, index: number) => (
                      <Image
                        key={index}
                        source={{
                          uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`,
                        }}
                        style={styles.modalImage}
                      />
                    ))
                  : selectedClub.images?.map((img: string, index: number) => (
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
                    color={index < Math.round(selectedClub.rating || 0) ? '#FACC15' : '#E5E7EB'}
                  />
                ))}
                <Text style={{ marginLeft: 8 }}>({selectedClub.rating || 'N/A'})</Text>
              </View>
        
              {/* Address & Price */}
              <Text style={styles.modalDetails}>
                Address: {selectedClub.vicinity || selectedClub.address || 'Not Available'}
              </Text>
              <Text style={styles.modalDetails}>
                Price: {getPriceRange(selectedClub.price_level)}
              </Text>
        
              {/* Club Location Mini Map */}
              <MapView
                style={styles.detailMap}
                initialRegion={{
                  latitude: selectedClub.geometry?.location.lat || selectedClub.latitude,
                  longitude: selectedClub.geometry?.location.lng || selectedClub.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: selectedClub.geometry?.location.lat || selectedClub.latitude,
                    longitude: selectedClub.geometry?.location.lng || selectedClub.longitude,
                  }}
                />
              </MapView>
        
              {/* Reviews */}
              <Text style={styles.modalSectionTitle}>Reviews</Text>
              {selectedClub.reviews?.length ? (
                selectedClub.reviews.map((review: any) => (
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
});
