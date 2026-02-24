import React from 'react';
import {
  View
} from 'react-native';
import {
  BubblesLoader
} from 'react-native-indicator';
import { getPageLang } from '../../languages';
import styles from './style';

class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang('loadingscreen');
    this.state = {
      /*data: props.data,
            selectedValue : props.selectedValue,*/
    };
  }

  componentWillReceiveProps = props => {
    //this.setState({data:props.data, selectedValue:props.selectedValue});
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <View style={styles.loadingContainer}>
          <BubblesLoader size={60} color={'#fff'} dotRadius={10} />
          {/* <Image source={require('../../assets/images/loading-spinner.gif')} style={styles.spinnerImage}/> */}
        </View>
      </View>
    );
  }
}

export default LoadingScreen;
