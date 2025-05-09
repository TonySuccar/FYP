import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { CONFIG } from '../config';

export default function WeatherForecastList() {
  const [forecast, setForecast] = useState<any[]>([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const { coords } = await Location.getCurrentPositionAsync({});
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${CONFIG.OPEN_WEATHER_API_KEY}`;
        const res = await axios.get(url);

        const grouped: { [key: string]: any[] } = {};
        res.data.list.forEach((entry: any) => {
          const date = entry.dt_txt.split(' ')[0];
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(entry);
        });

        const daily = Object.keys(grouped).slice(1, 8).map((date) => {
          const items = grouped[date];
          const avgTemp =
            items.reduce((sum, curr) => sum + curr.main.temp, 0) / items.length;
            const rawIcon = items[0].weather[0].icon;
            const icon = rawIcon.replace('n', 'd'); // force daytime variant
            


          return { date, avgTemp, icon };
        });

        setForecast(daily);
      } catch (err) {
        console.warn('❌ Failed to fetch forecast:', err);
      }
    };

    fetchForecast();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const date = new Date(item.date);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });

    return (
      <View style={styles.card}>
        <Text style={styles.day}>{weekday}</Text>
        <Image
            source={{ uri: `https://openweathermap.org/img/wn/${item.icon}@2x.png` }}
            style={styles.icon}
        />

        <Text style={styles.temp}>{Math.round(item.avgTemp)}°C</Text>
      </View>
    );
  };

  return (
    <FlatList
      horizontal
      data={forecast}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  card: {
    alignItems: 'center',
    marginRight: 14,
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    width: 72,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  day: {
    color: '#e0e0e0',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  icon: {
    width: 40,
    height: 40,
  },
  temp: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '600',
  },
});
