import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  variantModal: {
  width: '90%',
  backgroundColor: '#ffffff',
  borderRadius: 20,
  padding: 20,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 8,
},

modalTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: 16,
  textAlign: 'center',
},

variantItem: {
  width: '100%',
  backgroundColor: '#f8fafc',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 12,
  marginBottom: 10,
  alignItems: 'center',
},

variantText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#0f172a',
},

cancelButton: {
  marginTop: 10,
  paddingVertical: 8,
  paddingHorizontal: 20,
  backgroundColor: '#e2e8f0',
  borderRadius: 24,
},

cancelText: {
  fontSize: 13,
  fontWeight: '600',
  color: '#475569',
},

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
menuContainer: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  paddingTop: 24,
  paddingBottom: 32,
  paddingHorizontal: 24,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 10,
  minHeight: '75%',
},

  menuTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },

  buttonList: {
    marginBottom: 16,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
  },

  optionText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },

 

  variantTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },


});
