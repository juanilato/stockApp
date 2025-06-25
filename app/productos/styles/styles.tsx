import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { spacing } from '../../styles/theme'; // Asegurate que el path sea correcto

export const styles = StyleSheet.create({
  productoInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  productoItemCompact: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
  },

  productoNombreCompact: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: hp('1%'),
    letterSpacing: -0.3,
  },

  productoTagsCompact: {
    flexDirection: 'row',
    gap: wp('2.5%'),
    flexWrap: 'wrap',
  },
  addListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addListItemText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
  tagCompact: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('3.5%'),
    minWidth: wp('24%'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  tagLabelCompact: {
    fontSize: wp('2.8%'),
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  tagValueCompact: {
    fontSize: wp('3.6%'),
    fontWeight: '700',
  },

  // Nuevos estilos modernizados
  productoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  productoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  productoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  productoNombre: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },

  productoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productoStock: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  productoPrecios: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  precioItem: {
    flex: 1,
    alignItems: 'center',
  },

  precioLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  precioVenta: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },

  precioCosto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },

  precioMargen: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
  },

  // Estilos modernos para acciones de swipe
  swipeActionsContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: '100%',
    overflow: 'hidden',
    marginLeft: wp('-2.5%'),
  },

  swipeActionButton: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  swipeActionEdit: {
    backgroundColor: '#3b82f6',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  swipeActionDelete: {
    backgroundColor: '#ef4444',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },

  swipeActionTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  swipeActionContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  swipeActionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },

  swipeActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Estilos antiguos (mantener para compatibilidad)
  swipeButton: {
    width: wp('15%'),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  swipeButtonEdit: {
    backgroundColor: '#3b82f6',
  },

  swipeButtonDelete: {
    backgroundColor: '#ef4444',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },

  ball: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: '#3b82f6',
    marginHorizontal: wp('1.5%'),
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  productoWrapper: {
    marginHorizontal: wp('4%'),
    marginBottom: hp('1.5%'),
    backgroundColor: '#ffffff',
    marginTop: hp('0.5%'),
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // Header modernizado
  headerProductos: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: hp('6%'),
    paddingBottom: hp('3%'),
  },

  headerText: {
    flex: 1,
  },

  headerSectionLabel: {
    fontSize: wp('3%'),
    color: '#94a3b8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: hp('0.5%'),
    fontWeight: '600',
  },

  headerTitle: {
    fontSize: wp('6.5%'),
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '500',
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  headerTitleProductos: {
    fontSize: wp('6.5%'),
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },

  addButtonPunch: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  menuButtonStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  fabContainer: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Estado vacío modernizado
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },

  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
});
