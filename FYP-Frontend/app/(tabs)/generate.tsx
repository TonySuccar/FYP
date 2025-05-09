import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CONFIG } from '../../config';
import OutfitCard from '@/components/OutfitCard';

export default function Generate() {
  const flatListRef = useRef<FlatList>(null);
  const [query, setQuery] = useState('');
  const [preferredSeason, setPreferredSeason] = useState('');
  const [selectedWeather, setSelectedWeather] = useState<'warm' | 'cool' | 'auto' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [outfits, setOutfits] = useState<any[][]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    AsyncStorage.getItem('preferredSeason').then(value => {
      if (value) setPreferredSeason(value);
    });
  }, []);

  const handleWeatherToggle = (choice: 'warm' | 'cool' | 'auto') => {
    setSelectedWeather(prev => (prev === choice ? null : choice));
  };

  const getSeasonFromWeather = (): string => {
    if (selectedWeather === 'warm') return 'summer wear';
    if (selectedWeather === 'cool') return 'winter wear';
    if (selectedWeather === 'auto') return preferredSeason || 'spring wear';
    return preferredSeason || 'spring wear';
  };
  


  const fetchOutfits = async (requestedPage = 1, retries = 3) => {
    if (!query.trim()) {
      Alert.alert('Missing Input', 'Please enter an occasion or event.');
      return;
    }
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Unauthorized', 'Please log in again.');
        return;
      }
  
      const season = getSeasonFromWeather();
      const response = await axios.get(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/items/generate-outfit`, {
        params: { text: query, season, page: requestedPage },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setOutfits(response.data.items);
      setTotalPages(response.data.totalPages);
      setPage(requestedPage);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch (error: any) {
      if (retries > 0) {
          fetchOutfits(requestedPage, retries - 1);
  
      } else {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'An unexpected error occurred.';
  
        Alert.alert('❌ Failed to Generate Outfit', message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  


  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.pageBox, page === p && styles.pageBoxActive]}
            onPress={() => fetchOutfits(p)}
          >
            <Text style={[styles.pageText, page === p && styles.pageTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      <FlatList
        ref={flatListRef}
        data={outfits}
        keyExtractor={(_, i) => `outfit-${i}`}
        renderItem={({ item, index }) => <OutfitCard outfit={item} index={index} />}
        ListHeaderComponent={
          <View>
            <Text style={styles.sectionTitle}>Generate an Outfit</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Enter your event or occasion"
              value={query}
              onChangeText={setQuery}
            />

<Text style={styles.radioLabel}>How is the weather today:</Text>
<View style={styles.radioGroup}>
  {['warm', 'cool', 'auto'].map(option => (
    <TouchableOpacity
      key={option}
      style={styles.radioOption}
      onPress={() => handleWeatherToggle(option as 'warm' | 'cool' | 'auto')}
    >
      <View style={styles.radioOuter}>
        {selectedWeather === option && <View style={styles.radioInner} />}
      </View>
      <Text>
        {option === 'warm'
          ? 'Warm Weather'
          : option === 'cool'
          ? 'Cool Weather'
          : 'Auto'}
      </Text>
    </TouchableOpacity>
  ))}
</View>

          </View>
        }
        ListFooterComponent={
          <View style={{ marginBottom: 100 }}>
            {outfits.length > 0 && renderPagination()}
          </View>
        }
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      />


      <TouchableOpacity style={styles.addButton} onPress={() => fetchOutfits(1)} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.addButtonText}>Generate Outfit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  pageBox: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  pageBoxActive: {
    backgroundColor: '#000',
  },
  pageText: {
    color: '#333',
    fontWeight: '500',
  },
  pageTextActive: {
    color: '#fff',
  },
});
