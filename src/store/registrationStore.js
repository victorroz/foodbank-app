import { create } from 'zustand';

const initial = {
  firstName: '', lastName: '', email: '', phone: '', password: '',
  dob: '', householdSize: '',
  userId: '',
  otp: '',
  govIdUri: '', selfieUri: '',
  address1: '', city: '', province: '', postalCode: '',
  consentMarketing: false, consentData: false
};

const BOOLEAN_FIELDS = new Set(['consentMarketing', 'consentData']);

const normalizeValue = (key, value) => (
  BOOLEAN_FIELDS.has(key) ? (value === true) : value
);

const useRegistrationStore = create((set) => ({
  data: { ...initial },
  setField: (key, value) => set((state) => ({
    data: { ...state.data, [key]: normalizeValue(key, value) }
  })),
  reset: () => set({ data: { ...initial } })
}));

export default useRegistrationStore;
