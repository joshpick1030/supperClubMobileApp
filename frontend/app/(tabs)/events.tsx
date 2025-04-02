import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import HeaderBar from '@/components/HeaderBar';

export default function EventsScreen() {
  return (
    <>
        <HeaderBar />
        <View style={styles.screen}>
        <View style={styles.card}>
            <Text style={styles.title}>Supper Club Events</Text>
            <View style={styles.iconContainer}>
            <FontAwesome name="calendar" size={32} color="#9B1C1C" />
            </View>
            <Text style={styles.comingSoon}>Coming Soon!</Text>
            <Text style={styles.description}>
            We're cooking up something special. Check back for upcoming supper club events, meetups,
            and special dining experiences.
            </Text>
            <Text style={styles.note}>
            Stay tuned as we’ll be launching exclusive supper club gatherings in your area.
            </Text>
        </View>
        </View>
    </>
  );
}


const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: '#FAF9F6', // Off-white for soft look
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    card: {
      backgroundColor: '#FFFFFF',
      padding: 24,
      borderRadius: 16,
      width: '100%',
      maxWidth: 600,
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1F2937', // dark text
      marginBottom: 12,
    },
    iconContainer: {
      backgroundColor: '#FEF3C7',
      borderRadius: 50,
      padding: 16,
      marginBottom: 12,
    },
    comingSoon: {
      fontSize: 16,
      fontWeight: '600',
      color: '#9B1C1C',
      marginBottom: 8,
    },
    description: {
      textAlign: 'center',
      fontSize: 14,
      color: '#4B5563',
      marginBottom: 8,
    },
    note: {
      textAlign: 'center',
      fontSize: 12,
      color: '#6B7280',
      fontStyle: 'italic',
    },
  });
  