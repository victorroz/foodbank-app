import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { fonts } from '../theme';

export default function DonorScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={[fonts.h2, { marginBottom: 8 }]}>Donate</Text>
      <Text style={{ marginBottom: 12 }}>Thank you for supporting the local food bank.</Text>
      <PrimaryButton title="Donate Money" onPress={() => Linking.openURL('https://donate.example.org')} />
      <PrimaryButton title="Offer Food Pickup" onPress={() => Linking.openURL('mailto:donations@example.org?subject=Food%20Donation')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20 }
});
