import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FloatingLabelInput from '../components/FloatingLabel';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: 'oauth_apple' });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [username, setUsername] = React.useState('');

  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'ventasapp' });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const resCreate = await signUp.create({ emailAddress, password, username });
      console.log('signUp.create result:', resCreate);
      const resPrepare = await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      console.log('signUp.prepareEmailAddressVerification result:', resPrepare);
      setPendingVerification(true);
    } catch (err: any) {
      console.log('signUp error:', err);
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
      console.log('attemptEmailAddressVerification result:', completeSignUp);
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/');
      } else {
        setError(`Verificación incompleta. Status: ${completeSignUp.status || 'desconocido'}. Intenta de nuevo.`);
      }
    } catch (err: any) {
      console.log('verify error:', err);
      setError(err.errors?.[0]?.message || 'Error al verificar código');
    } finally {
      setLoading(false);
    }
  };

  // Social login handlers
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
    <KeyboardAvoidingView style={styles.outer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.iconWrapper}>

            <Image source={require('../assets/images/icon.png')} style={styles.icon} />
       
        </View>
        <View style={styles.card}>
          {!pendingVerification ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Crear Cuenta</Text>
                <Text style={styles.subtitle}>Únete a nuestra plataforma</Text>
              </View>
              <View style={styles.socialContainer}>
                {(Platform.OS === 'android' || Platform.OS === 'ios') && (
                  <TouchableOpacity 
                    style={[styles.socialButton, loading && styles.socialButtonDisabled]} 
                    onPress={() => handleOAuth(startGoogleOAuth, 'Google')}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <AntDesign name="google" size={20} color="#222" />
                    <Text style={styles.socialButtonText}>Continuar con Google</Text>
                  </TouchableOpacity>
                )}
                {Platform.OS === 'ios' && (
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.appleButton, loading && styles.socialButtonDisabled]} 
                    onPress={() => handleOAuth(startAppleOAuth, 'Apple')}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <FontAwesome name="apple" size={20} color="#fff" />
                    <Text style={[styles.socialButtonText, styles.appleButtonText]}>Continuar con Apple</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>o regístrate con email</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.formContainer}>
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
                  autoComplete="email"
                  autoCapitalize="none"
                />
                <FloatingLabelInput
                  label="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  autoComplete="password-new"
                />
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : null}
                <TouchableOpacity 
                  style={[styles.primaryButton, loading && styles.primaryButtonDisabled]} 
                  onPress={onSignUpPress} 
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Verificar Email</Text>
                <Text style={styles.subtitle}>Ingresa el código de verificación</Text>
              </View>
              <View style={styles.formContainer}>
                <FloatingLabelInput
                  label="Código de verificación"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : null}
                <TouchableOpacity 
                  style={[styles.primaryButton, loading && styles.primaryButtonDisabled]} 
                  onPress={onVerifyPress} 
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Verificando...' : 'Verificar código'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        <View style={styles.footer}>
          <Link href="/login" asChild>
            <Pressable style={styles.link}>
              <Text style={styles.linkText}>¿Ya tienes una cuenta? <Text style={styles.linkAccent}>Inicia sesión</Text></Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,

  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },

  icon: {
    width: 90,
    height: 90,
    borderRadius: 24,

    resizeMode: 'contain',

  },
  card: {
    width: '100%',
    maxWidth: 400,

    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 12,
    marginBottom: 18,
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#222',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  socialContainer: {
    marginBottom: 18,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  appleButton: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  socialButtonDisabled: {
    opacity: 0.6,
  },
  socialButtonText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
    marginLeft: 12,
  },
  appleButtonText: {
    color: '#fff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#64748b',
    fontWeight: '500',
    fontSize: 13,
  },
  formContainer: {
    marginBottom: 0,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
    backgroundColor: '#fef2f2',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  primaryButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonDisabled: {
    backgroundColor: '#e5e7eb',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  link: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  linkText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 15,
  },
  linkAccent: {
    color: '#222',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
}); 