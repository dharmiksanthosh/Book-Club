import * as React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { Header } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

export default class Request extends React.Component {
    constructor(){
        super();
        this.state = {
            userId: '',
            bookName: '',
            description: ''
        }
    }
    createUniqueId = () =>{
        return Math.random().toString().substring(7)
    }
    addRequest =(bookName,description)=>{
        var user = firebase.auth().currentUser;
        var randomRequestId = this.createUniqueId();
        db.collection('requested-books').add({
            'userId': user,
            'bookName': bookName,
            'description': description,
            'requestId': randomRequestId
        })
        this.setState({
            bookName: '',
            description: ''
        })
    }
    render(){
        return(
            <SafeAreaProvider>
            <View style={{paddingTop:Constants.statusBarHeight}}>
                <Header
                    centerComponent={{ text: 'Request Book', style: { color: '#000', fontWeight: 'bold', fontSize: '30' }}}
                    containerStyle={{
                        backgroundColor: '#f4c92d'}}/>
                <KeyboardAvoidingView style={{alignItems:'center',justifyContent:'center',flex:1}}>
                    <View style={{flex:1,justifyContent:'center'}}>
                        <TextInput
                            style={[styles.input,{marginBottom:10,height:35}]}
                            placeholder={'Enter a Book Name'}
                            onChangeText={(text)=>{this.setState({bookName: text})}}
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