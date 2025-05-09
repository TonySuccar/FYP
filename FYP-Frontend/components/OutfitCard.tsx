import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ItemMiniCard from './ItemMiniCard';
import axios from 'axios';
import { CONFIG } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OutfitCard({ outfit, index }: { outfit: any[], index: number }) {
  const handleWearAll = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
  
      const outfitIds = outfit.map(item => item._id);
  
      const response = await axios.post(
        `${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/items/wear-outfit`,
        { outfit: outfitIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      Alert.alert('Success', response.data.message || 'Outfit marked as worn.');
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message;
        Alert.alert('Error', msg || 'Could not mark outfit as worn.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
  
      if (__DEV__) console.warn('WearAll error:', error?.response?.data || error.message);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Outfit {index + 1}</Text>
      <View style={styles.row}>
        {outfit.map(item => (
          <View key={item._id} style={styles.rowItem}>
            <ItemMiniCard item={item} />
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.wearButton} onPress={handleWearAll}>
        <Text style={styles.wearButtonText}>Wear Outfit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#cccccc',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  title: {
    fontWeight: '600',
    fontSize: 13,
    color: '#000',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginRight: -8,
  },
  rowItem: {
    marginRight: 8,
    marginBottom: 8,
  },
  wearButton: {
    marginTop: 10,
    backgroundColor: '#000',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  wearButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    textTransform: 'uppercase',
  },
});
