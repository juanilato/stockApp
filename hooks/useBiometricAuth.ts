import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const CREDENTIALS_KEY = 'biometric_credentials';

export function useBiometricAuth() {
  const isAvailable = async () => {
    return await LocalAuthentication.hasHardwareAsync();
  };

  const isEnrolled = async () => {
    return await LocalAuthentication.isEnrolledAsync();
  };

  const authenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticarse con biometría',
      fallbackLabel: 'Ingresar contraseña',
    });
    console.log('🔍 Resultado completo de authenticateAsync:', result);
    return result.success;
  };

  const enableBiometricAuth = async (email: string, password: string) => {
    await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify({ email, password }));
  };

  const disableBiometricAuth = async () => {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
  };

  const getStoredCredentials = async (): Promise<{ email: string; password: string } | null> => {
    const data = await SecureStore.getItemAsync(CREDENTIALS_KEY);
    return data ? JSON.parse(data) : null;
  };

  const isBiometricEnabled = async () => {
    const creds = await getStoredCredentials();
    return !!creds;
  };

  const getBiometricTypeText = async () => {
  const type = await LocalAuthentication.supportedAuthenticationTypesAsync();
  if (type.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return 'Face ID';
  if (type.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return 'Huella digital';
  return 'Biometría';
};


  return {
    isAvailable,
    isEnrolled,
    authenticate,
    enableBiometricAuth,
    disableBiometricAuth,
    getStoredCredentials,
    isBiometricEnabled,
    getBiometricTypeText
  };
}
