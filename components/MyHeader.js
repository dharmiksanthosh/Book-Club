import * as React from 'react';
import { View } from 'react-native';
import { Header, Icon, Badge } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import { DrawerActions } from 'react-navigation-drawer';

export default class MyHeader extends React.Component{
    constructor(props){
        super(props)
        this.state={
          userId : firebase.auth().currentUser.email,
          value:''
        }
    }
    getNumberOfNotifications = async()=>{
        console.log(this.state.userId)
        await db.collection('allNotification')
            .where('notificationStatus','==','unread')
            .where('targetId','==',this.state.userId)
            .onSnapshot((snapshot=>{
                var unreadNotifications = snapshot.docs.map(doc=>doc.data())
                this.setState({
                    value: unreadNotifications.length
                })
            }))
    }
    BellwithBadge = ()=>{
        return(
            <View>
                <Icon name='bell' type='font-awesome' color='white' onPress={()=>{this.props.bellPressAction()}}/>
                <Badge
                    value={this.state.value}
                    containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                    />
            </View>
        )
    }
    componentDidMount=()=>{
        this.getNumberOfNotifications();
    }
    render(){
        return(
            <Header
                leftComponent={<Icon name='bars' type='font-awesome' color='white'  onPress={()=>{this.props.barPressAction()}}/>}
                centerComponent={{ text: this.props.title, style: { color: 'black', fontSize:20,fontWeight:"bold" } }}
                rightComponent={<this.BellwithBadge {...this.props}/>}
                backgroundColor = "#f4c92d" />
        )
    }
}
