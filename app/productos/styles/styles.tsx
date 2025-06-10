import { StyleSheet } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  lista: {
    flex: 1,
  },
  listaContent: {
    padding: 16,
    paddingBottom: 80,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[800],
  },
  
  closeButton: {
    padding: 4,
  },
  
  modalBody: {
    gap: 16,
  },
  
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: colors.gray[50],
    color: colors.gray[800],
  },
  
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  
  modalButtonSecondary: {
    backgroundColor: colors.gray[100],
  },
  
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  
  modalButtonTextSecondary: {
    color: colors.gray[700],
  },
  
  productoItem: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderColor: '#e2e8f0',
    borderWidth: 1,
 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // 👈 asegura la alineación vertical
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12, // separación entre items
  },
  
  productoInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  
  productoNombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a', // gris oscuro

  },
  
  productoDetails: {
    flexDirection: 'row',
    gap: 4,
  },
  
  productoPrecio: {
    fontSize: 14,
    color: '#10b981', // verde suave
  },
  
  productoPrecioCosto: {
    fontSize: 14,
    color: '#f59e0b', // amarillo suave
  },
  
  productoStock: {
    fontSize: 14,
    color: '#3b82f6', // azul
  },
  
  
  


  productoActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  editButton: {
    backgroundColor: colors.info,
  },
  componentesButton: {
    backgroundColor: colors.success,
  },
  qrButton: {
    backgroundColor: colors.secondary,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  
  
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    
    marginBottom: spacing.md,
    ...shadows.md,

  },

  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    color: colors.gray[700],
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.sm,
  },
  
 
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.gray[800],
    marginBottom: spacing.lg,
  },
  componentesList: {
    marginBottom: spacing.lg,
  },
  componenteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  componenteInfo: {
    flex: 1,
  },
  componenteNombre: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  componenteCantidad: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  componenteDeleteButton: {
    padding: spacing.xs,
  },
  addComponentContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.lg,
  },
  materialSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  materialOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  materialOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  materialOptionText: {
    color: colors.gray[700],
    fontSize: typography.sizes.base,
  },
  materialOptionTextSelected: {
    color: colors.white,
  },
  qrContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  qrText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[800],
    marginTop: spacing.lg,
  },
  qrPrice: {
    fontSize: typography.sizes.lg,
    color: colors.gray[600],
    marginTop: spacing.sm,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[800],
  },
  
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },

  varianteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  varianteInfo: {
    flex: 1,
  },
  varianteNombre: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  varianteStock: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  varianteActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  varianteButton: {
    padding: spacing.xs,
  },

  inputContainer: {
    marginBottom: spacing.sm,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: '600',
  },
  qrVarianteText: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  emptyText: {
    color: colors.gray[500],
    fontSize: typography.sizes.base,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  picker: {
    height: 50,
  },
  agregarComponenteContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.lg,
  },
  agregarComponenteForm: {
    marginTop: spacing.md,
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  agregarButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  agregarButtonText: {
    color: colors.white,
    fontSize: typography.sizes.base,
    fontWeight: '600',
  },
  componenteDetalles: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  materialesList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  materialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  materialItemSelected: {
    backgroundColor: colors.primary[50],
  },
  materialInfo: {
    flex: 1,
  },
  materialNombre: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.gray[800],
  },
  materialNombreSelected: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  materialUnidad: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  materialUnidadSelected: {
    color: colors.primary[600],
  },
  agregarButtonDisabled: {
    backgroundColor: colors.gray[400],
    opacity: 0.7,
  },
  variantesList: {
    marginTop: spacing.md,
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  menuContainer: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: 20,
    textAlign: 'center',
  },
  
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    gap: 12,
  },
  
  menuButtonText: {
    fontSize: 16,
    color: colors.gray[700],
    fontWeight: '500',
  },
  
  cancelButton: {
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: colors.gray[100],
    borderRadius: 10,
    alignItems: 'center',
  },
  
  cancelText: {
    fontSize: 16,
    color: colors.danger,
    fontWeight: '600',
  },
  
}); 