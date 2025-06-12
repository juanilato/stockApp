import { StyleSheet } from 'react-native';
import { spacing } from '../../styles/theme';

export const styles = StyleSheet.create({








productoInfo: {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
},





productoItemCompact: {
  backgroundColor: '#ffffff',
  borderRadius: 14,
  paddingVertical: 10,
  paddingHorizontal: 14,

  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.03,
  shadowRadius: 3,
  elevation: 1,
},

productoNombreCompact: {
  fontSize: 15,
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: 2,
},

productoTagsCompact: {
  flexDirection: 'row',
  gap: 10,
  flexWrap: 'wrap',
},

tagCompact: {
  backgroundColor: '#f1f5f9',
  borderRadius: 6,
  paddingVertical: 3,
  paddingHorizontal: 8,
},

tagLabelCompact: {
  fontSize: 10,
  color: '#64748b',
  fontWeight: '500',
  textTransform: 'uppercase',
},

tagValueCompact: {
  fontSize: 13,
  fontWeight: '600',
  color: '#2563eb',
},


swipeActionsContainer: {
  flexDirection: 'row',
  alignItems: 'stretch',
  height: '100%',
  overflow: 'hidden',
  marginLeft: -12,
},

swipeButton: {
  width: 56,
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},

swipeButtonEdit: {
backgroundColor: '#3b82f6', // Azul uniforme con info
},

swipeButtonDelete: {
  backgroundColor: '#ef4444', // Rojo intenso moderno
  borderTopRightRadius: 16,
  borderBottomRightRadius: 16,
},


productoWrapper: {
  marginHorizontal: 16,
  marginBottom: 12,
  borderRadius: 16,
  overflow: 'hidden', // clave para que los bordes se recorten
},


 


headerProductos: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  paddingHorizontal: spacing.lg,
  paddingTop: 40,
  paddingBottom: 20,
  backgroundColor: '#f8fafc',
},

headerSectionLabel: {
  fontSize: 12,
  color: '#94a3b8',
  letterSpacing: 1,
  textTransform: 'uppercase',
  marginBottom: 2,
},

headerTitleProductos: {
  fontSize: 24,
  fontWeight: '700',
  color: '#0f172a',
},

addButtonPunch: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#1d4ed8',
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 30,
  shadowColor: '#1e40af',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 6,
},

addButtonTextPunch: {
  color: '#ffffff',
  fontSize: 14,
  fontWeight: '600',
  marginLeft: 6,
},


}); 