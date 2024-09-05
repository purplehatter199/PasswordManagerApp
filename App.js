import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [password, setPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');

  useEffect(() => {
    // Fetch the stored hashed password when the app loads
    const fetchStoredPassword = async () => {
      try {
        const storedPassword = await AsyncStorage.getItem('hashedPassword');
        if (storedPassword !== null) {
          setHashedPassword(storedPassword);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load the password');
      }
    };

    fetchStoredPassword();
  }, []);

  const handleSavePassword = async () => {
    try {
      // Hash the password using expo-crypto
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      setHashedPassword(hash);

      // Save the hashed password in AsyncStorage
      await AsyncStorage.setItem('hashedPassword', hash);
      Alert.alert('Password Saved', 'Your password has been hashed and saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save the password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Manager</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Save Password" onPress={handleSavePassword} />
      {hashedPassword ? (
        <Text style={styles.savedPassword}>
          Hashed Password: {hashedPassword}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
  },
  savedPassword: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});
