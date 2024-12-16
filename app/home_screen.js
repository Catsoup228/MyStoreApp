import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, Button, RefreshControl } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('cart.db');

const fetchProducts = async () => {
  const response = await fetch('https://fakestoreapi.com/products');
  return response.json();
};

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    setRefreshing(true);
    const productsData = await fetchProducts();
    setProducts(productsData);
    setRefreshing(false);
  };

  useEffect(() => {
    loadProducts();
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, price REAL, description TEXT, image TEXT);'
      );
    });
  }, []);

  const addToCart = (product) => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO cart (title, price, description, image) VALUES (?, ?, ?, ?)', 
        [product.title, product.price, product.description, product.image]);
    });
  };

  return (
    <View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 20 }}>
            <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
            <Text>{item.title}</Text>
            <Text>{item.price}</Text>
            <Text>{item.description}</Text>
            <Button title="Добавить в корзину" onPress={() => addToCart(item)} />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadProducts} />
        }
      />
      <Button title="Перейти в корзину" onPress={() => navigation.navigate('Cart')} />
    </View>
  );
};

export default HomeScreen;