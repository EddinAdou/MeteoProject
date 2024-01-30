import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, Image } from 'react-native';
import * as Location from 'expo-location';
import Axios from 'axios';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location is required!');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const response = await Axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=02f3b877027f57eca803d14bdf6a603f&units=metric`);
        setWeatherData(response.data);
      } catch (error) {
        setErrorMsg('Error fetching weather data');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Current</Text>
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>{weatherData.name}</Text>
          <Text style={styles.weatherText}>{Math.round(weatherData.main.temp)}°C</Text>
          <Text style={styles.weatherText}>{weatherData.weather[0].description}</Text>
          <Image
            source={{ uri: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png` }}
            style={styles.weatherIcon}
          />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  weatherContainer: {
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 10,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
});
