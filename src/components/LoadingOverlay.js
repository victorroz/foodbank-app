import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
export default function LoadingOverlay({ visible }) {
  if (!visible) return null;
  return (
    <View style={styles.backdrop}>
      <ActivityIndicator size="large" />
    </View>
  );
}
const styles = StyleSheet.create({
  backdrop: { position: 'absolute', left:0, right:0, top:0, bottom:0, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.15)', zIndex: 999 }
});
