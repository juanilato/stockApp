import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FloatingLabelInput from '../components/FloatingLabel';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: 'oauth_apple' });
  const router = useRouter();

  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'ventasapp' });

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      await signUp.create({ emailAddress, password, username });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/');
      } else {
        setError(`Verificación incompleta. Estado: ${completeSignUp.status}`);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Error al verificar código');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (startOAuth: any, provider: string) => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const { createdSessionId, setActive } = await startOAuth({ redirectUrl: redirectUri });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/');
      } else {
        setError(`No se pudo registrar con ${provider}`);
      }
    } catch (err: any) {
      if (err?.errors?.[0]?.message?.includes('already')) {
        setError(`Ya existe una cuenta con este método. Intenta iniciar sesión.`);
      } else {
        setError(`Error al registrar con ${provider}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        </View>

        <View style={styles.card}>
          {!pendingVerification ? (
            <>
              <Text style={styles.title}>Crear cuenta</Text>
              <Text style={styles.subtitle}>Registrate para empezar</Text>

              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={[styles.socialButton, loading && styles.disabled]}
                  onPress={() => handleOAuth(startGoogleOAuth, 'Google')}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <AntDesign name="google" size={18} color="#000" />
                  <Text style={styles.socialText}>Continuar con Google</Text>
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[styles.socialButton, styles.apple, loading && styles.disabled]}
                    onPress={() => handleOAuth(startAppleOAuth, 'Apple')}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    <FontAwesome name="apple" size={18} color="#fff" />
                    <Text style={[styles.socialText, styles.appleText]}>Continuar con Apple</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>o registrarse con email</Text>
                <View style={styles.divider} />
              </View>

              <FloatingLabelInput label="Nombre de usuario" value={username} onChangeText={setUsername} autoCapitalize="none" />
              <FloatingLabelInput label="Correo electrónico" value={emailAddress} onChangeText={setEmailAddress} keyboardType="email-address" autoCapitalize="none" />
              <FloatingLabelInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password-new" />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity style={[styles.button, loading && styles.disabled]} onPress={onSignUpPress} disabled={loading} activeOpacity={0.85}>
                <Text style={styles.buttonText}>{loading ? 'Creando cuenta...' : 'Registrarse'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>Verifica tu email</Text>
              <Text style={styles.subtitle}>Ingresa el código que te enviamos</Text>

              <FloatingLabelInput label="Código de verificación" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity style={[styles.button, loading && styles.disabled]} onPress={onVerifyPress} disabled={loading} activeOpacity={0.85}>
                <Text style={styles.buttonText}>{loading ? 'Verificando...' : 'Verificar'}</Text>
              </TouchableOpacity>
            </>
          )}

          <Link href="/login" asChild>
            <Pressable style={styles.footerLink}>
              <Text style={styles.footerText}>¿Ya tenés cuenta? <Text style={styles.footerAccent}>Iniciá sesión</Text></Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 80, height: 80, borderRadius: 20, resizeMode: 'contain' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  title: { fontSize: 26, fontWeight: '700', color: '#111', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#6b7280', marginBottom: 20, textAlign: 'center' },
  socialContainer: { marginBottom: 16 },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  socialText: { marginLeft: 12, fontWeight: '600', fontSize: 15 },
  apple: { backgroundColor: '#000', borderColor: '#000' },
  appleText: { color: '#fff' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#9ca3af',
    fontSize: 13,
  },
  error: {
    color: '#b91c1c',
    fontSize: 14,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  footerAccent: {
    color: '#111',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
