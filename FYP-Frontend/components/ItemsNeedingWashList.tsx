import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
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

export default function ItemsNeedingWashList({ refreshTrigger }: { refreshTrigger: number }) {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    fetchItems();
  }, [refreshTrigger]);
  

  const fetchItems = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/items/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filtered = response.data.filter((item: Item) => item.usedTimes > 1 && !item.iswashing);
      setItems(filtered);
    } catch (error) {
      console.error('Error fetching items needing wash:', error);
    }
  };

  const washAll = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      for (const item of items) {
        try {
          await axios.post(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/items/${item._id}/wash`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          console.warn(`Failed to wash ${item.name}:`, (err as any).response?.data?.message || (err as any).message);
        }
      }

      Alert.alert('✅ Done', 'All your dirty clothes are now washing.');
      fetchItems();
    } catch (err) {
      Alert.alert('Error', 'Failed to wash all items.');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header with title + wash all */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Items Needing Washing</Text>
        <TouchableOpacity onPress={washAll} style={styles.washAllButton}>
          <Text style={styles.washAllText}>Wash All</Text>
        </TouchableOpacity>
      </View>

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
            <Text style={styles.subtext}>
               {item.usedTimes} uses
            </Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  washAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: 'transparent', // 🔹 Clear background
  },
  washAllText: {
    color: '#000', // 🔹 Black text
    fontSize: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
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
