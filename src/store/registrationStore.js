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

// Normalize potentially string/number inputs to strict booleans for known boolean fields
const toBoolean = (value) => {
  if (value === true || value === false) return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === 'true' || v === '1' || v === 'yes' || v === 'y') return true;
    if (v === 'false' || v === '0' || v === 'no' || v === 'n') return false;
  }
  if (typeof value === 'number') return value !== 0;
  return Boolean(value);
};

const normalizeValue = (key, value) => (
  BOOLEAN_FIELDS.has(key) ? toBoolean(value) : value
);

const useRegistrationStore = create((set) => ({
  data: { ...initial },
  setField: (key, value) => set((state) => ({
    data: { ...state.data, [key]: normalizeValue(key, value) }
  })),
  reset: () => set({ data: { ...initial } })
}));

export default useRegistrationStore;
