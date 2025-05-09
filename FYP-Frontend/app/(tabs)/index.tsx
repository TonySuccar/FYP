import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import WeatherBar from '@/components/WeatherBar';
import WeatherForecastList from '@/components/WeatherForecastList';
import ItemsNeedingWashList from '@/components/ItemsNeedingWashList';
import ItemsInWasherList from '@/components/ItemsInWasherList';
import WornOutfitsList from '@/components/WornOutfitsList';

export default function TabOneScreen() {
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 👇 Increment trigger to refresh child lists
  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  // Optional: refresh when screen regains focus
  useFocusEffect(
    useCallback(() => {
      triggerRefresh();
    }, [])
  );

  return (
    <View style={styles.container}>
      <WeatherBar />

      <ScrollView contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/hero.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)', 'transparent']}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroTitle}>Plan Your Perfect Outfit</Text>
            <TouchableOpacity style={styles.heroButton} onPress={() => router.push('/generate')}>
              <Text style={styles.heroButtonText}>Get Started</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <Text style={styles.title}>Weather Forecast</Text>
        <WeatherForecastList />

        {/* Lists with refresh dependency */}
        <ItemsNeedingWashList refreshTrigger={refreshTrigger} />
        <ItemsInWasherList refreshTrigger={refreshTrigger} />
        <WornOutfitsList refreshTrigger={refreshTrigger}/>

  
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 320,
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 14,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 8,
    elevation: 3,
  },
  heroButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
    color: '#333',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  separator: {
    marginTop: 20,
    height: 1,
    width: '80%',
    backgroundColor: '#ccc',
  },
});
