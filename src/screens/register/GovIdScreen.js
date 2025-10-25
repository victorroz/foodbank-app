import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PrimaryButton from '../../components/PrimaryButton';
import StepProgressBar from '../../components/StepProgressBar';
import useRegistrationStore from '../../store/registrationStore';

export default function GovIdScreen({ navigation }) {
  const { data, setField } = useRegistrationStore();

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaType.Images, quality: 0.7 });
    if (!res.canceled) setField('govIdUri', res.assets[0].uri);
  };

  const takePhoto = async () => {
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled) setField('govIdUri', res.assets[0].uri);
  };

  return (
    <View style={styles.wrap}>
      <StepProgressBar step={3} />
      {!!data.govIdUri && <Image source={{ uri: data.govIdUri }} style={styles.preview} />}
      <PrimaryButton title="Take Photo of ID" onPress={takePhoto} />
      <PrimaryButton title="Upload from Library" onPress={pickImage} />
      <PrimaryButton title="Continue" onPress={() => navigation.navigate('Selfie')} disabled={Boolean(!data.govIdUri)} />
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1, padding: 20 }, preview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 } });
