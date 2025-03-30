import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface BadgeCardProps {
  name: string;
  image: string;
  current: number;
  required: number;
  earned: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ name, image, current, required, earned }) => {
  const progress = Math.min((current / required) * 100, 100);

  return (
    <View style={styles.cardContainer}>
      {/* Badge Card */}
      <View style={[styles.card, earned ? styles.earnedCard : styles.pendingCard]}>
        <Image source={{ uri: image }} style={styles.image} />
        <Text style={[styles.name, earned ? styles.earnedText : styles.pendingText]}>{name}</Text>
      </View>

      {/* Progress Bar */}
      {!earned && (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      )}

      {/* Progress Text */}
      <Text style={styles.progressText}>
        {earned ? '' : `${current}/${required} visits`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  card: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  earnedCard: {
    backgroundColor: '#D1FAE5', // Light green for earned badges
  },
  pendingCard: {
    backgroundColor: '#F3F4F6', // Light gray for pending badges
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  earnedText: {
    color: '#065F46', // Dark green for earned badges
  },
  pendingText: {
    color: '#6B7280', // Gray for pending badges
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB', // Light gray background
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#F59E0B', // Amber for progress
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
});

export default BadgeCard;