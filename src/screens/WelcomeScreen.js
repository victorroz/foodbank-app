import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { fonts } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.wrap}>
      <Text style={[fonts.h1, styles.h1]}>Regina FoodBank</Text>
      <Text style={styles.p}>Register to access local hampers, hours, and donation pickup slots.</Text>
      <PrimaryButton title="I'm a Recipient" onPress={() => navigation.navigate('RegisterFlow')} />
      <PrimaryButton title="I'm a Donor" onPress={() => navigation.navigate('Donor')} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 20 },
  h1: { marginBottom: 10 },
  p: { color: '#444', marginBottom: 20 }
});
