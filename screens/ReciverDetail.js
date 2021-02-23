import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import firebase from 'firebase';
import db from '../config'
import { Card, Header } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class ReciverDetails extends React.Component {
    constructor(props){
        super(props);
        this.state={
            userId: firebase.auth().currentUser.email,
            reciverId: this.props.navigation.getParam('details')['username'],
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
        db.collection('Users')
            .where('username','==',this.state.reciverId)
            .get()
            .then(snapshot=>{
                snapshot.forEach(doc=>{
                    var data = doc.data();
                    this.setState({
                        reciverName:data.firstName,
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
                donorId:this.state.userId,
                requestStatus:"Donor is Interested"
            })
    }
    componentDidMount(){
        this.getReciverDetails();
    }
    render(){
        return(
            <SafeAreaProvider>
            <View>
                <Header
                    centerComponent={{ text: 'Reciver Details', style: { color: '#000', fontWeight: 'bold', fontSize: '30' }}}
                    containerStyle={{
                        backgroundColor: '#f4c92d'}}/>
                <Card
                    title={"Reciver Information"}
                    titleStyle={{fontWeight:20,fontWeight:bold}}>
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
                <View>
                    {this.state.reciverId !== this.state.userId?
                        (<TouchableOpacity
                            style={styles.button}
                            onPress={()=>{
                                this.updateBookStatus()
                                this.props.navigataion.navigate('MyDonation')
                            }}>
                                <Text>I Want To Donate</Text>
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
        width:40,
        height:20,
        backgroundColor:'orange'
    }
})