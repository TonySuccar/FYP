import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { CONFIG } from '../config';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ClothingDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    _id,
    name: initialName = '',
    color = '',
    clothingType = '',
    imageUrl,
    season: initialSeason = '',
    occasion: initialOccasion = '',
    usedTimes = '0',
    location: initialLocation = '',
    iswashing = false,
  } = params;

  const positionOptions = ['Top', 'Middle', 'Bottom', 'Left', 'Right'];
  const storageOptions = ['Shelf', 'Hanger', 'Drawer'];

  let initialPosition = 'Top';
  let initialStorage = 'Shelf';

  const capitalize = (s: string) =>
    s.trim().charAt(0).toUpperCase() + s.trim().slice(1).toLowerCase();
  
  if (typeof initialLocation === 'string' && initialLocation.includes('-')) {
    const [pos, storage] = initialLocation.split('-');
    const normalizedPos = capitalize(pos);
    const normalizedStorage = capitalize(storage);
  
    if (positionOptions.includes(normalizedPos)) initialPosition = normalizedPos;
    if (storageOptions.includes(normalizedStorage)) initialStorage = normalizedStorage;
  }
  

  const [name, setName] = useState(initialName);
  const [season, setSeason] = useState(initialSeason);
  const [occasion, setOccasion] = useState(initialOccasion);
  const [position, setPosition] = useState(initialPosition);
  const [storageType, setStorageType] = useState(initialStorage);
  const [editing, setEditing] = useState(false);
  const [currentUsedTimes, setCurrentUsedTimes] = useState(Number(usedTimes));
  const [isWashingBool, setIsWashingBool] = useState(typeof iswashing === 'string' && iswashing === 'true');


  const toggleEdit = () => setEditing((prev) => !prev);

  const handleSave = async () => {
    const updatedLocation = `${position}-${storageType}`;
    try {
      const token = await AsyncStorage.getItem('accessToken');
  
      if (!token) {
        Alert.alert('Unauthorized', 'You must be logged in.');
        return;
      }
  
      await axios.patch(
        `${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/items/${_id}`,
        {
          name,
          season,
          occasion,
          location: updatedLocation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      Alert.alert('Success', 'Item updated successfully.');
      setEditing(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Update error:', error.response?.data || error.message);
      } else {
        console.error('Update error:', error);
      }
      Alert.alert('Error', 'Failed to update item.');
    }
  };
  const handleDelete = async () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('accessToken');
              if (!token) {
                Alert.alert('Unauthorized', 'You must be logged in.');
                return;
              }
  
              await axios.delete(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/items/${_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
  
              Alert.alert('Deleted', 'Item was deleted successfully.');
              router.replace('/(tabs)/browse'); // ← example
 // Go back to previous screen
            } catch (error) {
              if (axios.isAxiosError(error)) {
                console.error('Delete error:', error.response?.data || error.message);
              } else {
                console.error('Delete error:', error);
              }
              Alert.alert('Error', 'Failed to delete item.');
            }
          },
        },
      ]
    );
  };
  

  const handleWash = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
  
      if (!token) {
        Alert.alert('Unauthorized', 'You must be logged in.');
        return;
      }
  
      await axios.post(
        `${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/items/${_id}/wash`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setCurrentUsedTimes(0);
      setIsWashingBool(true);

      Alert.alert('Item is washing', 'Usage count reset.');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message;
  
        if (msg === 'Item is already being washed') {
          Alert.alert('Already Washing', 'This item is already in the washing process.');
        } else {
          console.error('Wash error:', error.response?.data || error.message);
          Alert.alert('Error', msg || 'Failed to mark item as washed.');
        }
      } else {
        console.error('Wash error:', error);
        Alert.alert('Error', 'Failed to mark item as washed.');
      }
    }
  };
  

  const fullLocation = `${position}-${storageType}`;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { flexGrow: 1 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={imageUrl ? { uri: imageUrl as string } : require('../assets/images/images.png')}
          style={styles.image}
        />

        {editing ? (
          <>
            <View style={styles.inputWrapper}>
              <Text style={styles.pickerLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={Array.isArray(name) ? name.join(', ') : name}
                onChangeText={setName}
                placeholder="Item name"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.pickerLabel}>Season</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={season} onValueChange={setSeason} style={styles.picker}>
                  <Picker.Item label="Summer Wear" value="summer wear" />
                  <Picker.Item label="Winter Wear" value="winter wear" />
                  <Picker.Item label="Spring Wear" value="spring wear" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.pickerLabel}>Occasion</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={occasion} onValueChange={setOccasion} style={styles.picker}>
                  <Picker.Item label="Sports Wear" value="sports wear" />
                  <Picker.Item label="Casual Wear" value="casual wear" />
                  <Picker.Item label="Formal Wear" value="formal wear" />
                  <Picker.Item label="All Rounder" value="all rounder" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.pickerLabel}>Location - Position</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={position} onValueChange={setPosition} style={styles.picker}>
                  {positionOptions.map((opt) => (
                    <Picker.Item key={opt} label={opt} value={opt} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.pickerLabel}>Location - Storage Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={storageType}
                  onValueChange={setStorageType}
                  style={styles.picker}
                >
                  {storageOptions.map((opt) => (
                    <Picker.Item key={opt} label={opt} value={opt} />
                  ))}
                </Picker>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>{name || 'Unavailable'}</Text>
            <Text style={styles.info}>Type: {clothingType || 'N/A'}</Text>
            <Text style={styles.info}>Color: {color || 'N/A'}</Text>
            <Text style={styles.info}>Season: {season || 'N/A'}</Text>
            <Text style={styles.info}>Occasion: {occasion || 'N/A'}</Text>
            <Text style={styles.info}>Used Times: {currentUsedTimes}</Text>
            <Text style={styles.info}>Location: {fullLocation.replace('-', ' - ')}</Text>
            <Text style={styles.info}>Is Washing: {isWashingBool ? 'Yes' : 'No'}</Text>
          </>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={editing ? handleSave : toggleEdit}>
            <Text style={styles.buttonText}>{editing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, editing ? styles.cancelButton : styles.washButton]}
            onPress={editing ? toggleEdit : handleWash}
          >
            <Text style={styles.buttonText}>{editing ? 'Cancel' : 'Wash'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
  <Text style={styles.buttonText}>Delete</Text>
</TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#cccccc', // light grey background
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#ffffff', // white fallback for image
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#333333',
  },
  info: {
    fontSize: 15,
    color: '#444444',
    marginBottom: 7,
    textAlign: 'left',
    marginLeft: 30,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    padding: 10,
    fontSize: 16,
    backgroundColor: '#eeeeee',
    color: '#222222',
    borderWidth: 1,
    borderColor: '#bbbbbb',
    borderRadius: 8,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#222222',
    marginBottom: 6,
  },
  pickerContainer: {
    backgroundColor: '#eeeeee',
    borderColor: '#bbbbbb',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#222222',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12, // works in React Native 0.71+
    marginTop: 24,
  },
  
  button: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 2, // 👈 consistent margin instead of marginRight
  },
  
  washButton: {
    backgroundColor: '#777',
  },
  cancelButton: {
    backgroundColor: '#b00020',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#b00020',
    marginTop: 16,
  },  
});
