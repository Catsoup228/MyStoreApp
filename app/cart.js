import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('cart.db');

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);

  const loadCartItems = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM cart', [], (_, { rows }) => {
        setCartItems(rows._array);
      });
    });
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  return (
    <View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 20 }}>
            <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
            <Text>{item.title}</Text>
            <Text>{item.price}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CartScreen;