import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import firebase from 'firebase';

export default class SideBarMenu extends React.Component {
    render(){
        return(
            <View style={{flex:8,marginTop:10}}>
                <Text style={{fontSize:30,fontWeight:'bold'}}>Side Bar Menu</Text>
                <DrawerItems
                    {...this.props}/>
                <View style={{flex:2,justifyContent:'flex-end',paddingBottom:30}}>
                    <TouchableOpacity
                        style={{height:30,width:'100%',justifyContent:'center',padding:10}}
                        onPress={()=>{
                            this.props.navigation.navigate('Welcome')
                            firebase.auth().signOut()
                        }}>
                            <Text style={{fontSize:15,fontWeight:'bold'}}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}