import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CONFIG } from '../config';

type Props = {
  onSettingsPress?: () => void;
};

export default function UserProfile({ onSettingsPress }: Props) {
  const [name, setName] = useState('...');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const defaultAvatar = require('../assets/images/profile.jpg');

  const fetchProfile = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const res = await axios.get(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setName(res.data.name);
      setProfileImageUrl(res.data.profileImageUrl || null);
    } catch (error) {
      console.error('⚠️ Failed to fetch user data in UserProfile:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  return (
    <View style={styles.container}>
      <Image
        source={profileImageUrl ? { uri: `${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/${profileImageUrl.replace(/\\/g, '/')}` } : defaultAvatar}
        style={styles.avatar}
      />
      <Text style={styles.username}>{name}'s Wardrobe</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ccc',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});
