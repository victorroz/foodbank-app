import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PrimaryButton from '../../components/PrimaryButton';
import StepProgressBar from '../../components/StepProgressBar';
import useRegistrationStore from '../../store/registrationStore';

export default function SelfieScreen({ navigation }) {
  const { data, setField } = useRegistrationStore();

  const takeSelfie = async () => {
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7, cameraType: ImagePicker.CameraType.front });
    if (!res.canceled) setField('selfieUri', res.assets[0].uri);
  };

  return (
    <View style={styles.wrap}>
      <StepProgressBar step={4} />
      {!!data.selfieUri && <Image source={{ uri: data.selfieUri }} style={styles.preview} />}
      <PrimaryButton title="Take Selfie" onPress={takeSelfie} />
      <PrimaryButton title="Continue" onPress={() => navigation.navigate('Address')} disabled={Boolean(!data.selfieUri)} />
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1, padding: 20 }, preview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 } });
