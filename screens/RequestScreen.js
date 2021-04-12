import * as React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import firebase from 'firebase';
import db from '../config';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import MyHeader from '../components/MyHeader';
import { BookSearch } from 'react-native-google-books';

export default class Request extends React.Component {
    constructor(){
        super();
        this.state = {
            documentid: '',
            userId: firebase.auth().currentUser.email,
            bookName: '',
            requestId: '',
            description: '',
            requestStatus: '',
            requestedBookName: '',
            isBookRequestActive: '',
        }
    }
    createUniqueId = () =>{
        return Math.random().toString().substring(7)
    }
    addRequest =(bookName,description)=>{
        var user = firebase.auth().currentUser.email
        var randomRequestId = this.createUniqueId();
        db.collection('requested-books').add({
            'userId': user,
            'bookName': bookName,
            'description': description,
            'requestId': randomRequestId,
            'date': firebase.firestore.FieldValue.serverTimestamp(),
            'requestStatus': 'requested'
        })
        db.collection('Users')
            .where('username','==',user)
            .get()
            .then(snapshot=>{
                snapshot.forEach(doc=>{
                    db.collection('Users')
                        .doc(doc.id)
                        .update({
                            'isBookRequestActive': true
                        })
                })
            })

        this.setState({
            bookName: '',
            description: ''
        })
    }
    getBooksFromAPI=async(bookName)=>{
        this.setState({
            bookName: bookName
        })
        if(bookName.lenght>2){
            var book = await BookSearch.searchbook(bookName,'AIzaSyAFSjtoDEPY2_zfcOEznVO2yFgLX7KbRfw')
            console.log(book)
        }
    }
    getBookRequest=async()=>{
        var user = firebase.auth().currentUser.email;
        await db.collection('Users')
            .where('username','==',user)
            .onSnapshot((snapshot)=>{
                snapshot.forEach(doc=>{
                    this.setState({
                        isBookRequestActive: doc.data().isBookRequestActive
                    })
                    console.log(doc.data().isBookRequestActive)
                })
            })
    }
    getBookStatus=async()=>{
        var user = firebase.auth().currentUser.email;
        await db.collection('requested-books')
            .where('userId','==',user)
            .onSnapshot((snapshot)=>{
                snapshot.forEach(doc=>{
                    var id = doc.id
                    if(doc.data().requestStatus!='recived'){
                        this.setState({
                            requestId: doc.data().requestId,
                            requestedBookName: doc.data().bookName,
                            bookStatus: doc.data().bookStatus,
                            documentid: id
                        })
                    }
                })
            })
            console.log(this.state.documentid)
    }
    updateBookRequestStatus = ()=>{
        db.collection('requested-books')
            .doc(this.state.documentid)
            .update({
                requestStatus: 'recived'
            })
        
        db.collection('Users')
            .where('email','==',this.state.userId)
            .get()
            .then(snapshot=>{
                snapshot.forEach(doc=>{
                    db.collection('Users')
                        .doc(doc.id)
                        .update({
                            isBookRequestActive: false
                        })
                })
            })
    }
    sendNotification = ()=>{
        db.collection('Users')
            .where('email','==',this.state.userId)
            .get()
            .then(snapshot=>{
                snapshot.forEach(doc=>{
                    var name = doc.data().first_name;
                    db.collection('allNotification')
                        .where('requestid','==',this.state.requestId)
                        .get()
                        .then(snapshot=>{
                            snapshot.forEach(doc=>{
                                var donorId = doc.data().donorId
                                var bookName = doc.data().bookName
                                db.collection('allNotification')
                                    .add({
                                        targetId: donorId,
                                        message: name+' has recived '+bookName,
                                        notificationStatus: 'unread'
                                    })
                            })
                        })
                })
            })
    }
    /* componentDidMount(){
        this.getBookRequest()
        this.getBookStatus()
    } */
    render(){
        if (this.state.isBookRequestActive===true) {
            return(
                <SafeAreaProvider>
                <View style={{paddingTop:Constants.statusBarHeight}}>
                    <MyHeader
                        title='Request Books'
                        bellPressAction={()=>{this.props.navigation.navigate('Notification')}}
                        barPressAction={()=>{this.props.navigation.toggleDrawer()}}/>
                    <KeyboardAvoidingView style={{alignItems:'center',justifyContent:'center',flex:1}}>
                        <View style={{flex:1,justifyContent:'center'}}>
                            <Text
                                style={{justifyContent:'center',alignItems:'center'}}>
                                Book Name: {this.state.requestedBookName}
                            </Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={
                                            this.updateBookRequestStatus(),
                                            this.sendNotification()
                                        }>
                                <Text style={styles.buttonText}>Recived</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
                </SafeAreaProvider>
            )
        } else {
            return(
                <SafeAreaProvider>
                <View style={{paddingTop:Constants.statusBarHeight}}>
                    <MyHeader title='Request Books'/>
                    <KeyboardAvoidingView style={{alignItems:'center',justifyContent:'center',flex:1}}>
                        <View style={{flex:1,justifyContent:'center'}}>
                            <TextInput
                                style={[styles.input,{marginBottom:10,height:35}]}
                                placeholder={'Enter a Book Name'}
                                onChangeText={(text)=>{this.getBooksFromAPI(text)}}
                                value={this.state.bookName}/>
                            <TextInput
                                style={[styles.input,{marginBottom:10,height:50}]}
                                placeholder={'Why do you need the Book'}
                                multiline={true}
                                numberOfLines={8}
                                onChangeText={(text)=>{this.setState({description: text})}}
                                value={this.state.description}/>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={()=>{this.addRequest(this.state.bookName,this.state.description)}}>
                                <Text style={styles.buttonText}>Request</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
                </SafeAreaProvider>
            );
        }
    }
}
const styles = StyleSheet.create({
    input: {
        width:250,
        borderWidth:2,
        borderRadius:10
    },
    button: {
        width:50,
        height:20,
        backgroundColor: 'orange',
    }
})