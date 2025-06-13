import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../../styles/theme'; // ajustá el path si es distinto

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },

  modalContent: {
    width: '100%',
    maxWidth: wp('90%'),
    backgroundColor: colors.card,
    borderRadius: wp('6%'),
    overflow: 'hidden',
  },

  modalHeader: {
    backgroundColor: colors.softPrimary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderTopLeftRadius: wp('6%'),
    borderTopRightRadius: wp('6%'),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: '700',
    color: colors.text,
  },

  closeIcon: {
    padding: wp('2.5%'),
    borderRadius: 999,
    backgroundColor: colors.neutral,
  },

  modalBody: {
    padding: wp('5%'),
  },

  input: {
    backgroundColor: colors.inputBg,
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    fontSize: RFValue(15),
    color: colors.strongText,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: hp('2%'),
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: wp('4%'),
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('2%'),
  },

  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('5%'),
    gap: wp('2%'),
  },

  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },

  modalButtonSecondary: {
    backgroundColor: colors.secondaryButtonBg,
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
  },

  modalButtonText: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: '#ffffff',
  },

  modalButtonTextSecondary: {
    color: colors.text,
  },
});
