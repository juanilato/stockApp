import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
    minHeight: hp('75%'),
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
    fontSize: RFValue(20),
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
  },

  body: {
    flexGrow: 1,
  },

  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: RFValue(15),
    color: '#1e293b',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: RFValue(16),
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: '700',
    color: '#334155',
    marginBottom: 16,
  },

  emptyText: {
    fontSize: RFValue(14),
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },

  variantList: {
    gap: 16,
  },

  variantCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  variantInfo: {
    flex: 1,
  },

  variantName: {
    fontSize: RFValue(15),
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },

  variantStock: {
    fontSize: RFValue(13),
    color: '#64748b',
  },

  variantActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
