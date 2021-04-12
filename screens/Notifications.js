import * as React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import { Header, ListItem } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Constants } from 'expo-constants'
import MyHeader from '../components/MyHeader';

export default class Notification extends React.Component {
  constructor(props){
    super(props);
    this.state={
      userId: firebase.auth().currentUser.email,
      allNotification:[],
    }
  }
  getNotifications=()=>{
    db.collection('allNotification')
      .where('notificationStatus','==','unread')
      .where('targetId','==',this.state.userId)
      .onSnapshot((snapshot)=>{
        var notifications = []
        snapshot.docs.map((doc) =>{
         var notification = doc.data()
         notification["doc_id"] = doc.id
         notifications.push(notification)
         this.setState({
          allNotification : notifications,
        });
       });
      })
  }
  componentDidMount(){
    this.getNotifications();
  }
  render(){
    return(
            <SafeAreaProvider>
            <View style={{paddingTop:10}}>
                <MyHeader
                        title='Notification'
                        bellPressAction={()=>{this.props.navigation.navigate('Notification')}}
                        barPressAction={()=>{this.props.navigation.toggleDrawer()}}/>
                <View>
                {console.log(this.state.allNotification)}
                <FlatList
                        keyExtractor={(item,index)=>index.toString()}
                        data={this.state.allNotification}
                        renderItem={({item,key})=>{
                            return (
                                <ListItem
                                    key={key}
                                    bottomDivider>
                                        <ListItem.Content style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                                            <ListItem.Title style={{color:'#000',fontWeight:'bold'}}>{item.bookName}</ListItem.Title>
                                            <ListItem.Subtitle style={{color:'#5f5',fontWeight:'bold'}}>{item.message}</ListItem.Subtitle>
                                        </ListItem.Content>
                                </ListItem>
                            )
                        }}
                    />
                </View>
            </View>
            </SafeAreaProvider>
        )
    }
}
const styles = StyleSheet.create({
    button:{
        width:120,
        height:20,
        backgroundColor:'orange'
    }
})