import * as React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import UserDetail from '../screens/UserDetailScreen';
import { AppTabNavigator } from './AppTabNavigator';
import SideBarMenu from './SideBarMenu';

export const AppDrawerNavigator = createDrawerNavigator(
    {
        Home:{screen:AppTabNavigator},
        Profile:{screen:UserDetail},
    },
    {
        contentComponent:SideBarMenu
    },
    {
        initialRouteName:'Home'
    }
)