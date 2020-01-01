import React, {  Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text, Body, Title, Right, Left, Button, Badge } from 'native-base';
import {Platform, View} from 'react-native'
import Tab1 from './src/menu';
import Tab2 from './src/cart';
import firebase from './firebase/firebase';
import { BarCodeScanner } from 'expo-barcode-scanner';
export let tableName = [];
export default class App extends Component {
  
  constructor(){
    super()
    this.state = {
      totalCarts : []
    }
  }
  
  componentDidMount(){
    // (async () => {
    //   const { status } = await BarCodeScanner.requestPermissionsAsync();
    //   setHasPermission(status === 'granted');
    // })();
    let totalCarts = []
    firebase.firestore().collection('tab1').onSnapshot({ includeMetadataChanges: true},(val) => val.docChanges().forEach(values => {
      if(values.type == 'added'){
        const {nama} = values.doc.data()
      totalCarts.push(nama)
      this.setState({totalCarts})
      
    }
    if(values.type == 'removed'){
      totalCarts.pop()
      this.setState({totalCarts})
      console.log('totalCarts removed',totalCarts.length)
    }
        

    }))
}

render(){
  console.log(this.state.totalCarts)
    return (
      <Container>
      <Header style={{height:24}}/>
        <Tabs>
          <Tab heading={ <TabHeading><Icon name="ios-menu" style={{fontSize: 20}}/><Text>Menu</Text></TabHeading>}>
            <Tab1 />
          </Tab>
          <Tab heading={ <TabHeading><Icon name="cart" style={{fontSize: 20}}/>
            <Badge style={{height:30,width:30,backgroundColor: 'yellow', position: 'absolute', top:15, right:15, color:'black' }}>
          <Text style={{color:'black'}} >{this.state.totalCarts.length}</Text></Badge></TabHeading>}>
            <Tab2 />
          </Tab>
          
        </Tabs>
      </Container>
    );
  
  }
}