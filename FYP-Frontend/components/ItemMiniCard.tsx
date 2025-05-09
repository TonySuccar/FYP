import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { CONFIG } from '../config';

export default function ItemMiniCard({ item }: { item: any }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: `${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/${item.processedImage.replace(/\\/g, '/')}` }}
        style={styles.image}
      />
      <Text style={styles.name}>{item.name || 'Unnamed'}</Text>
      <Text style={styles.meta}>{item.clothingType} - {item.color}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#ffffff', // white fallback for image area
    resizeMode: 'cover',
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000', // soft white text
    marginTop: 6,
    textAlign: 'center',
  },
  meta: {
    fontSize: 10,
    color: '#555555', // slightly brighter grey for legibility
    textAlign: 'center',
    marginTop: 2,
  },
});

