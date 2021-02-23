import * as React from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Platform } from 'react-native';
import db from '../config';
import firebase from 'firebase'
import { Header } from 'react-native-elements';
import Constants from 'expo-constants';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert } from 'react-native';

export default class UserDetail extends React.Component{
    constructor(){
        super();
        this.state={
            first_name: '',
            last_name: '',
            address: '',
            contact: '',
            emailId: '',
            docId: ''
        }
    }
    getUserDetails = async ()=>{
        var user = firebase.auth().currentUser;
        console.log(user,firebase.auth());
        var email = user.email;
        db.collection('Users')
            .where('username','==',email)
            .get()
            .then(snapshot=>{
                snapshot.forEach(doc=>{
                    var data = doc.data();
                    this.setState({
                        emailId:data.username,
                        first_name:data.first_name,
                        last_name:data.last_name,
                        address:data.address,
                        contact:data.contact,
                        docId:doc.id
                    })
                })
            })
    }
    updateUserDeatils = ()=>{
        db.collection('Users')
            .doc(this.state.docId)
            .update({
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                address: this.state.address,
                contact: this.state.contact,
            })
        Alert.alert('Profile Updated')
    }
    componentDidMount(){
        this.getUserDetails();
    }
    render(){
        return(
            <SafeAreaProvider>
            <KeyboardAvoidingView behavior={Platform.OS === "android" ? "padding" : "height"} style={[styles.container,{paddingTop:Constants.statusBarHeight}]}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                    <View>
                        <Header
                            centerComponent={{ text: 'Update Profile', style: { color: '#000', fontWeight: 'bold', fontSize: '30' }}}
                            containerStyle={{
                                backgroundColor: '#f4c92d'}}/>
                    </View>
                    <View style={{flex:1,alignItems:'center'}}>
                        <TextInput
                            style={styles.modalInput}
                            placeholder={"First Name"}
                            onChangeText={(text)=>{this.setState({first_name:text})}}
                            maxLength={15}
                            value={this.state.first_name}/>
                        <TextInput
                            style={styles.modalInput}
                            placeholder={"Last Name"}
                            onChangeText={(text)=>{this.setState({last_name:text})}}
                            maxLength={15}
                            value={this.state.last_name}/>
                        <TextInput
                            style={styles.modalInput}
                            value={this.state.emailId}/>
                        <TextInput
                            style={styles.modalInput}
                            placeholder={"Address"}
                            onChangeText={(text)=>{this.setState({address:text})}}
                            multiline={true}
                            value={this.state.address}/>
                        <TextInput
                            style={styles.modalInput}
                            placeholder={"Mobile no"}
                            onChangeText={(text)=>{this.setState({contact:text})}}
                            maxLength={10}
                            keyboardType={'number-pad'}
                            value={this.state.contact}/>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={()=>{this.updateUserDeatils()}}>
                                <Text style={{fontSize:15,textAlign:'center'}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            </SafeAreaProvider>
        );
    }
} 

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    input: {
        width:250,
        height:35,
        borderWidth:2,
        borderRadius:10,
        paddingLeft:35
    },
    button: {
        height:30,
        width:90,
        borderWidth:2,
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#e8a41f',
        alignSelf: 'center'
    },
    modalInput: {
        width:250,
        height:35,
        borderWidth:2,
        borderRadius:10,
        marginHorizontal:15,
        marginBottom:5,
        paddingLeft:10
    },
    modalTitle: {
        fontSize:35,
        fontWeight:'bold',
        alignSelf:'center',
        margin:10
    },
    modalScroll: {
        width:'100%'
    }
  });