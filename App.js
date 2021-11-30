import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import{ Header } from'react-native-elements';
import{ Input } from'react-native-elements';
import{ Button, ListItem } from'react-native-elements';
import{ Icon } from'react-native-elements';


const db = SQLite.openDatabase('coursedb.db');

export default function App() {
  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, amount text, product text);');
    });
    updateList();    
  }, []);

  // Save list
  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into shoppinglist (product, amount) values (?, ?);', [product, amount]);    
      }, null, updateList
    )
    setAmount('');
    setProduct('');
    console.log(list); 
  }
  // Update list
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) =>
        setList(rows._array)
      ); 
    });
  }

  // Delete list
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shoppinglist where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  renderItem = ({item}) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{product}</ListItem.Title>
        <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
        <Button icon={<Icon name="delete" color="red"/>} onPress={() => deleteItem(item.id)}></Button>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  )


  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };




  return (
    
    <View style={styles.container}>
      <Header
        centerComponent={{ text:'SHOPPINGLIST', style:{ color: '#fff' } }}
      />
      <Input placeholder='Product'
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <Input placeholder='Amount' 
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button buttonStyle={{ width: 300 }} raised icon={{name:'save'}} onPress={saveItem} title="Save" /> 
      <FlatList 
        data={list}
        keyExtractor={item => item.id.toString()} 
        renderItem={renderItem}
     />      
     
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
});

