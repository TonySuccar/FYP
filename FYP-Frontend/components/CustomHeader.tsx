import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';

const CustomHeader = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/images.png')} // Update this path to your actual logo
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Smart Wardrobe</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    paddingVertical: 2,
  },
  logo: {
    width: 55,
    height: 55,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CustomHeader;
