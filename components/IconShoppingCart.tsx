import { socket } from '@/config/socket';
import useCart from '@/hooks/cart/useCart.hooks';
import { loginSuccess } from '@/redux/slices/authSlice';
import { getCart } from '@/server/cart.server';
import { createAxios } from '@/utils/createInstance';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

function IconShoppingCart() {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const id = user?._id;
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const [lengthItems, setLengthItems] = useState(0);

  const { fetchCartItems } = useCart({ getCart, setLengthItems, accessToken, axiosJWT });

  const handleFetchData = useCallback(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleRouterCart = useCallback(() => {
    router.push('/carts/CartDetails');
  }, []);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  // Socket
  useEffect(() => {
    if (!user || !id) return;

    socket.emit('joinUser', id);

    socket.on('cartUpdated', (data) => {
      console.log(data.message);
      setLengthItems(data.itemCount);
    });

    return () => {
      socket.off('cartUpdated');
      socket.disconnect();
    };
  }, [user, id]);

  return (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.cartButton} onPress={handleRouterCart}>
        <AntDesign name="shoppingcart" size={30} color="#000" />
        <Text style={styles.cartItemCount}>{lengthItems > 9 ? '9+' : lengthItems}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cartButton: {
    position: 'relative',
    marginRight: 5,
  },
  cartItemCount: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#8B5CF6',
    width: 20,
    height: 20,
    borderRadius: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    alignContent: 'center',
    textAlign: 'center',
  },
});

export default IconShoppingCart;
