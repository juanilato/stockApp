import { useOAuth, useSignUp } from '@clerk/clerk-expo';
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
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {showCompletarPerfil && signUpPending && (
        <CompletarPerfilModal signUp={signUpPending.signUp} setActive={signUpPending.setActive} />
      )}
      
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
              <Text style={styles.welcomeText}>
                {!pendingVerification ? '¡Únete a nosotros!' : 'Verifica tu cuenta'}
              </Text>
              <Text style={styles.subtitleText}>
                {!pendingVerification ? 'Crea tu cuenta para empezar' : 'Ingresa el código de verificación'}
              </Text>
            </View>

            {/* Main Form Card */}
            <View style={styles.formCard}>
              {!pendingVerification ? (
                <>
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
                  </View>

                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>o registrarse con email</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Form Fields */}
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
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.primaryButtonText}>
                          {loading ? 'Creando cuenta...' : 'Registrarse'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  {/* Verification Section */}
                  <View style={styles.verificationSection}>
                    <View style={styles.verificationIconContainer}>
                      <Ionicons name="mail" size={48} color="#667eea" />
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
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.primaryButtonText}>
                          {loading ? 'Verificando...' : 'Verificar'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>

            {/* Footer */}
            <View style={styles.footerSection}>
              <Link href="/login" asChild>
                <Pressable style={styles.footerLink}>
                  <Text style={styles.footerText}>
                    ¿Ya tenés cuenta? <Text style={styles.footerAccent}>Iniciá sesión</Text>
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
  verificationSection: {
    alignItems: 'center',
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
