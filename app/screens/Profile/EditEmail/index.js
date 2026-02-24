import React from 'react';
import {
  Alert, AsyncStorage, BackHandler, Image, ScrollView, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import chevronLeft from '../../../assets/images/returnback.png';
import LoadingScreen from '../../../components/LoadingScreen';
import { getPageLang } from '../../../languages';
import globalStyles from '../../global.style';
import styles from './style';

class EditEmailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang('editnickname');
    this.globallang = getPageLang('global');

    this.state = {
      title: 'Edit Email',
      canGoBack: true,
      canChangeCommunity: false,
      phonenumber: '',
      name: '',
      nickname: '',
      gender: '',
      profilepic: '',
      dob: '',
      businessqrcode: '',
      company: '',
      location: '',
      email: '',
      onlycollagues: 0,
      join: '',
      showLoading: false,
    };
  }

  retrieveData = async key => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  componentWillMount = props => {
    this.retrieveData('smart-app-id-login').then(info => {
      if (info === null) this.props.navigation.replace('Login');
    });
  };

  componentDidMount = props => {
    this.retrieveData('email').then(email => {
      console.log(email);
      if (email !== null) {
        email = JSON.parse(email);
        this.setState({
          email: email.email,
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
              genderId: info.genderId,
              profilepic: info.profilepic,
              dob: info.dob,
              businessqrcode: info.businessqrcode,
              company: info.company,
              location: info.location,
              email: info.email,
              onlycollagues: info.onlycollagues,
              join: info.join,
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

  doChangeEmail = () => {
    let params = {
      email: this.state.email,
    };
    console.log(params);

    fetch(
      global.serverurl + global.webserviceurl + '/app_email_validation.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: JSON.stringify(params),
      },
    )
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          Alert.alert(
            'Error',
            'Something wrong with api server',
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log('OK Pressed'),
              },
            ],
            {cancelable: false},
          );
        }
      })
      .then(response => {
        console.log(response);
        if (response.status === 'OK') {
          Alert.alert(
            'Warning',
            'The email already exists',
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log('OK Pressed'),
              },
            ],
            {cancelable: false},
          );
        } else {
          this.storeData('email', JSON.stringify(params));
          this.props.navigation.replace('Profile');
        }
      })
      .catch(error => {
        this.setState({showLoading: false});
        Alert.alert(
          'Error',
          'unable to connect, check your internet connection.',
          [
            {
              text: this.globallang.ok,
              onPress: () => console.log('OK Pressed'),
            },
          ],
          {cancelable: false},
        );
        console.log(error);
      });
  };

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
              <TouchableOpacity onPress={() => this.doChangeEmail()}>
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
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#000"
                  placeholder="Please enter a new email"
                  value={this.state.email}
                  onChangeText={text => this.setState({email: text})}
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

export default EditEmailScreen;
