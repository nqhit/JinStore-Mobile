import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  categoryContainer: {
    width: 120,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10,
    /*   backgroundColor: '#fff', // Bắt buộc cho iOS bóng hiển thị
    shadowColor: '#000', // Thêm dòng này
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5, */
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    width: 100,
    textAlign: 'center',
  },
});

export default styles;
