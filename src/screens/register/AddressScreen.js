import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import StepProgressBar from '../../components/StepProgressBar';
import useRegistrationStore from '../../store/registrationStore';
import { addressSchema } from '../../utils/validation';
import { registerLocation } from '../../utils/api';

export default function AddressScreen({ navigation }) {
  const { data, setField } = useRegistrationStore();

  return (
    <View style={styles.wrap}>
      <StepProgressBar step={5} />
      <Formik
        initialValues={{ address1: data.address1, city: data.city || 'Regina', province: data.province || 'SK', postalCode: data.postalCode }}
        validationSchema={addressSchema}
        onSubmit={async (values) => {
          Object.entries(values).forEach(([k,v]) => setField(k, v));
          await registerLocation({ userId: data.userId, geo: { type:'Point', coordinates: [-104.6189, 50.4452] } });
          navigation.navigate('Consent');
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
          <>
            <FormTextInput label="Address" value={values.address1} onChangeText={handleChange('address1')} onBlur={handleBlur('address1')} error={touched.address1 && errors.address1} />
            <FormTextInput label="City" value={values.city} onChangeText={handleChange('city')} onBlur={handleBlur('city')} error={touched.city && errors.city} />
            <FormTextInput label="Province" value={values.province} onChangeText={handleChange('province')} onBlur={handleBlur('province')} error={touched.province && errors.province} />
            <FormTextInput label="Postal Code" autoCapitalize="characters" value={values.postalCode} onChangeText={handleChange('postalCode')} onBlur={handleBlur('postalCode')} error={touched.postalCode && errors.postalCode} />
            <PrimaryButton title="Continue" onPress={handleSubmit} disabled={Boolean(!isValid)} />
          </>
        )}
      </Formik>
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1, padding: 20 } });
