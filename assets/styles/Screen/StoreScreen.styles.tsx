import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  staticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  HeaderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: '#fff',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7a5af8',
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
    borderColor: '#7a5af8',
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

  // Body
  body: {
    paddingHorizontal: 15,
    flex: 1,
  },

  modalHandle: {
    backgroundColor: '#ddd',
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  modalStyle: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  filterOption: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    fontWeight: '500',
  },
  closeButton: {
    padding: 18,
    backgroundColor: '#7a5af8',
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#7a5af8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
export default styles;
