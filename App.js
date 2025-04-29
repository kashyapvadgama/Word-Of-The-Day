import { StatusBar } from 'expo-status-bar';
import {  StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './Screens/Tabs';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider >
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Tabs/>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
