import * as React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import MyDonation from '../screens/MyDonation';
import UserDetail from '../screens/UserDetailScreen';
import { AppTabNavigator } from './AppTabNavigator';
import SideBarMenu from './SideBarMenu';
import Notification from '../screens/Notifications';
import { Icon } from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator(
    {
        Home:{
                screen:AppTabNavigator,
                navigationOptions:{
                    drawerIcon:<Icon name='home' type='fontawesome5'/>,
                    drawerLabel: 'Home'
                }
            },
        Profile:{
                    screen:UserDetail,
                    navigationOptions:{
                        drawerIcon:<Icon name='settings' type='fontawesome5'/>,
                        drawerLabel: 'Profile'
                    }
                },
        Donations:{
                    screen:MyDonation,
                    navigationOptions:{
                        drawerIcon:<Icon name='gift' type='font-awesome'/>,
                        drawerLabel: 'My Donations'
                    }
                },
        Notification:{
                        screen:Notification,
                        navigationOptions:{
                            drawerIcon:<Icon name='bell' type='font-awesome'/>,
                            drawerLabel: 'Notifications'
                        }
                    }
    },
    {
        contentComponent:SideBarMenu
    },
    {
        initialRouteName:'Home'
    }
)