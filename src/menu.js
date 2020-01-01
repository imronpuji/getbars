import React, { Component } from 'react';
import Modal, { ModalContent, BottomModal } from 'react-native-modals';
import { 
			Container,
			Header, Content, Text, Left, Body, Right,
			Button, Icon, Title, StyleProvider,
			List,ListItem, Thumbnail, 
      		Separator, Root, ActionSheet 
		} from 'native-base';
import {Image} from 'react-native'
import firebase from '../firebase/firebase';
import { tableName} from '../App'

const tableCount = tableName
 const Modalme = (props) => {
  		return (
  			<BottomModal
			    visible={props.looked}
    swipeThreshold={200} // default 100
    onSwipeOut={props.halo}
  			>
			   
		    <ModalContent>
		    	   <List>
              
             
                  <ListItem thumbnail>

                  					<Left>
                						<Thumbnail square source={{ uri: props.img }} />
             					 	</Left>
                                    <Body>
                                        <Text>{props.title}</Text>
                                        <Text note numberOfLines={1}>{props.harga}</Text>
                                    </Body>
                                    <Right>
                                     <Button onPress={() => this.sendCart(val)}><Text>cart</Text></Button>
                                    </Right>

       
                  </ListItem>        
                   <ListItem>
            	<Body>
            		
            	</Body>
            	<Right style={{display:'flex',flexDirection:'row',flexGrow:3,justifyContent:'flex-end'
            	}}>
                                     <Button onPress={() => this.sendCart(val)}><Text>-</Text></Button>
                                     <Button transparent onPress={() => this.sendCart(val)}><Text>10</Text></Button>
                                     <Button onPress={() => this.sendCart(val)}><Text>+</Text></Button>
                </Right>
            </ListItem>        
                            
            </List>
          
		    </ModalContent>
  		</BottomModal> 
  			)   
  	}
    const data = [];
    const newArr = []
    let unsub ;
    let ref;

export default class HeaderIconExample extends Component {

  constructor(){
    super()
    this.state = {
      data : [],
      keranjang : [],
      images : [],
      visible:false,
      dataModal:{
      	nama:'',
      	harga:''
      }
    }
    this.ref = firebase.firestore()
  }
  componentDidMount(){
    alert(tableName)
    const data = []
    const keranjang = [] 
    const dataImage = []
  
    unsub = this.ref.collection('food').onSnapshot({ includeMetadataChanges: false},(snapshot) => snapshot.docChanges().forEach((val, index) => {
      const {nama, harga, image} = val.doc.data()
      const id = val.doc.id

      if(val.type == 'added'){
        data.push({id, nama,harga, image})
        data.sort((a, b) => a['nama'] > b['nama'] ? 1 : -1)
        this.setState({data})
      
      }
      if(val.type == 'removed'){
        const dataDel = this.state.data.filter(val => val.id != id)
        this.setState({data:dataDel})
      }
      if(val.type == 'modified'){

        this.setState((doc) => doc.data.map((val, index) => {
          if(doc.data[index]['id'] == id){
            doc.data[index]['nama'] = nama
            doc.data[index]['harga'] = harga
            doc.data[index]['image'] = image

          }
        }))
      }
    }))

     ref = this.ref.collection('tab1').onSnapshot({ includeMetadataChanges: false},(val) =>
       val.docChanges().forEach(val => {

        const {id, nama, harga} = val.doc.data()
        const doc =  val.doc.id
        if(val.type == 'added'){
        keranjang.push({id, nama, harga, doc})
        this.setState({keranjang})
      }
      if(val.type == 'removed'){
        this.setState((data) => data.keranjang.map((val, index) => {
          if(data.keranjang[index]['id'] == id){
            delete data.keranjang[index]
          }
        }))
      }
    }));
  }
  sendCart =  (val) =>{
    const {id, nama, harga, image} = val
    const data = this.state.keranjang
    const datas = data.filter((val, index) => val.id == id)
    if(datas.length > 0){
      if(datas[0]['id'] == id){
        const increment = firebase.firestore.FieldValue.increment(1);
        firebase.firestore().collection('tab1').doc(datas[0]['doc']).update({
          jumlah:increment
        })
      }
    }else {
      this.ref.collection('tab1').add({
        id,
        nama,
        harga,
        image,
        jumlah:1,
      })
    }
  }
  componentWillUnmount(){
    unsub
    ref
  }



  render() {


    return (
   
  
      <Container>
	    <Content>
          <Separator bordered>
            <Text>MIDFIELD</Text>
          </Separator>
            <List>
              
             {this.state.data.map((val, index) => {
                return (
                  <ListItem key={index} thumbnail>

                  					<Left>
                						<Thumbnail square source={{ uri: val.image }} />
             					 	</Left>
                                    <Body>
                                        <Text>{val.nama}</Text>
                                        <Text note numberOfLines={1}>{val.harga}</Text>
                                    </Body>
                                    <Right>
                                     <Button onPress={() => this.sendCart(val)}><Text>cart</Text></Button>
                                    </Right>

       
                                </ListItem>

                  )
              })
                }                
                            
            </List>
         	
         </Content>
         <Modalme img={this.state.dataModal.image} harga={this.state.dataModal.harga} title={this.state.dataModal.nama}  looked={this.state.visible} halo={() => this.setState({visible:false})}/>
        </Container>

             
    );
  }
}