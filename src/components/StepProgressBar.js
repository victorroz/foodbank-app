import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
export default function StepProgressBar({ step, total = 7 }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        return <View key={idx} style={[styles.dot, idx <= step ? styles.active : styles.inactive]} />;
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, marginVertical: 10 },
  dot: { flex: 1, height: 6, borderRadius: 3 },
  active: { backgroundColor: colors.primary },
  inactive: { backgroundColor: '#e5e5e5' }
});
