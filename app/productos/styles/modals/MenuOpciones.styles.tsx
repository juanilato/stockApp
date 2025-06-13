import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../../styles/theme'; // ajustá el path según tu estructura

export const styles = StyleSheet.create({
variantModal: {
  zIndex: 10, // 👈 agregado
  minHeight: hp('30%'), 
  width: wp('90%'),
  backgroundColor: colors.card,
  borderRadius: wp('5%'),
  padding: wp('5%'),
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: hp('0.5%') },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 5,
},

  modalTitle: {
    fontSize: RFValue(16),
    fontWeight: '700',
    color: colors.text,
    marginBottom: hp('2%'),
    textAlign: 'center',
  },

  variantItem: {
    width: '100%',
    backgroundColor: colors.background,
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('3.5%'),
    marginBottom: hp('1.2%'),
    alignItems: 'center',
  },

  variantText: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: colors.strongText,
  },

  cancelButton: {
    marginTop: hp('1%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('5%'),
    backgroundColor: colors.neutral,
    borderRadius: wp('6%'),
  },

  cancelText: {
    fontSize: RFValue(13),
    fontWeight: '600',
    color: colors.mutedText,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },

  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    paddingTop: hp('3%'),
    paddingBottom: hp('4%'),
    paddingHorizontal: wp('6%'),
    borderTopLeftRadius: wp('6%'),
    borderTopRightRadius: wp('6%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -hp('0.5%') },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    minHeight: hp('75%'),
  },

  menuTitle: {
    fontSize: RFValue(17),
    fontWeight: '700',
    color: colors.text,
    marginBottom: hp('2.2%'),
    textAlign: 'center',
  },

  buttonList: {
    marginBottom: hp('2%'),
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('1%'),
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },

  optionText: {
    fontSize: RFValue(15),
    color: '#334155',
    fontWeight: '500',
  },

  variantTitle: {
    fontSize: RFValue(16),
    fontWeight: '700',
    color: colors.text,
    marginBottom: hp('1.5%'),
  },
});
