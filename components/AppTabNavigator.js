import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Donate from '../screens/DonateScreen';
import Request from '../screens/RequestScreen';

export const AppTabNavigator = createBottomTabNavigator({
        RequestBook: {screen: Request},
        DonateBook: {screen: Donate}
    },
    {
        defaultNavigationOptions: ({ navigation }) =>({
          tabBarIcon: () =>{
            const routeName = navigation.state.routeName;
    
            if (routeName === 'RequestBook') {
              return (
                <Image style={{width:40,height:40}} source={require('../assets/request.png')}/>
              )
            } else if (routeName === 'DonateBook') {
              return (
                <Image style={{width:40,height:40}} source={require('../assets/donate.png')}/>
              )
            }
          },
          tabBarLabel: () =>{
            const routeName = navigation.state.routeName;
    
            if (routeName === 'RequestBook') {
              return <Text style={{textAlign:'center'}}>Request A Book</Text>
            } else if (routeName === 'DonateBook') {
                return <Text style={{textAlign:'center'}}>Donate A Book</Text>
            }
          },
          tabBarOptions: {
            activeTintColor:'black',
            activeBackgroundColor:'#ccc',
            style: {
                backgroundColor: '#f7f7f7',
                height: 70
            },
          }
        })
    }
)