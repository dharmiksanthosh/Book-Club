//changed line 15 (userid)
//changed line 87 fontSize
import * as React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import firebase from 'firebase';
import db from '../config'
import { Card, Header } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyHeader from '../components/MyHeader';

export default class ReciverDetails extends React.Component {
    constructor(props){
        super(props);
        this.state={
            donorId: firebase.auth().currentUser.email,
            reciverId:this.props.navigation.getParam('details')['userId'],
            requestId:this.props.navigation.getParam('details')['requestId'],
            bookName:this.props.navigation.getParam('details')['bookName'],
            description:this.props.navigation.getParam('details')['description'],
            reciverName:'',
            reciverContact:'',
            reciverAddress:'',
            reciverRequestDocumentId:'' 
        }
    }
    getReciverDetails = async()=>{
        console.log(this.state.donorId)
        db.collection('Users')
            .where('username','==',this.state.reciverId)
            .get()
            .then(snapshot=>{
                snapshot.forEach(doc=>{
                    var data = doc.data();
                    console.log(data)
                    this.setState({
                        reciverName:data.first_name,
                        reciverContact:data.contact,
                        reciverAddress:data.address
                    })
                })
            })
        db.collection('requested_books')
            .where('requestId','==',this.state.requestId)
            .get()
            .then(snapshot=>{
                snapshot.forEach(doc=>{
                    this.setState({
                        reciverRequestDocumentId:doc.id
                    })
                })
            })
    }
    updateBookStatus = () =>{
        db.collection('allDonations')
            .add({
                bookName:this.state.bookName,
                requestId:this.state.requestId,
                requestedBy:this.state.reciverName,
                donorId:this.state.donorId,
                targetId:this.state.reciverId,
                requestStatus:"Donor is Interested"
            })
    }
    addNotification = () =>{
        var message = this.state.donorId+' has shown interest in Donating the Book';
        db.collection('allNotification')
        .add({
            'targetId': this.state.reciverId,
            'donorId': this.state.donorId,
            'requestId': this.state.requestId,
            'bookName': this.state.bookName,
            'date':firebase.firestore.FieldValue.serverTimestamp(),
            'notificationStatus':'unread',
            'message':message
        })
    }
    componentDidMount(){
        this.getReciverDetails();
    }
    render(){
        return(
            <SafeAreaProvider>
            <View style={{flex:1}}>
             <View style={{flex:0.1}}>
                <MyHeader
                        title='Reciver Details'
                        bellPressAction={()=>{this.props.navigation.navigate('Notification')}}
                        barPressAction={()=>{this.props.navigation.toggleDrawer()}}/>
              </View>
              <View style={{ flex: 0.3 }}>
            <Card title={'Book Information'} titleStyle={{ fontSize: 20 }}>
              <Card>
                <Text style={{ fontWeight: 'bold' }}>
                  Name : {this.state.bookName}
                </Text>
              </Card>

              <Card>
                <Text style={{ fontWeight: 'bold' }}>
                  Description : {this.state.description}
                </Text>
              </Card>
            </Card>
          </View>
              <View style={{flex:0.3}}>
                <Card
                    title={"Reciver Information"}
                    titleStyle={{fontSize:20,fontWeight:'bold'}}>
                    <Card>
                        <Text style={{fontWeight:'bold'}}>Name: {this.state.reciverName}</Text>
                    </Card>
                    <Card>
                        <Text style={{fontWeight:'bold'}}>Contact: {this.state.reciverContact}</Text>
                    </Card>
                    <Card>
                        <Text style={{fontWeight:'bold'}}>Address: {this.state.reciverAddress}</Text>
                    </Card>
                </Card>
                </View>
                <View style={{alignItems:'center',justifyContent:'center',flex:0.3}}>
                    {this.state.reciverId !== this.state.donorId?
                        (<TouchableOpacity
                            style={styles.button}
                            onPress={()=>{
                                this.updateBookStatus();
                                this.addNotification();
                                this.props.navigation.navigate('Donations');
                            }}>
                                <Text style={{textAlign:'center'}}>I Want To Donate</Text>
                        </TouchableOpacity>)
                        :null}
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