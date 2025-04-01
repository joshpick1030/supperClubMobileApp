// app/map.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB5iaOi8llySykAv5NUqMjx7u5mU4LU0qs';

// Default region for the Midwest area
const midwestRegion = {
  latitude: 41.85003, // Center of the Midwest
  longitude: -87.65005, // Center of the Midwest
  latitudeDelta: 10, // Zoom level for the Midwest
  longitudeDelta: 10,
};

// Mock data for visited clubs
const visitedClubs = [
  {
    name: 'Norwood Pines Supper Club',
    latitude: 44.5133,
    longitude: -89.5745,
    city: 'Jersey City',
    state: 'NJ',
  },
  {
    name: 'Sardine',
    latitude: 43.0799,
    longitude: -89.3762,
    city: 'Jersey City',
    state: 'NJ',
  },
  {
    name: 'Liberty House Restaurant',
    latitude: 40.7116,
    longitude: -74.0648,
    city: 'Jersey City',
    state: 'NJ',
  },
  {
    name: 'Battello',
    latitude: 40.7211,
    longitude: -74.0336,
    city: 'Jersey City',
    state: 'NJ',
  },
];

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyClubs, setNearbyClubs] = useState<any[]>([]);
  const [region, setRegion] = useState(midwestRegion); // Default to Midwest region

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
            radius: 5000, // 5km radius
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

  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        showsUserLocation
      >
        {/* Mark visited clubs */}
        {visitedClubs.map((club, index) => (
          <Marker
            key={`visited-${index}`}
            coordinate={{
              latitude: club.latitude,
              longitude: club.longitude,
            }}
            pinColor="green" // Green for visited clubs
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubDetails}>
                  {club.city}, {club.state}
                </Text>
                <Text style={styles.clubStatus}>Visited</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Mark nearby unvisited clubs */}
        {nearbyClubs.map((club) => (
          <Marker
            key={club.place_id}
            coordinate={{
              latitude: club.geometry.location.lat,
              longitude: club.geometry.location.lng,
            }}
            pinColor="red" // Red for unvisited clubs
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubDetails}>{club.vicinity}</Text>
                <Text style={styles.clubStatus}>Not Visited</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  callout: {
    alignItems: 'center',
    width: 150,
  },
  clubName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clubDetails: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  clubStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F59E0B',
    textAlign: 'center',
    marginTop: 5,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  zoomButton: {
    backgroundColor: '#F59E0B',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
  },
  zoomText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
