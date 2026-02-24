import React from 'react';
import {
  AsyncStorage, BackHandler, Image, ScrollView, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import chevronLeft from '../../../assets/images/returnback.png';
import LoadingScreen from '../../../components/LoadingScreen';
import { getPageLang } from '../../../languages';
import globalStyles from '../../global.style';
import styles from './style';

class EditNameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.globallang = getPageLang('global');

    this.state = {
      title: 'Edit Full Name',
      canGoBack: true,
      canChangeCommunity: false,
      phonenumber: '',
      name: '',
      nickname: '',
      gender: '',
      genderId: '',
      profilepic: '',
      companyname: '',
      email: '',
      showLoading: false,
    };
  }

  retrieveData = async key => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  storeDataProfile = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };

  componentWillMount = props => {
    this.retrieveData('smart-app-id-login').then(info => {
      if (info === null) this.props.navigation.replace('Login');
    });
  };

  componentDidMount = props => {
    this.retrieveData('name').then(name => {
      console.log(name);
      if (name !== null) {
        name = JSON.parse(name);
        this.setState({
          name: name.name,
        });
      } else {
        this.retrieveData('smart-app-id-login').then(info => {
          if (info !== null) {
            console.log(info);

            info = JSON.parse(info);
            this.setState({
              phonenumber: info.phonenumber,
              name: info.name,
              nickname: info.nickname,
              gender: info.gender,
              // genderId: info.genderId,
              profilepic: info.profilepic,
              dob: info.dob,
              email: info.email,
            });
          }
        });
      }
    });

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  };

  handleBackPress = () => {
    this.goBack();
  };

  goBack = () => {
    this.props.navigation.replace('Profile');
  };

  storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };

  doChangeName = () => {
    let params = {
      name: this.state.name,
    };
    console.log(params);
    this.storeDataProfile('name', JSON.stringify(params));
    this.props.navigation.replace('Profile');
  };

  changeCommunity(community) {
    global.community = community;
    //let d = new Date();
  }

  //----receive on message from webview
  receivePost(param) {}
  //------------------------------------

  refreshPage = () => {};

  renderLoading = () => {
    if (this.state.showLoading) {
      return <LoadingScreen />;
    }
  };

  render() {
    return (
      <View style={globalStyles.screenContainer}>
        <View
          style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
          <View style={styles.headerTitle}>
            <View style={{flex: 0, flexDirection: 'column', paddingLeft: 14}}>
              <TouchableOpacity onPress={() => this.handleBackPress()}>
                <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                  <Image style={{height: 20, width: 20}} source={chevronLeft} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.textContentTitle}>
              <Text style={styles.fontTextTitle}>{this.state.title}</Text>
            </View>
            <View style={{flex: 0, flexDirection: 'column', paddingRight: 14}}>
              <TouchableOpacity onPress={() => this.doChangeName()}>
                <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                  <Text style={styles.determine}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.formContainer}>
                <TextInput
                  autoCapitalize="words"
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#000"
                  placeholder="Please enter your full name"
                  value={this.state.name}
                  onChangeText={text => this.setState({name: text})}
                />
              </View>
            </ScrollView>
          </View>
        </View>
        {this.renderLoading()}
      </View>
    );
  }
}

export default EditNameScreen;
