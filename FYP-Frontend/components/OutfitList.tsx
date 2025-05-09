import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import OutfitCard from './OutfitCard';

export default function OutfitList({ outfits }: { outfits: any[][] }) {
  if (!outfits.length) return <Text style={styles.emptyText}>No outfits found</Text>;

  return (
    <FlatList
      data={outfits}
      keyExtractor={(_, idx) => `outfit-${idx}`}
      renderItem={({ item, index }) => <OutfitCard outfit={item} index={index} />}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}
const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 13,
    fontWeight: '300',
    color: '#999',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
