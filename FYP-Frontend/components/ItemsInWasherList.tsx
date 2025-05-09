import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../config';

type Item = {
  _id: string;
  name: string;
  usedTimes: number;
  iswashing: boolean;
  processedImage?: string;
  clothingType?: string;
};

export default function ItemsInWasherList({ refreshTrigger }: { refreshTrigger: number }) {
    useEffect(() => {
        fetchWasherItems();
      }, [refreshTrigger]);
      

  const [items, setItems] = useState<Item[]>([]);

  const fetchWasherItems = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/items/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const inWasher = response.data.filter((item: Item) => item.iswashing);
      setItems(inWasher);
    } catch (error) {
      console.error('Error fetching washer items:', error);
    }
  };

  useEffect(() => {
    fetchWasherItems();
  }, []);

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>In the Washer</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={
                item.processedImage
                  ? { uri: `${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/${item.processedImage.replace(/^\/+/, '')}` }
                  : require('@/assets/images/images.png')
              }
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.name}>{item.name || 'Unnamed'}</Text>
            <Text style={styles.subtext}>{item.clothingType || 'Type'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  card: {
    width: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginBottom: 6,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  subtext: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
  },
});
