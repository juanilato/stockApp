import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FloatingLabelInput from '../components/FloatingLabelLogin';
import { useBiometricAuth } from '../hooks/useBiometricAuth';

const { width, height } = Dimensions.get('window');

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                  <Image source={require('../assets/images/icon.png')} style={styles.logo} />
                </View>
              </View>
              <Text style={styles.welcomeText}>¡Bienvenido de vuelta!</Text>
              <Text style={styles.subtitleText}>Inicia sesión para continuar</Text>
            </View>

            {/* Main Form Card */}
            <View style={styles.formCard}>
              {/* Social Login Buttons */}
              <View style={styles.socialSection}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton, loading && styles.disabled]}
                  onPress={() => handleOAuth(startGoogleOAuth, 'Google')}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <AntDesign name="google" size={20} color="#EA4335" />
                  <Text style={styles.googleButtonText}>Continuar con Google</Text>
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[styles.socialButton, styles.appleButton, loading && styles.disabled]}
                    onPress={() => handleOAuth(startAppleOAuth, 'Apple')}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <FontAwesome name="apple" size={20} color="#fff" />
                    <Text style={styles.appleButtonText}>Continuar con Apple</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  style={[styles.socialButton, styles.biometricButton, loading && styles.disabled]} 
                  onPress={onBiometricLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="finger-print" size={20} color="#667eea" />
                  <Text style={styles.biometricButtonText}>Ingresar con biometría</Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o con tu cuenta</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Form Fields */}
              <View style={styles.formSection}>
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

                {error ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#ef4444" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.disabled]}
                  onPress={onSignInPress}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.primaryButtonText}>
                      {loading ? 'Ingresando...' : 'Iniciar sesión'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footerSection}>
              <Link href="/signup" asChild>
                <Pressable style={styles.footerLink}>
                  <Text style={styles.footerText}>
                    ¿No tenés cuenta? <Text style={styles.footerAccent}>Regístrate</Text>
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardContainer: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 15,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  socialSection: {
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
  },
  googleButtonText: {
    marginLeft: 12,
    fontWeight: '600',
    fontSize: 16,
    color: '#374151',
  },
  appleButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  appleButtonText: {
    marginLeft: 12,
    fontWeight: '600',
    fontSize: 16,
    color: '#fff',
  },
  biometricButton: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  biometricButtonText: {
    marginLeft: 12,
    fontWeight: '600',
    fontSize: 16,
    color: '#667eea',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  primaryButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  disabled: {
    opacity: 0.6,
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerLink: {
    paddingVertical: 8,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  footerAccent: {
    color: '#fff',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
