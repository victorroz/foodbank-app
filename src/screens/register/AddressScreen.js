import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { Formik } from 'formik';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import StepProgressBar from '../../components/StepProgressBar';
import useRegistrationStore from '../../store/registrationStore';
import { addressSchema } from '../../utils/validation';
import { registerLocation } from '../../utils/api';

export default function AddressScreen({ navigation }) {
  const { data, setField } = useRegistrationStore();
  const [locating, setLocating] = useState(false);
  const [locationOk, setLocationOk] = useState(Boolean(data.city && data.province));
  const [coords, setCoords] = useState(null);

  const serviceRules = useMemo(() => ({
    city: Constants.expoConfig?.extra?.SERVICE_CITY || 'Regina',
    region: Constants.expoConfig?.extra?.SERVICE_REGION || 'SK',
    countryIso: Constants.expoConfig?.extra?.SERVICE_COUNTRY_ISO || 'CA'
  }), []);

  const useMyLocation = async (onFormChange) => {
    try {
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location required', 'Please allow location access to continue.');
        setLocationOk(false);
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.Balanced });
      const { latitude, longitude } = position.coords;
      setCoords({ latitude, longitude });
      const places = await Location.reverseGeocodeAsync({ latitude, longitude });
      const place = places?.[0];
      const iso = place?.isoCountryCode;
      const city = place?.city || place?.subregion || '';
      const region = place?.region || '';
      const postalCode = place?.postalCode || '';
      const streetLine = [place?.name, place?.street].filter(Boolean).join(' ');

      const inCountry = iso?.toUpperCase() === serviceRules.countryIso;
      const inCity = city?.toLowerCase() === serviceRules.city.toLowerCase();
      const inRegion = region?.toLowerCase() === serviceRules.region.toLowerCase();

      if (!inCountry || !inCity || !inRegion) {
        setLocationOk(false);
        Alert.alert('Out of service area', `This app currently serves ${serviceRules.city}, ${serviceRules.region}, ${serviceRules.countryIso} only.`);
      } else {
        setLocationOk(true);
      }

      // Populate form + store regardless so user can see and edit
      onFormChange('address1')(streetLine);
      onFormChange('city')(city);
      onFormChange('province')(region);
      onFormChange('postalCode')(postalCode);
      setField('address1', streetLine);
      setField('city', city);
      setField('province', region);
      setField('postalCode', postalCode);
    } catch (e) {
      setLocationOk(false);
      Alert.alert('Location error', 'Unable to get your location. Try again.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <StepProgressBar step={5} />
      <Formik
        initialValues={{ address1: data.address1, city: data.city || 'Regina', province: data.province || 'SK', postalCode: data.postalCode }}
        validationSchema={addressSchema}
        onSubmit={async (values) => {
          if (!locationOk || !coords) {
            Alert.alert('Location required', 'Please tap "Use my location" to verify you are in the service area.');
            return;
          }
          Object.entries(values).forEach(([k,v]) => setField(k, v));
          await registerLocation({ userId: data.userId, geo: { type:'Point', coordinates: [coords.longitude, coords.latitude] } });
          navigation.navigate('Consent');
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, setFieldValue }) => (
          <>
            <View style={{ marginBottom: 8 }}>
              <PrimaryButton title={locating ? 'Locating…' : 'Use my location'} onPress={() => useMyLocation((k) => (v) => setFieldValue(k, v))} disabled={locating} />
              {!locationOk && (
                <Text style={styles.errMsg}>Location not verified. You must be in {serviceRules.city}, {serviceRules.region}, {serviceRules.countryIso}.</Text>
              )}
            </View>
            <FormTextInput label="Address" value={values.address1} onChangeText={handleChange('address1')} onBlur={handleBlur('address1')} error={touched.address1 && errors.address1} />
            <FormTextInput label="City" value={values.city} onChangeText={handleChange('city')} onBlur={handleBlur('city')} error={touched.city && errors.city} />
            <FormTextInput label="Province" value={values.province} onChangeText={handleChange('province')} onBlur={handleBlur('province')} error={touched.province && errors.province} />
            <FormTextInput label="Postal Code" autoCapitalize="characters" value={values.postalCode} onChangeText={handleChange('postalCode')} onBlur={handleBlur('postalCode')} error={touched.postalCode && errors.postalCode} />
            <PrimaryButton title="Continue" onPress={handleSubmit} disabled={Boolean(!isValid || !locationOk || locating)} />
          </>
        )}
      </Formik>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  errMsg: { color: '#e33', marginTop: 8 }
});
