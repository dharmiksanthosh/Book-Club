import * as React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import firebase from 'firebase'
import db from '../config'
import { Header, ListItem } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Constants from 'expo-constants'

export default class MyDonation extends React.Component{
    constructor(){
        super();
        this.state={
            donorId: firebase.auth().currentUser.email,
            allDonations: [],
            donorName: ''
        }
    }
    getAllDonation = ()=>{
        db.collection('allDonations')
            .where('donorId','==',this.state.donorId)
            .onSnapshot((snapshot)=>{
                var allDonations = snapshot.docs.map(document=>document.data())
                this.setState({
                    allDonations: allDonations
                })
            })
    }
    getDonorDetails=()=>{
        db.collection('Users')
            .where('username','==',this.state.donorId)
            .get()
            .then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    this.setState({
                        donorName: doc.data().firstName+' '+doc.data().lastName
                    })
                })
            })
    }
    componentDidMount(){
        this.getAllDonation()
        this.getDonorDetails()
    }
    sendNotification = (bookDetails,requestStatus)=>{
        var reciverId = bookDetails.targetId;
        var requestStatus = requestStatus;
        var donorId = bookDetails.donorId;
        db.collection('allNotification')
            .where('targetId','==',reciverId)
            .where('donorId','==',donorId)
            .get()
            .then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    var message = '';
                    if (requestStatus === 'bookSend') {
                        message = this.state.donorName+' sent you the book'
                    } else {
                        message = this.state.donorName+' has shown interest in donating the book'
                    }
                    db.collection('allNotification')
                        .doc(docId)
                        .update({
                            'message': message,
                            'notificationStatus': 'unread',
                            'date': firebase.firestore.FieldValue.serverTimestamp()
                        })
                })
            })
    }
    sendBook = (bookDetails)=>{
        if (bookDetails.requestStatus === 'book send') {
            var requestedStatus = 'donor interested'
            db.collection('allDonations')
                .doc(bookDetails.docId)
                .update({
                    'requestStatus': requestedStatus,
                })
            this.sendNotification(bookDetails,requestedStatus)
        } else {
            var requestedStatus = 'book send'
            db.collection('allDonations')
                .doc(bookDetails.docId)
                .update({
                    'requestStatus': requestedStatus,
                })
            this.sendNotification(bookDetails,requestedStatus)
        }
    }
    render(){
        return(
            <SafeAreaProvider>
            <View style={{paddingTop:Constants.statusBarHeight}}>
                <Header
                    centerComponent={{ text: 'My Donations', style: { color: '#000', fontWeight: 'bold', fontSize: '30' }}}
                    containerStyle={{
                        backgroundColor: '#f4c92d'}}/>
                <View>
                    <FlatList
                        keyExtractor={(item,index)=>index.toString()}
                        data={this.state.allDonations}
                        renderItem={({item,key})=>{
                            return (
                                <ListItem
                                    key={key}
                                    bottomDivider>
                                        <ListItem.Content style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                                            <ListItem.Title style={{color:'#000',fontWeight:'bold'}}>{item.bookName}</ListItem.Title>
                                            <ListItem.Subtitle style={{color:'#5f5',fontWeight:'bold'}}>{"Requested "+item.requestedBy}</ListItem.Subtitle>
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={()=>{this.sendBook(item)}}>
                                                    <Text style={{color:'black',textAlign:'center'}}>Send Book</Text>
                                            </TouchableOpacity>
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