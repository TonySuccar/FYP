import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Animated } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CONFIG } from '../config';

type WeatherData = {
  temp: number;
  icon: string;
  main: string;
};

export default function WeatherBar() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reminderText, setReminderText] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location access denied');
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${CONFIG.OPEN_WEATHER_API_KEY}`;
        const res = await axios.get(url);

        const {
          main: { temp },
          weather: [{ icon, main }],
        } = res.data;

        const data: WeatherData = { temp, icon, main };
        setWeather(data);

        const season = inferSeason(temp);
        await AsyncStorage.setItem('preferredSeason', season); // ✅ Save season only
        applyReminder(main, temp);
      } catch (err) {
        setError('Failed to load weather');
      }
    };

    (async () => {
      const cached = await AsyncStorage.getItem('preferredSeason');
      if (cached) {
        console.log('Loaded cached season:', cached);
      }
      await fetchWeather();
    })();

    interval = setInterval(fetchWeather, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const inferSeason = (temp: number): string => {
    if (temp >= 27) return 'summer wear';
    if (temp >= 20) return 'summer wear';
    if (temp >= 12) return 'winter wear';
    return 'winter wear';
  };

  const applyReminder = (main: string, temp: number) => {
    const lowerMain = main.toLowerCase();
    let reminder = null;

    if (['rain', 'drizzle', 'thunderstorm'].includes(lowerMain)) {
      reminder = '☔ Bring an umbrella';
    } else if (lowerMain === 'clouds' && temp < 18) {
      reminder = '🧥 A bit chilly today';
    }

    if (reminder) {
      setReminderText(reminder);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else {
      setReminderText(null);
      fadeAnim.setValue(0);
    }
  };

  if (!weather && !error) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#aaa" size="small" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          style={styles.icon}
          source={{ uri: `https://openweathermap.org/img/wn/${weather!.icon}@2x.png` }}
        />
        <Text style={styles.text}>
          {weather!.main} • {Math.round(weather!.temp)}°C
        </Text>
      </View>

      {reminderText && (
        <Animated.Text style={[styles.reminder, { opacity: fadeAnim }]}>
          {reminderText}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 0.3,
    borderBottomColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 36,
    height: 36,
  },
  text: {
    fontSize: 16,
    color: '#e0e0e0',
    letterSpacing: 0.3,
  },
  errorText: {
    fontSize: 13,
    color: '#ff5c5c',
  },
  reminder: {
    marginTop: 4,
    fontSize: 13,
    color: '#cfcfcf',
    fontStyle: 'italic',
  },
});
