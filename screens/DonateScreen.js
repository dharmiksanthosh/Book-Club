import * as React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { ListItem } from 'react-native-elements';
import * as firebase from 'firebase';
import db from '../config';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReciverDetails from './ReciverDetail';
import MyHeader from '../components/MyHeader'

export default class Donate extends React.Component {
    constructor(){
        super()
        this.state={
            requestedBookList: [],
        }
    }
    getRequestedBookList =()=>{
        this.requestRef = db.collection('requested-books')
            .onSnapshot((snapshot)=>{
                var requestedBookList = snapshot.docs.map(document=>document.data());
                console.log(requestedBookList)
                this.setState({
                    requestedBookList: requestedBookList
                })
                console.log(this.state.requestedBookList)
            })
    }
    componentDidMount(){
        this.getRequestedBookList();
    }
    render(){
        return(
            <SafeAreaProvider>
            <View style={{paddingTop:Constants.statusBarHeight}}>
                <MyHeader
                    title='Donate Books'
                    bellPressAction={()=>{this.props.navigation.navigate('Notification')}}
                    barPressAction={()=>{this.props.navigation.toggleDrawer()}}
                />
                <View>
                    <FlatList
                        keyExtractor={(item,index)=>index.toString()}
                        data={this.state.requestedBookList}
                        renderItem={({item,key})=>{
                            return (
                                <ListItem
                                    key={key}
                                    bottomDivider>
                                        <ListItem.Content style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                                            <ListItem.Title style={{color:'#000',fontWeight:'bold'}}>{item.bookName}</ListItem.Title>
                                            <ListItem.Subtitle style={{color:'#5f5',fontWeight:'bold'}}>{item.description}</ListItem.Subtitle>
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={()=>{this.props.navigation.navigate('ReciverList',{'details':item})}}>
                                                    <Text style={{color:'black',textAlign:'center'}}>View</Text>
                                            </TouchableOpacity>
                                        </ListItem.Content>
                                </ListItem>
                            )
                        }}
                    />
                </View>
            </View>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
    button:{
        width:40,
        height:20,
        backgroundColor:'orange'
    }
})