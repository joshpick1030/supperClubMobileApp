// app/map.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB5iaOi8llySykAv5NUqMjx7u5mU4LU0qs';

// Default region for the map
const defaultRegion = {
  latitude: 40.7128, // New York City latitude
  longitude: -74.0060, // New York City longitude
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
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
    visited: true,
  },
  {
    id: '2',
    name: 'The Manhattan Supper Club',
    latitude: 40.712776,
    longitude: -74.005974,
    city: 'New York',
    state: 'NY',
    visited: true,
  },
];

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyClubs, setNearbyClubs] = useState<any[]>([]);
  const [region, setRegion] = useState(defaultRegion);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

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

  // Filter clubs based on the search query
  const filteredClubs = nearbyClubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderClubItem = ({ item }: { item: any }) => (
    <View style={styles.clubCard}>
      <Text style={styles.clubName}>{item.name}</Text>
      <Text style={styles.clubDetails}>
        {item.vicinity || 'Address not available'}
      </Text>
      <Text style={styles.clubStatus}>
        {isVisited(item) ? 'Visited' : 'Not Visited'}
      </Text>
    </View>
  );

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
          {filteredClubs.map((club) => (
            <Marker
              key={club.place_id}
              coordinate={{
                latitude: club.geometry.location.lat,
                longitude: club.geometry.location.lng,
              }}
              pinColor={isVisited(club) ? 'green' : 'red'} // Green for visited, red for non-visited
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.clubName}>{club.name}</Text>
                  <Text style={styles.clubDetails}>{club.vicinity}</Text>
                  <Text style={styles.clubStatus}>
                    {isVisited(club) ? 'Visited' : 'Not Visited'}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
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
});
