import { COLORS } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    zIndex: 2,
  },
  HeaderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary500,
    borderRadius: 12,
    paddingHorizontal: 12,
    flex: 1,
    height: 40,
    marginHorizontal: 12,
  },
  searchFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary500,
    borderRadius: 12,
    paddingHorizontal: 7,
    height: 40,
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
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

  modalHandle: {
    backgroundColor: COLORS.gray200,
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  modalStyle: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalOverlay: {
    backgroundColor: COLORS.black_032,
  },
  modalContent: {
    padding: 24,
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
