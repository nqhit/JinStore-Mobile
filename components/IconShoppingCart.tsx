import socket from '@/config/socket';
import useCart from '@/hooks/cart/useCart.hooks';
import { loginSuccess } from '@/redux/slices/authSlice';
import { createAxios } from '@/utils/createInstance';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import FText from '@/components/Text';
import { COLORS } from '@/constants/Colors';

function IconShoppingCart() {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const id = user?._id;
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const [lengthItems, setLengthItems] = useState(0);

  const { fetchCartItems } = useCart({ accessToken, axiosJWT });

  const handleFetchData = useCallback(() => {
    fetchCartItems().then((res) => {
      setLengthItems(res?.itemCount || 0);
    });
  }, [fetchCartItems]);

  const handleRouterCart = useCallback(() => {
    router.navigate('/cart');
  }, []);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  // Socket
  useEffect(() => {
    if (!user || !id) return;

    socket.emit('joinUser', id);

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('cartUpdated', (data) => {
      console.log(data.message);
      setLengthItems(data.itemCount);
    });

    return () => {
      socket.off('cartUpdated');
    };
  }, [user, id]);

  return (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.cartButton} onPress={handleRouterCart}>
        <AntDesign name="shoppingcart" size={30} color="#000" />
        <FText style={styles.cartItemCount}>{lengthItems > 9 ? '9+' : lengthItems}</FText>
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
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    alignContent: 'center',
    textAlign: 'center',
  },
});

export default IconShoppingCart;
