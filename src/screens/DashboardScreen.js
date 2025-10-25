import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '../theme';

export default function DashboardScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={[fonts.h2, styles.h2]}>Welcome!</Text>
      <Text>Your registration is being verified. Local services will appear here.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  h2: { marginBottom: 8 }
});
