import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: hp('20%'),
    minHeight: hp('75%'),
    width: '100%',
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
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: '700',
    color: '#334155',
    marginVertical: 16,
    marginBottom: 12,
  },

  empty: {
    fontSize: RFValue(14),
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 24,
    fontStyle: 'italic',
  },

  componenteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  componenteInfo: {
    flex: 1,
  },

  componenteNombre: {
    fontSize: RFValue(15),
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },

  componenteDetalles: {
    fontSize: RFValue(13),
    color: '#64748b',
  },

  materialList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },

  materialBox: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    width: wp('48%'),
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  materialSelected: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },

  materialName: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },

  materialDetails: {
    fontSize: RFValue(12),
    color: '#64748b',
  },

  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: RFValue(15),
    color: '#1e293b',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: hp('5%'),
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: RFValue(16),
    fontWeight: '600',
  },

  componentList: {
    gap: 16,
    marginBottom: 20,
  },

  componentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  componentInfo: {
    flex: 1,
  },

  componentName: {
    fontSize: RFValue(15),
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },

  componentDetails: {
    fontSize: RFValue(13),
    color: '#64748b',
  },
});
