import * as React from 'react';
import LottieView from 'lottie-react-native';

export default class Lottie extends React.Component {
    render(){
        return(
            <LottieView
                source={require('../assets/book-anim.json')}
                style={{width:'60%',height:'60%'}}
                autoPlay loop/>
        )
    }
}