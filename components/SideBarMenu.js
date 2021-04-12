import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import firebase from 'firebase';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker'
import db from '../config';

export default class SideBarMenu extends React.Component {
    constructor(){
        super();
        this.state={
            userId: firebase.auth().currentUser.email,
            image: '#',
            name: '',
            docId: ''
        }
    }
    getUsername = async ()=>{
        db.collection('Users')
            .where('username','==',this.state.userId)
            .onSnapshot(snapshot=>{
                snapshot.forEach(doc=>{this.setState({
                    name: doc.data().first_name
                })})
            })
    }
    fetchImage = async (username)=>{
        var ref = firebase.storage().ref().child('userProfile/'+username)
        ref.getDownloadURL().then(url=>{
            this.setState({
                image: url
            })
        })
        .catch(error=>{
            this.setState({
                image: '#'
            })
        })
    }
    uploadImage = async (uri,username)=>{
        var response = await fetch(uri);
        var blob = await response.blob();
        var ref = firebase.storage().ref().child('userProfile/'+username)
        return(
            ref.put(blob).then(response=>{this.fetchImage(username)})
        )
    }
    getPicture = async ()=>{
        const{cancelled,uri} = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4,3],
                quality: 1
            }
        )
        if (!cancelled) {
            this.setState({
                image: uri
            })
            this.uploadImage(uri,this.state.userId)
        }
    }
    componentDidMount(){
        this.fetchImage(this.state.userId);
        this.getUsername();
    }
    render(){
        console.log(this.state.name)
        return(
            <View style={{flex:8,marginTop:10}}>
                <View style={{flex:2,alignItems:'center'}}>
                    <Avatar
                        rounded={true}
                        source={{uri:this.state.image}}
                        size='medium'
                        onPress={this.getPicture}
                        containerStyle={styles.imageContainer}
                        showEditButton/>
                    <Text style={styles.textStyle}>{this.state.name}</Text>
                </View>
                <View style={{flex:7}}>
                    <DrawerItems
                        {...this.props}/>
                    <View style={{flex:2,justifyContent:'flex-end',paddingBottom:20}}>
                        <TouchableOpacity
                            style={{height:30,width:'100%',justifyContent:'center',padding:10,marginBottom:20}}
                            onPress={()=>{
                                this.props.navigation.navigate('Welcome')
                                firebase.auth().signOut()
                            }}>
                                <Text style={{fontSize:15,fontWeight:'bold'}}>Logout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{height:30,width:'100%',justifyContent:'center',padding:10}}
                            onPress={()=>{
                                this.props.navigation.toggleDrawer();
                            }}>
                                <Text style={{fontSize:15,fontWeight:'bold'}}>Close Drawer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    imageContainer:{
        width:100,
        height:100,
        borderRadius:'25%',

    },
    textStyle:{
        fontSize:20,
        fontWeight:'bold'
    }
})