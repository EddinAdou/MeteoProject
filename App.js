import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, Image, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import Axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [loading, setLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

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

        const response = await Axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=02f3b877027f57eca803d14bdf6a603f&units=metric&lang=fr`);
        setWeatherData(response.data);
        const forecastResponse = await Axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=02f3b877027f57eca803d14bdf6a603f&units=metric&lang=fr`);
        setForecastData(forecastResponse.data.list);
        setLoading(false);
      } catch (error) {
        setErrorMsg('Error fetching weather data');
        setLoading(false);
      }
    })();
  }, []);

  return (
    <LinearGradient
      colors={['rgba(9,29,85,1)', 'rgba(0,0,0,1)']}
      style={styles.container}
    >
      <Text style={styles.title}>Ma position</Text>
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      {loading && (
        <ActivityIndicator size="large" color="#00ff00"/>
      )}
      
      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text style={styles.city}>{weatherData.name}</Text>
          <Text style={styles.temp}>{Math.round(weatherData.main.temp)}°C</Text>
          <Text style={styles.description}>{weatherData.weather[0].description}</Text>
          <Image
            source={{ uri: `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png` }}
            style={styles.weatherIcon}
            resizeMode="contain"
          />
        </View>
      )}

      <Text style={styles.forecastTitle}>Prévisions sur 5 jours</Text>
      <ScrollView vertical={true} contentContainerStyle={styles.forecastContainer}>
        {forecastData.map((forecast, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.forecastTime}>
              {new Date(forecast.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long' })
                .slice(0,1).toUpperCase() }{''}
              {new Date(forecast.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long' })
                .slice(1,3)}{' '}
              {new Date(forecast.dt * 1000).toLocaleTimeString('fr-FR', { hour: 'numeric' })}
            </Text>

            <Image
              source={{ uri: `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png` }}
              style={styles.forecastIcon}
              resizeMode="contain"
            />
            <Text style={styles.forecastTemp}>{Math.round(forecast.main.temp)}°C</Text>
          </View>
        ))}
      </ScrollView>
      
      <StatusBar style="auto" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    color: 'white',
    fontFamily: 'Georgia',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  weatherContainer: {
    alignItems: 'center',
  },
  temp: {
    fontSize: 80,
    marginBottom: 10,
    fontWeight: 'bold',
    color:'#fff',
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  city:{
    fontSize: 27,
    fontWeight: "500",
    color: '#fffe'
  },
  description:{
    fontSize: 25,
    lineHeight: 35,
    textAlign: 'center',
    color:'#7a7c9f',
    fontWeight: 'bold',
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
    color: '#f0f8ff',
  },
  forecastContainer: {
    marginTop: 10,
    paddingHorizontal: 40,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 9,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 8,
    elevation: 2,
  },
  forecastTime: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  forecastIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',

  },
});
