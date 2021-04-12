import * as React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import firebase from 'firebase'
import db from '../config'
import { Header, ListItem } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Constants from 'expo-constants'
import MyHeader from '../components/MyHeader';

export default class MyDonation extends React.Component{
    constructor(){
        super();
        this.state={
            donorId: firebase.auth().currentUser,
            allDonations: [],
            donorName: '',
           }
    }
    getAllDonation = async()=>{
      var donor = this.state.donorId.email
        this.requestRef = await db.collection('allDonations').where('donorId','==',donor).onSnapshot((snapshot)=>{
       var donations = []
       console.log(donations);
       snapshot.docs.map((doc) =>{
         var donation = doc.data()
         donation["doc_id"] = doc.id
         donations.push(donation)
         
         this.setState({
            allDonations : donations,
        });
       });
       
     })
     console.log(this.state.allDonations)
   }
    getDonorDetails=async()=>{
      var user = this.state.donorId.email
       await db.collection('Users')
            .where('username','==',user)
            .get()
            .then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    this.setState({
                        donorName: doc.data().first_name+' '+doc.data().last_name
                    })
                })
            })
            console.log(this.state.donorName)
    }
    componentDidMount(){
        this.getAllDonation()
        this.getDonorDetails()
    }
    
    sendBook=(bookDetails)=>{
      var requestStatus
     if(bookDetails.requestStatus === "Book Sent"){
       requestStatus = "Donor is Interested"
       db.collection("allDonations").doc(bookDetails.doc_id).update({
         'requestStatus' : "Donor is Interested"
       })
       console.log(requestStatus)
       this.sendNotification(bookDetails,requestStatus)
     }
     else{
       requestStatus = "Book Sent"
       db.collection("allDonations").doc(bookDetails.doc_id).update({
        'requestStatus' : "Book Sent"
       })
       console.log(requestStatus)
       this.sendNotification(bookDetails,requestStatus)
     }
   }

    sendNotification = (bookDetails,requestStatus)=>{
      console.log("Reached Send Notification")
        var reciverId = bookDetails.targetId;
        console.log(reciverId)
        var donorId = bookDetails.donorId;
        console.log(donorId)
        db.collection('allNotification')
            .where('targetId','==',reciverId)
            .where('donorId','==',donorId)
            .get()
            .then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    var message = '';
                    if (requestStatus === 'Book Sent') {
                        message = this.state.donorName+' sent you the book'
                    } else {
                        message = this.state.donorName+' has shown interest in donating the book'
                    }
                    db.collection('allNotification')
                        .doc(doc.id)
                        .update({
                            'message': message,
                            'notificationStatus': 'unread',
                            'date': firebase.firestore.FieldValue.serverTimestamp()
                        })
                })
            })
    }



    render(){
        return(
            <SafeAreaProvider>
            <View style={{paddingTop:Constants.statusBarHeight}}>
                <MyHeader
                    title='My Donations'
                    bellPressAction={()=>{this.props.navigation.navigate('Notification')}}
                    barPressAction={()=>{this.props.navigation.toggleDrawer()}}/>
                <View>
                {console.log(this.state.allDonations)}
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