import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
export default function PrimaryButton({ title, onPress, disabled }) {
  return (
    <TouchableOpacity style={[styles.btn, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
      <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btn: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: 'center', marginVertical: 8 },
  disabled: { opacity: 0.5 },
  txt: { color: '#00310f', fontWeight: '700', fontSize: 16 }
});
