import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

function getApiBase() {
  // iOS Simulator can use localhost; Android Emulator needs 10.0.2.2
  if (Platform.OS === 'android') return 'http://10.0.2.2:5050';
  return 'http://localhost:5050';
}

export default function App() {
  const [backend, setBackend] = useState<string>('loading...');

  useEffect(() => {
    const url = `${getApiBase()}/hello`;
    fetch(url)
      .then(r => r.json())
      .then(j => setBackend(j.message ?? 'ok'))
      .catch(() => setBackend('error'));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: '600' }}>Hello from Mobile</Text>
        <Text>Backend says: {backend}</Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
