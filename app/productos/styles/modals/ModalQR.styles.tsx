import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    minHeight: '75%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },

  body: {
    alignItems: 'center',
    marginBottom: 24,
  },

  qrBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  qrText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 12,
  },

  qrVarianteText: {
    fontSize: 13,
    color: '#64748b',
  },

  qrPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2563eb',
    marginTop: 4,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  buttonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
  },

  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  buttonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
  },

  buttonSecondaryText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
});
