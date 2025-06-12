import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
  },



  sheet: {
    backgroundColor: '#ffffff',
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
    marginBottom: 12,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },

  body: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginVertical: 10,
  },

  empty: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 12,
  },

  componenteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  componenteInfo: {
    flex: 1,
  },

  componenteNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },

  componenteDetalles: {
    fontSize: 13,
    color: '#64748b',
  },

  materialList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },

  materialBox: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12,
    width: '48%',
  },

  materialSelected: {
    borderWidth: 1,
    borderColor: '#2563eb',
    backgroundColor: '#e0f2fe',
  },

  materialName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },

  materialDetails: {
    fontSize: 12,
    color: '#64748b',
  },

  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },

  buttonDisabled: {
    backgroundColor: '#cbd5e1',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  componentList: {
  gap: 12,
  marginBottom: 16,
},

componentCard: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f8fafc',
  borderRadius: 12,
  paddingVertical: 10,
  paddingHorizontal: 14,
  elevation: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 2,
},

componentInfo: {
  flex: 1,
},

componentName: {
  fontSize: 14,
  fontWeight: '600',
  color: '#0f172a',
  marginBottom: 2,
},

componentDetails: {
  fontSize: 13,
  color: '#64748b',
},

});
