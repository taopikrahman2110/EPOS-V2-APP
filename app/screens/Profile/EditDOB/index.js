import React from 'react';
import {
  AsyncStorage, BackHandler, Image, ScrollView, Text, TouchableHighlight, TouchableOpacity, View
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import chevronLeft from '../../../assets/images/returnback.png';
import globalStyles from '../../global.style';
import styles from './style';

class EditBirthDateScreen extends React.Component {
  constructor(props) {
    super(props);
    let dob = new Date();
    let year = dob.getFullYear();
    let month = dob.getMonth() + 1;
    let day = dob.getDate();

    this.state = {
      title: 'Edit Date of Birth',
      canGoBack: true,
      canChangeCommunity: false,
      phonenumber: '',
      name: '',
      nickname: '',
      gender: '',
      profilepic: '',
      dob: '',
      dobText: day + '-' + month + '-' + year,
      businessqrcode: '',
      company: '',
      location: '',
      email: '',
      onlycollagues: 0,
      join: '',
      showLoading: false,
      options: [],
      genderId: '',
      isDateTimePickerVisible: false,
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
    this.retrieveData('dob').then(dob => {
      console.log(dob);
      if (dob !== null) {
        dob = JSON.parse(dob);
        this.setState({
          dob: dob.dob,
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

  showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

  hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  _handleDatePicked = date => {
    console.log(date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    this.setState({dob: year + '-' + month + '-' + day});
    this.hideDateTimePicker();
  };

  doChangeDOB = () => {
    let param = {
      dob: this.state.dob,
    };
    console.log(param);
    this.storeData('dob', JSON.stringify(param));
    this.props.navigation.replace('Profile');
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
                  this.doChangeDOB();
                }}>
                <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                  <Text style={styles.determine}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.formRowContainer1}>
                <View style={styles.formRow}>
                  <View style={styles.formColumnlabel}>
                    <Text style={styles.label}>Date of birth</Text>
                  </View>
                  <View style={styles.formColumn}>
                    {/* <Text style={styles.formColumnAlignRight}>
                      {this.state.dob}
                    </Text> */}
                    <TouchableHighlight
                      style={{width: '100%'}}
                      underlayColor={'rgba(0,0,0,0)'}
                      onPress={this.showDateTimePicker}>
                      <Text style={styles.formColumnAlignRight}>
                        {this.state.dob}
                      </Text>
                    </TouchableHighlight>
                  </View>
                  <View
                    style={{
                      flex: 0,
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this.hideDateTimePicker}
          date={new Date()}
        />
      </View>
    );
  }
}
export default EditBirthDateScreen;
