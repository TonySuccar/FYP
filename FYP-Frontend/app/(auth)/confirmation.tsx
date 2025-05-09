import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import {CONFIG} from "../../config";

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email;
  const [otp, setOtp] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry2, setSecureTextEntry2] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    const parsedAge = parseInt(age, 10);

    if (!otp.trim()) {
      Alert.alert('Validation Error', 'Please enter the OTP.');
      return;
    }

    if (!age || isNaN(parsedAge) || parsedAge < 18 || parsedAge > 120) {
      Alert.alert('Validation Error', 'Please enter a valid age (18+).');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Validation Error', 'Password should be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      console.log(`Confirming email: ${email}`);

      // Send request to confirm account
      const response = await axios.post(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/auth/confirm`, {
        email,
        password,
        age: parsedAge,
        otp,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Account successfully created!');
        router.push('/login'); // ✅ Redirect to login page
      } else {
        Alert.alert('Error', 'Failed to confirm. Please try again.');
      }
    }catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverMessage = error.response.data.message;
        const alertMessage = Array.isArray(serverMessage)
          ? serverMessage.join('\n')
          : String(serverMessage);
    
        Alert.alert('Error', alertMessage || 'Confirmation failed.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 60 : 0}
      >
        <View style={styles.container}>
          <Image source={require('../../assets/images/images.png')} style={styles.illustration} resizeMode="contain" />
          <Text style={styles.title}>Confirm Account</Text>

          {/* OTP Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="Enter OTP"
              placeholderTextColor="#999"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          {/* Age Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="Age"
              placeholderTextColor="#999"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <Ionicons name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'} size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureTextEntry2}
              style={styles.input}
            />
              <TouchableOpacity onPress={() => setSecureTextEntry2(!secureTextEntry2)}>
              <Ionicons name={secureTextEntry2 ? 'eye-off-outline' : 'eye-outline'} size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmButtonText}>Confirm</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,    backgroundColor:'#FFF' },
  illustration: { width: 220, height: 180, marginBottom: 20, alignSelf: 'center' },
  title: { fontSize: 26, fontWeight: '600', marginBottom: 24 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor:'#FFF'
  },
  icon: { marginRight: 8, color: '#666' },
  input: { flex: 1, fontSize: 16, color: '#000' },
  confirmButton: { backgroundColor: 'black', paddingVertical: 14, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 16 },
  confirmButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

