import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FloatingLabelInput from '../components/FloatingLabelLogin';
import { colors } from '../styles/theme';
import CompletarPerfilModal from './completar-perfil';

const { width, height } = Dimensions.get('window');

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
  const [showCompletarPerfil, setShowCompletarPerfil] = React.useState(false);
  const [signUpPending, setSignUpPending] = React.useState<any>(null);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const payload: any = { emailAddress, username };
      if (password) payload.password = password;
      await signUp.create(payload);
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
      const result = await startOAuth({ redirectUrl: redirectUri });
      const { createdSessionId, setActive, signUp } = result;
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/');
      } else if (signUp) {
        // Usuario pendiente: pasar signUp y setActive al modal
        setSignUpPending({ signUp, setActive });
        setShowCompletarPerfil(true);
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" translucent />
      {showCompletarPerfil && signUpPending && (
        <CompletarPerfilModal signUp={signUpPending.signUp} setActive={signUpPending.setActive} />
      )}
      <View style={styles.centeredWrapper}>
        <View style={styles.formCard}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/icon.png')} style={styles.logo} />
          </View>
          <Text style={styles.title}>{!pendingVerification ? 'Crear cuenta' : 'Verifica tu cuenta'}</Text>
          {!pendingVerification ? (
            <View style={styles.formSection}>
              <FloatingLabelInput 
                label="Nombre de usuario" 
                value={username} 
                onChangeText={setUsername} 
                autoCapitalize="none" 
              />
              <FloatingLabelInput 
                label="Correo electrónico" 
                value={emailAddress} 
                onChangeText={setEmailAddress} 
                keyboardType="email-address" 
                autoCapitalize="none" 
              />
              <FloatingLabelInput 
                label="Contraseña (opcional)" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
                autoComplete="password-new" 
              />
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              <TouchableOpacity 
                style={[styles.primaryButton, loading && styles.disabled]} 
                onPress={onSignUpPress} 
                disabled={loading} 
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Creando cuenta...' : 'Registrarse'}
                </Text>
              </TouchableOpacity>
              {/* Social & Biometric Icons */}
              <View style={styles.iconRow}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleOAuth(startGoogleOAuth, 'Google')}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <AntDesign name="google" size={22} color="#EA4335" />
                </TouchableOpacity>
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleOAuth(startAppleOAuth, 'Apple')}
                    disabled={loading}
                    activeOpacity={0.7}
                  >
                    <FontAwesome name="apple" size={22} color="#1e293b" />
                  </TouchableOpacity>
                )}
   
              </View>
              <Link href="/login" asChild>
                <Pressable style={styles.footerLink}>
                  <Text style={styles.footerText}>
                    ¿Ya tenés cuenta? <Text style={styles.footerAccent}>Iniciá sesión</Text>
                  </Text>
                </Pressable>
              </Link>
            </View>
          ) : (
            <View style={styles.formSection}>
              <View style={styles.verificationIconContainer}>
                <Ionicons name="mail" size={48} color={colors.primary} />
              </View>
              <FloatingLabelInput 
                label="Código de verificación" 
                value={code} 
                onChangeText={setCode} 
                keyboardType="number-pad" 
                maxLength={6} 
              />
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              <TouchableOpacity 
                style={[styles.primaryButton, loading && styles.disabled]} 
                onPress={onVerifyPress} 
                disabled={loading} 
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Verificando...' : 'Verificar'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centeredWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  formCard: {
    width: 340,
    maxWidth: '100%',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
  logoContainer: {
    marginBottom: 18,
    alignItems: 'center',
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  formSection: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  primaryButton: {
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 18,
    marginBottom: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  verificationIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  footerLink: {
    marginTop: 18,
    alignSelf: 'center',
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  footerAccent: {
    color: colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
