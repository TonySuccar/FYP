import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import {CONFIG} from "../../config"
// import { API_URL } from '@env'; // ✅ Use API from .env

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter an email address.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);

      // Convert email to lowercase before sending to backend
      const response = await axios.post(`${CONFIG.API_URL}:${CONFIG.AUTH_PORT}/auth/signup`, {
        email: email.trim().toLowerCase(),
        name: name.trim(),
      });

      // If signup is successful, redirect to OTP confirmation page
      if (response.status === 201) {
        router.push(`/confirmation?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      } else {
        Alert.alert('Error', 'Failed to sign up. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Error', error.response.data.message || 'Signup failed.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.container}>
          {/* Illustration */}
          <Image source={require('../../assets/images/images.png')} style={styles.illustration} resizeMode="contain" />

          {/* Title */}
          <Text style={styles.title}>Sign Up</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton} onPress={handleSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.continueButtonText}>Continue</Text>}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#fff',
  },
  icon: { marginRight: 8, color: '#666' },
  input: { flex: 1, fontSize: 16, color: '#000' },
  continueButton: { backgroundColor: 'black', paddingVertical: 14, borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 16 },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loginLinkContainer: { flexDirection: 'row', alignItems: 'center' },
  loginText: { fontSize: 14, color: '#000' },
  loginLink: { fontSize: 14, color: 'black', fontWeight: '600' },
});

