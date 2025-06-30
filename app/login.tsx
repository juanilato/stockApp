import { useOAuth, useSignIn } from '@clerk/clerk-expo';
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
import FloatingLabelInput from '../components/FloatingLabelLogin';
import { useBiometricAuth } from '../hooks/useBiometricAuth';

export default function SignInScreen() {
  const { authenticate, getStoredCredentials, enableBiometricAuth } = useBiometricAuth();
const onBiometricLogin = async () => {
  const success = await authenticate();
  console.log("🔐 Autenticación biométrica:", success);

  if (success) {
    const creds = await getStoredCredentials();
    console.log("📦 Credenciales guardadas:", creds);

    if (creds && signIn) {
      try {
        const result = await signIn.create({
          identifier: creds.email,
          password: creds.password,
        });
        await setActive({ session: result.createdSessionId });
        router.replace('/');
      } catch (error) {
        console.error("❌ Error al ingresar con biometría:", error);
        setError("No se pudo ingresar con biometría");
      }
    } else {
      setError('No hay credenciales guardadas');
    }
  } else {
    setError('Autenticación biométrica fallida');
  }
};

  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: 'oauth_apple' });
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'ventasapp', path: 'oauth/callback' });


  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

const onSignInPress = async () => {
  if (!isLoaded) return;
  setLoading(true);
  setError('');
  try {
    const completeSignIn = await signIn.create({
      identifier: emailAddress,
      password,
    });

    if (completeSignIn.status === 'complete') {
      await setActive({ session: completeSignIn.createdSessionId });

      // 💾 Guardar credenciales reales
      await enableBiometricAuth(emailAddress, password);

      router.replace('/');
    } else {
      setError(`Inicio incompleto. Estado: ${completeSignIn.status}`);
    }
  } catch (err: any) {
    setError(err.errors?.[0]?.message || 'Error al iniciar sesión');
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
        setError(`No se pudo registrar o iniciar sesión con ${provider}.`);
      }
    } catch (err: any) {
      setError(`Error al iniciar sesión con ${provider}`);
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
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>

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
                      <TouchableOpacity onPress={onBiometricLogin} style={styles.button}>
            <Text style={styles.buttonText}>Ingresar con biometría</Text>
          </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>o usar tu correo</Text>
            <View style={styles.divider} />
          </View>

          <FloatingLabelInput
            label="Correo electrónico"
            value={emailAddress}
            onChangeText={setEmailAddress}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <FloatingLabelInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.disabled]}
            onPress={onSignInPress}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Iniciar sesión'}</Text>
          </TouchableOpacity>

          <Link href="/signup" asChild>
            <Pressable style={styles.footerLink}>
              <Text style={styles.footerText}>¿No tenés cuenta? <Text style={styles.footerAccent}>Regístrate</Text></Text>
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
    marginTop: 16,
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
