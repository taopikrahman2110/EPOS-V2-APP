import React from 'react';
import {
  AsyncStorage, BackHandler, Image, ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import chevronLeft from '../../../assets/images/returnback.png';
import LoadingScreen from '../../../components/LoadingScreen';
import { getPageLang } from '../../../languages';
import globalStyles from '../../global.style';
import styles from './style';

class EditGenderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang('editnickname');
    this.globallang = getPageLang('global');

    this.state = {
      title: 'Edit Gender',
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
      options: [],
      genderId: '',
    };
  }

  retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  componentWillMount = (props) => {
    this.retrieveData('smart-app-id-login').then((info) => {
      if (info === null) this.props.navigation.replace('Login');
    });
  };

  componentDidMount = (props) => {
    this.retrieveData('gender').then((gender) => {
      console.log(gender);
      if (gender !== null) {
        gender = JSON.parse(gender);
        this.setState({
          gender: gender.gender,
          genderId: gender.genderId,
        });
      } else {
        this.retrieveData('smart-app-id-login').then((info) => {
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
              email: info.email,
            });
          }
        });
      }
    });

    this.getGenderList();

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  };

  getGenderList = () => {
    fetch(
      global.serverurl + global.webserviceurl + '/app_get_gender_list.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: JSON.stringify({}),
      },
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        else throw new Error('Something wrong with api server');
      })
      .then((response) => {
        console.log(response);
        if (response.status === 'OK') {
          this.genderData = [];

          for (let i = 0; i < response.records.length; i++) {
            this.genderData.push({
              value: response.records[i].id,
              text: response.records[i].name,
            });
          }
          this.setState({
            options: this.genderData,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  RadioButton = () => {
    const {genderId} = this.state;
    return (
      <View>
        {this.state.options.map((item) => {
          return (
            <View key={item.value} style={styles.buttonContainer}>
              <Text style={styles.label}>{item.text}</Text>
              <TouchableOpacity
                style={styles.circle}
                onPress={() => {
                  this.setState({
                    genderId: item.value,
                    gender: item.text,
                  });
                }}>
                {genderId === item.value && (
                  <View style={styles.checkedCircle} />
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
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

  doChangeGender = () => {
    let param = {
      genderId: this.state.genderId,
      gender: this.state.gender,
    };
    console.log(param);
    this.storeData('gender', JSON.stringify(param));
    this.props.navigation.replace('Profile');
  };

  renderLoading = () => {
    if (this.state.showLoading) {
      return <LoadingScreen></LoadingScreen>;
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
              <TouchableOpacity
                onPress={() => {
                  this.doChangeGender();
                }}>
                <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                  <Text style={styles.determine}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.contentContainer}>
                <View style={styles.formRowContainer1}>
                  <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                      <Text>Please choose a new gender</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.formRowContainer2}>
                  <View style={styles.formColumn}>{this.RadioButton()}</View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
        {this.renderLoading()}
      </View>
    );
  }
}

export default EditGenderScreen;
