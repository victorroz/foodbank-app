import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
export default function FormTextInput({ label, error, ...props }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput style={[styles.input, !!error && styles.errorBorder]} placeholderTextColor="#9aa0a6" {...props} />
      {!!error && <Text style={styles.err}>{error}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  errorBorder: { borderColor: colors.danger },
  err: { color: colors.danger, marginTop: 4 }
});
