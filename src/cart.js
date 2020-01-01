'use strict';

import React, { Component } from 'react';
import {tableName} from '../App'
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Left, Body, Right } from 'native-base';
import firebase from '../firebase/firebase';

const data = []
let unsub;
class Cart extends Component {


constructor(){
    super()
    this.ref = firebase.firestore().collection('tab1')
    this.state = {
      data : [],
      cart: [],
      total : [],
      result : ''
    }
  }

  tambah(val){
  
    const {id, nama, harga} = val;
    const increment = firebase.firestore.FieldValue.increment(1);
    this.ref.doc(id).update({jumlah:increment}) 
    
  }
  kurang(val){
      const {id, nama, harga, jumlah} = val;
    const increment = firebase.firestore.FieldValue.increment(-1);
    if(jumlah < 2){
      return false
    }else {
    this.ref.doc(id).update({jumlah:increment}) 
  }
  }

  componentDidMount = () => {
    
    const data = []
    const totals = []
    let semua = 0
    unsub =  this.ref.onSnapshot({ includeMetadataChanges: true},(snapshot) => snapshot.docChanges().forEach((val, index) => {
      const {nama, harga, jumlah, image} = val.doc.data()
      const id = val.doc.id
      const hasil = harga * jumlah
      if (val.type === "added") {
        data.push({id, nama, harga, jumlah, image});
        this.setState((val) => val.data = data)
        totals.push({id,hasil})
        this.setState({total:totals})
        let hargane = []
        this.state.total.map(val => {
          hargane.push(val['hasil'])
        })
        const resulte = hargane.reduce((val, num) => {
          return val + num
        })
        this.setState({result:resulte})
        
        
      }
      if (val.type === "modified") {  
        this.setState((data) => {
          data.total.map((val, index) => {
            if(data.total[index]['id'] == id){
              data.total[index]['hasil'] = hasil
            }
          })
        })
        let hargane = []
        this.state.total.map(val => {
          hargane.push(val['hasil'])
        })
        const resulte = hargane.reduce((val, num) => {
          return val + num
        })
        this.setState({result:resulte})

        this.setState((data) => data.data.map((val, index) => {
          if(data.data[index]['id'] == id){
            data.data[index]['jumlah'] = jumlah
          }
        }))
      }
      if(val.type == 'removed'){
        const total = this.state.total.filter(val => val.id !== id)
        data.map((val, index) => {
          if(data[index]['id'] == id){
            delete data[index]
          }
        })
        this.setState({total})
        const hargane = []
        this.state.total.map(val => {
          hargane.push(val['hasil'])
        })
        let resulte = '';

        if(hargane.length > 0 ){

         resulte = hargane.reduce((val, num) => {
          return val + num
        })
        }else {
          resulte = 0
        }
        this.setState({result:resulte})
      }
      
    })

    )
    
     
  }
  componentWillUnmount(){
     unsub()
  }
  
  hapus(val){
    const {id, nama, harga, jumlah} = val
    this.ref.doc(id).delete()
    const data = this.state.data.filter(val => val.id !== id)
    this.setState({data})
  }



  render() {
    const leadData = this.state.data
    return (
      <Container style={{padding:8}} >
        <Content>
        {leadData.map((val, index) => {
        return (
          <Card>
            <CardItem>
              <Left>
                <Body>
                  <Text>{val.nama}</Text>
                  <Text note>GeekyAnts</Text>
                </Body>
              </Left>
              <Right>
                <Button transparent>
                  <Text>{val.harga}rp</Text>
                </Button>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: val.image}} style={{height: 150, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left>
                
              </Left>
             <Body>
                <Button transparent onPress={() => this.hapus(val)}>
                  <Icon name="md-trash" size={20} color='#4F8EF7'/>           
                </Button>
             </Body>
              <Right style={{justifyContent:'space-between', display:'flex',flexDirection:'row'
              }}>
                <Button transparent onPress={() => this.tambah(val)}>
                  <Icon name="md-add" size={20} color='#4F8EF7'/>           
                </Button>
                 <Button transparent>
                  <Text>{val.jumlah}</Text>
                </Button>
                <Button transparent onPress={() => this.kurang(val)}>
                  <Icon name="md-remove" size={20} color='#4F8EF7'/>           
                </Button>
              </Right>
            </CardItem>
          </Card>
          )
        })}

        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

});


export default Cart;

