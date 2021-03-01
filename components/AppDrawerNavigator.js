import * as React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import MyDonation from '../screens/MyDonation';
import UserDetail from '../screens/UserDetailScreen';
import { AppTabNavigator } from './AppTabNavigator';
import SideBarMenu from './SideBarMenu';

export const AppDrawerNavigator = createDrawerNavigator(
    {
        Home:{screen:AppTabNavigator},
        Profile:{screen:UserDetail},
        Donations:{screen:MyDonation}
    },
    {
        contentComponent:SideBarMenu
    },
    {
        initialRouteName:'Home'
    }
)