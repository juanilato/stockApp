import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    minHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
  },

  body: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    minHeight: 250,
  },

  qrBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    minHeight: 220,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  qrText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
    textAlign: 'center',
  },

  qrVarianteText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },

  qrPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginTop: 8,
    textAlign: 'center',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
  },

  buttonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  buttonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  buttonSecondaryText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
});
