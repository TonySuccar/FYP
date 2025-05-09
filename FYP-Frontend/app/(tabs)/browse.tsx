import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CONFIG } from '../../config';
import UserProfile from '../../components/UserProfile';
import ClothingCard from '../../components/ClothingCard';
import AddItemModal from '../../components/AddItemModal';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback as useReactCallback } from 'react';

interface ClothingItem {
  location: string;
  usedTimes: number;
  _id: string;
  name: string | null;
  clothingType: string;
  color: string;
  season: string;
  occasion: string;
  processedImage?: string;
  iswashing: boolean;
}

export default function Browse() {
  const listRefs = useRef<Record<string, FlatList>>(Object.create(null));
  const scrollRef = useRef<ScrollView>(null);

  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [userInfo, setUserInfo] = useState<{ name: string; profileImageUrl?: string } | null>(null);
  const [search, setSearch] = useState('');
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

  const [season, setSeason] = useState('All');
  const [occasion, setOccasion] = useState('All');
  const [type, setType] = useState('All');
  const [color, setColor] = useState('All');

  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [locationPart, setLocationPart] = useState<string | null>(null);
  const [storageType, setStorageType] = useState<string | null>(null);

  const seasonOptions = [
    { label: 'All', value: 'All' },
    { label: 'Summer', value: 'summer wear' },
    { label: 'Winter', value: 'winter wear' },
    { label: 'All Season', value: 'spring wear' },
  ];

  const occasionOptions = [
    { label: 'All', value: 'All' },
    { label: 'Casual', value: 'casual wear' },
    { label: 'Formal', value: 'formal wear' },
    { label: 'Sport', value: 'sports wear' },
    { label: 'All Rounder', value: 'all of the above' },
  ];

  const typeOptions = [
    { label: 'All', value: 'All' },
    { label: 'T-Shirt', value: 'shirt' },
    { label: 'Jacket', value: 'jacket' },
    { label: 'Pants', value: 'pants' },
    { label: 'Shorts', value: 'shorts' },
    { label: 'Shoes', value: 'footwear' },
    { label: 'Headwear', value: 'headwear' },
    { label: 'Dress', value: 'dress' },
    { label: 'Underwear', value: 'underwear' },
    { label: 'Accessory', value: 'accessory' },
    { label: 'Swimwear', value: 'swimwear' },
  ];

  const colorOptions = [
    { label: 'All', value: 'All' },
    { label: 'Neutrals', value: 'Neutrals' },
    { label: 'Pink', value: 'Pink' },
    { label: 'Purple', value: 'Purple' },
    { label: 'Blue', value: 'Blue' },
    { label: 'Red', value: 'Red' },
    { label: 'Yellow', value: 'Yellow' },
    { label: 'Green', value: 'Green' },
    { label: 'Orange', value: 'Orange' },
    { label: 'Brown', value: 'Brown' },
  ];

  const pickImage = async (fromCamera = false) => {
    const result = await (fromCamera
      ? ImagePicker.launchCameraAsync({ quality: 0.5, base64: false })
      : ImagePicker.launchImageLibraryAsync({ quality: 0.5, base64: false }));

    if (!result.canceled) {
      setItemImage(result.assets[0].uri);
    }
  };

  const fetchClothingItems = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const params = { season, occasion, type, color, search };
      const res = await axios.get(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/items/user`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setClothingItems(res.data);
    } catch (error) {
      console.error('❌ Failed to fetch clothing items:', error);
    }
  }, [season, occasion, type, color, search]);

  useEffect(() => {
    fetchClothingItems();
  }, [fetchClothingItems]);

  useFocusEffect(
    useReactCallback(() => {
      fetchClothingItems();
      Object.values(listRefs.current).forEach((ref) => {
        ref?.scrollToOffset({ offset: 0, animated: true });
      });
    }, [fetchClothingItems])
  );

  const groupByType = (items: ClothingItem[]) => {
    const grouped: Record<string, ClothingItem[]> = {};
    for (const item of items) {
      if (!grouped[item.clothingType]) {
        grouped[item.clothingType] = [];
      }
      grouped[item.clothingType].push(item);
    }
    return grouped;
  };

  const orderedTypes = [
    'shirt', 'jacket', 'pants', 'shorts', 'footwear',
    'headwear', 'dress', 'underwear', 'accessory', 'swimwear'
  ];

  const renderItem = ({ item }: { item: ClothingItem }) => (
    <ClothingCard
      _id={item._id}
      name={item.name}
      color={item.color}
      clothingType={item.clothingType}
      season={item.season}
      occasion={item.occasion}
      usedTimes={item.usedTimes}
      location={item.location}
      imageUrl={
        item.processedImage
          ? `${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/${item.processedImage.replace(/^\/+/, '')}`
          : undefined
      }
      iswashing={item.iswashing}
    />
  );

  const groupedItems = groupByType(clothingItems.filter(i => i.processedImage));

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >

        <UserProfile />

        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />

        {/* Filters */}
        <View style={[styles.row, { zIndex: 4000 }]}>
          <View style={[styles.dropdownBlock, { zIndex: 4000 }]}>
            <Text style={styles.label}>Season</Text>
            <Picker selectedValue={season} onValueChange={setSeason} style={styles.picker}>
              {seasonOptions.map(option => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
          <View style={[styles.dropdownBlock, { zIndex: 3000 }]}>
            <Text style={styles.label}>Occasion</Text>
            <Picker selectedValue={occasion} onValueChange={setOccasion} style={styles.picker}>
              {occasionOptions.map(option => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={[styles.row, { zIndex: 2000 }]}>
          <View style={[styles.dropdownBlock, { zIndex: 2000 }]}>
            <Text style={styles.label}>Type</Text>
            <Picker selectedValue={type} onValueChange={setType} style={styles.picker}>
              {typeOptions.map(option => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
          <View style={[styles.dropdownBlock, { zIndex: 1000 }]}>
            <Text style={styles.label}>Color</Text>
            <Picker selectedValue={color} onValueChange={setColor} style={styles.picker}>
              {colorOptions.map(option => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Closet</Text>

        {orderedTypes.map(type =>
          groupedItems[type]?.length ? (
            <View key={type} style={{ marginBottom: 20 }}>
              <Text style={styles.typeHeader}>{type.toUpperCase()}</Text>
              <FlatList
                ref={(ref) => {
                  if (ref) listRefs.current[type] = ref;
                }}
                data={groupedItems[type]}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              />
            </View>
          ) : null
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={22} color="white" />
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>

      <AddItemModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  itemName={itemName}
  setItemName={setItemName}
  itemImage={itemImage}
  setItemImage={setItemImage}
  pickImage={pickImage}
  locationPart={locationPart}
  setLocationPart={setLocationPart}
  storageType={storageType}
  setStorageType={setStorageType}
  locationParts={[
    { label: 'Top', value: 'top' },
    { label: 'Middle', value: 'middle' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
  ]}
  storageTypes={[
    { label: 'Shelf', value: 'shelf' },
    { label: 'Hanger', value: 'hanger' },
    { label: 'Drawer', value: 'drawer' },
  ]}
  isLoading={isLoading}
  onSave={async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
  
      if (!itemName || !locationPart || !storageType || !itemImage) return;
  
      const formData = new FormData();
      formData.append('name', itemName);
      formData.append('location', `${locationPart}-${storageType}`);
  
      const uriParts = itemImage.split('.');
      const fileType = uriParts[uriParts.length - 1].toLowerCase();
  
      formData.append('image', {
        uri: itemImage,
        name: `upload.${fileType}`,
        type: `image/${fileType}`,
      } as any);
  
      await axios.post(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/items`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => data,
      });
      fetchClothingItems();
      scrollRef.current?.scrollTo({ y: 0, animated: true });

      Object.values(listRefs.current).forEach((ref) => {
        ref?.scrollToOffset({ offset: 0, animated: true });
      });
      
  
      setModalVisible(false);
      fetchClothingItems();
      setItemName('');
      setItemImage(null);
      setLocationPart(null);
      setStorageType(null);
    } catch (error) {
      console.error('❌ Save error:', error);
    } finally {
      setIsLoading(false);
    }
  }}
/>

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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  dropdownBlock: { flex: 1, zIndex: 1 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  picker: {
    height: 52,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 18,
  },
  typeHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 6,
    color: '#000',
    textTransform: 'capitalize',
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
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },  
});
