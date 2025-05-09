import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../config';


export default function WornOutfitsList({ refreshTrigger }: { refreshTrigger: number }) {
    const [outfits, setOutfits] = useState<{ items: any[]; lastUsed: string }[]>([]);

        useEffect(() => {
            fetchWornOutfits();
          }, [refreshTrigger]);

  const fetchWornOutfits = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const response = await axios.get(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/items/wornoutfits`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('Fetched worn outfits:', response.data); // ✅ inspect 
      
      

      setOutfits(response.data.map((o: any) => ({ items: o.items, lastUsed: o.lastUsed })));

    } catch (err) {
      console.error('Failed to fetch worn outfits:', err);
    }
  };

  useEffect(() => {
    fetchWornOutfits();
  }, []);

  if (!outfits.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Recently Worn Outfits</Text>
      <FlatList
        data={outfits}
        keyExtractor={(_, i) => `outfit-${i}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
            <View style={styles.outfitCard}>
              <View style={styles.imageRow}>
                {item.items.map((piece: any) => (
                  <Image
                    key={piece._id}
                    source={
                      piece.processedImage
                        ? { uri: `${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/${piece.processedImage.replace(/^\/+/, '')}` }
                        : require('@/assets/images/images.png')
                    }
                    style={styles.itemImage}
                  />
                ))}
              </View>
              <Text style={styles.dateText}>
                Last worn on {new Date(item.lastUsed).toLocaleDateString()}
              </Text>
            </View>
          )}
                   
        ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  outfitCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'column', // ✅ vertical layout
    alignItems: 'center',
    width: 'auto',
  },
  
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 6,
    borderRadius: 6,
    backgroundColor: '#fff',
  },dateRow: {
    marginBottom: 4,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  
  
});
