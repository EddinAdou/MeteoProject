import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import Axios from 'axios';

export default function App() {
  const [location, setLocation] = useState(null);
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
      } catch (error) {
        setErrorMsg('Error fetching weather data');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ma position</Text>
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text style={styles.city}>{weatherData.name}</Text>
          <Text style={styles.temp}>{Math.round(weatherData.main.temp)}°C</Text>
          <Text style={styles.description}>{weatherData.weather[0].description}</Text>
          <Image
            source={{ uri: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png` }}
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
  {new Date(forecast.dt * 1000).toLocaleDateString('fr-FR', {weekday: 'long'}).charAt(0).toUpperCase() +
  new Date(forecast.dt * 1000).toLocaleDateString('fr-FR', {weekday: 'long'}).slice(1)},{' '}
  {new Date(forecast.dt * 1000).toLocaleTimeString('fr-FR', {hour: 'numeric'})}
</Text>


      <Image
        source={{ uri: `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png` }}
        style={styles.forecastIcon}
        resizeMode="contain"
      />
      <Text style={styles.forecastTemp}>{Math.round(forecast.main.temp)}°C</Text>
    </View>
  ))}
</ScrollView>


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e6e1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
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
    color:'#54565b',
  },
  weatherIcon: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },
  city:{
    fontSize: 27,
    fontWeight: "500",
    color: '#54565b'
  },
  description:{
    fontSize: 25,
    lineHeight: 35,
    textAlign: 'center',
    color:'#7a7c7f',
    fontWeight: 'bold',
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  forecastContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  forecastTime: {
    fontSize: 16,
    marginRight: 10,
  },
  forecastIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  forecastTemp: {
    fontSize: 16,
  },
  
});

