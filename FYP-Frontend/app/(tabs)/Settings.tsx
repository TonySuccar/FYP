import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { CONFIG } from '../../config';

export default function Settings() {
  const [washingTime, setWashingTime] = useState(''); // As string for TextInput
  const [user, setUser] = useState<{ name: string; email: string; profileImageUrl?: string ; washingtime:number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const res = await axios.get(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setName(res.data.name);
      setWashingTime(res.data.washingtime?.toString() || '');
    } catch (err) {
      Alert.alert('Error', 'Could not load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setNewImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
  
      const formData = new FormData();
  
      const nameChanged = name && name !== user?.name;
      const imageChanged = !!newImageUri;
      const washingTimeChanged =
        washingTime && parseInt(washingTime) !== user?.washingtime;
  
      if (!nameChanged && !imageChanged && !washingTimeChanged) {
        Alert.alert('No changes', 'No data was changed.');
        return;
      }
  
      if (nameChanged) formData.append('name', name);
  
      if (washingTimeChanged) {
        const time = parseInt(washingTime);
        if (isNaN(time) || time < 0) {
          Alert.alert('Invalid Input', 'Washing time must be a positive number.');
          return;
        }
        formData.append('washingtime', time.toString());
      }
  
      if (imageChanged && newImageUri) {
        const ext = newImageUri.split('.').pop();
        formData.append('image', {
          uri: newImageUri,
          name: `profile.${ext}`,
          type: `image/${ext}`,
        } as any);
      }
  
      await axios.patch(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/user/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      Alert.alert('Success', 'Profile updated.');
      setEditing(false);
      setNewImageUri(null);
      fetchProfile();
    } catch (err) {
      console.error('Update failed:', err);
      Alert.alert('Error', 'Failed to update.');
    }
  };
  

  const handleCancel = () => {
    if (user) {
      setName(user.name);
      setNewImageUri(null);
      setEditing(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    router.replace('/(auth)/login');
  };

  const handleChangePassword = () => {
    router.push('/ChangePassword'); // Route you’ll implement with OTP flow
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No user data found.</Text>
      </View>
    );
  }

  const imageToDisplay = newImageUri
    ? { uri: newImageUri }
    : user.profileImageUrl
    ? { uri: `${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/${user.profileImageUrl.replace(/\\/g, '/')}` }
    : require('./../../assets/images/profile.jpg');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={imageToDisplay} style={styles.profileImage} />
        {editing && (
          <TouchableOpacity onPress={handleImagePick}>
            <Text style={styles.linkText}>Change Profile Image</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        editable={editing}
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Washing Time</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={washingTime}
          onChangeText={setWashingTime}
        />
      ) : (
        <Text style={styles.value}>
          {user.washingtime ? `${user.washingtime} day${user.washingtime > 1 ? 's' : ''}` : 'Not set'}
        </Text>
      )}



      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{user.email}</Text>

      {editing ? (
        <View style={styles.rowButtons}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.logoutText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.logoutText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
          <Text style={styles.logoutText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.editButton} onPress={handleChangePassword}>
        <Text style={styles.logoutText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    height: '100%',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  linkText: {
    color: '#000',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginTop: 16,
  },
  value: {
    fontSize: 18,
    color: '#000',
    marginTop: 4,
    marginBottom: 14,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 12,
    color: '#000',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#00796b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#b00020',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#999',
    fontSize: 16,
  },
});
