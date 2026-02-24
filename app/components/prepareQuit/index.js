import React from 'react';
import { Text, View } from 'react-native';
import { getPageLang } from '../../languages';
import styles from './style';

class PrepareQuit extends React.Component {

    constructor(props) {
        super(props);
        this.pagelang = getPageLang('preparequit');
        this.state = {
            title: this.pagelang['title'],
            counter: 3000,  //seconds
            started: props.started
        }
        this.timeout = null;
        if(props.started){
            this.timeout = setTimeout(()=>{
                this.cancel();
            }, this.state.counter);
        }
    }

    componentWillReceiveProps=(props)=>{
        
        this.state.started = props.started;
        if(props.started){
            if(this.timeout!=null){
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.timeout = setTimeout(()=>{
                this.cancel();
            }, this.state.counter);
        }
    }

    cancel=()=>{
        clearTimeout(this.timeout);
        this.timeout = null;
        this.props.cancel();
    }

    render() {
        return (
            <View style={styles.viewContainer}>
                <View style={styles.floatingTextContainer}>
                    <Text style={styles.floatingText}>{this.state.title}</Text>
                </View>
            </View >
        )
    }
}

export default PrepareQuit;