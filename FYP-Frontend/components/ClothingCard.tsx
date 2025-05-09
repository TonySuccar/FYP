import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  UIManager,
  Alert,
} from 'react-native';
import axios from 'axios';
import { CONFIG } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Props = {
  _id: string;
  name: string | null;
  color: string;
  clothingType: string;
  imageUrl?: string | null;
  season: string;
  occasion: string;
  usedTimes: number;
  location: string;
  iswashing: boolean;
};

export default function ClothingCard(props: Props) {
  const router = useRouter();
  const [used, setUsed] = useState(props.usedTimes);

  const goToDetails = () => {
    router.push({
      pathname: '/ClothingDetail',
      params: {
        _id: props._id,
        name: props.name || '',
        color: props.color || '',
        clothingType: props.clothingType || '',
        imageUrl: props.imageUrl || '',
        season: props.season || '',
        occasion: props.occasion || '',
        usedTimes: String(props.usedTimes),
        location: props.location || '',
        iswashing: String(props.iswashing),
      },
    });
  };

  const incrementUsage = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
  
      await axios.post(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/items/${props._id}/wear`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setUsed((prev) => prev + 1);
      Alert.alert('✅ Worn', 'successfully marked as worn.');
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message;
  
        if (msg === 'Item is currently being washed.') {
          Alert.alert('Unavailable', 'This item is still being washed.');
        } else {
          Alert.alert('Error', msg || 'Could not update usage.');
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
  
      if (__DEV__) console.warn('Wear error:', error?.response?.data || error.message);
    }
  };
  

  return (
    <TouchableOpacity style={styles.card} onPress={goToDetails} activeOpacity={0.8}>
      <Image
        style={styles.image}
        source={
          props.imageUrl ? { uri: props.imageUrl } : require('../assets/images/images.png')
        }
      />
      <Text style={styles.name}>{props.name || 'Unavailable'}</Text>
      <Text style={styles.meta}>
        {props.color || 'Unknown'} • {props.clothingType || 'Unknown'}
      </Text>

      <TouchableOpacity style={styles.wearButton} onPress={incrementUsage}>
        <Text style={styles.wearButtonText}>Wear</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 220,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    borderRadius: 6,
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  name: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 13,
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  meta: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginBottom: 6,
  },
  wearButton: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 4,
  },
  wearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
