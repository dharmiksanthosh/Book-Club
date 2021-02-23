import { createStackNavigator } from 'react-navigation-stack';
import Donate from '../screens/DonateScreen';
import ReciverDetails from '../screens/ReciverDetail';

export const AppStackNavigator = createStackNavigator(
    {
        BookDonateList: {
            screen: Donate
        },
        ReciverList: {
            screen: ReciverDetails
        }
    },
    {
        initialRouteName:'BookDonateList',
    }
)