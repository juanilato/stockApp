import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },

  variantModal: {
    zIndex: 10,
    minHeight: hp('30%'), 
    width: wp('90%'),
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },

  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },

  variantItem: {
    width: '100%',
    backgroundColor: '#f8fafc',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderRadius: 16,
    marginBottom: hp('1.2%'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  variantText: {
    fontSize: RFValue(15),
    fontWeight: '600',
    color: '#1e293b',
  },

  cancelButton: {
    marginTop: hp('1%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('5%'),
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  cancelText: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: '#64748b',
  },

  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingTop: hp('4%'),
    paddingBottom: hp('6%'),
    paddingHorizontal: wp('6%'),
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
    minHeight: hp('75%'),
  },

  menuTitle: {
    fontSize: RFValue(20),
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: hp('3%'),
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  buttonList: {
    marginBottom: hp('2%'),
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('2%'),
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    borderRadius: 12,
    marginBottom: hp('0.5%'),
  },

  optionText: {
    fontSize: RFValue(16),
    color: '#334155',
    fontWeight: '500',
  },

  variantTitle: {
    fontSize: RFValue(18),
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: hp('2%'),
  },
});
