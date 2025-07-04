import { COLORS } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    gap: 10,
    zIndex: 2,
  },
  searchResults: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: COLORS.white,
    zIndex: 1,
  },

  // Body
  body: {
    paddingHorizontal: 15,
    flex: 1,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: COLORS.black,
    textAlign: 'center',
  },
  filterOption: {
    padding: 16,
    backgroundColor: COLORS.gray200,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray300,
  },
  filterText: {
    fontSize: 16,
    color: COLORS.gray500,
    textAlign: 'center',
    fontWeight: '500',
  },
  closeButton: {
    padding: 18,
    backgroundColor: COLORS.primary500,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
export default styles;
