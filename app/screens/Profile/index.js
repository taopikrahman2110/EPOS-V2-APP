/* eslint-disable prettier/prettier */
/* eslint-disable dot-notation */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
import React from "react";
import {
  Alert,
  AsyncStorage,
  BackHandler,
  DatePickerAndroid,
  Image,
  PermissionsAndroid,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import ImagePickerCamera from "react-native-image-picker";
import chevronRight from "../../assets/images/next.png";
import LoadingScreen from "../../components/LoadingScreen";
import ModalPicker from "../../components/ModalPicker";
import { getPageLang } from "../../languages";
import globalStyles from "../global.style";
import styles from "./style";

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang("profile");
    this.globallang = getPageLang("global");

    this.state = {
      // eslint-disable-next-line dot-notation
      title: this.pagelang["title"],
      canGoBack: true,
      canChangeCommunity: false,

      phonenumber: "",
      name: "",
      nickname: "",
      gender: "",
      genderId: "",
      statusownerid: "",
      phonenumberOwner: "",
      profilepic: "",
      dob: "",
      businessqrcode: "",
      company: "",
      location: "",
      email: "",
      ktp: "",
      onlycollagues: 0,
      join: "",
      fields: {},
      errors: {},
      ImageSource: null,
      data: null,
      srcImg: "",
      uri: "",
      fileName: "",
      avatarSource: null,
      openModal: false,
      isDateTimePickerVisible: false,
      showLoading: false,
      loginInfo: {},
      imageAvatar: [],
      statusbinding: "",
      clusterInfo: [{ cluster: "", unit: "" }],
      unitCheck: [],
      custom_company: "",
      partment: "",
      idType: "",
      nationality: "",
    };
  }

  retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  retrieveData2 = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };

  componentWillMount = (props) => {
    this.retrieveData("smart-app-id-login").then((info) => {
      if (info === null) this.props.navigation.replace("Login");
    });
  };

  componentDidMount = (props) => {
    this.retrieveData2("smart-app-id-login").then((info) => {
      if (info !== null) {
        this.setState({ loginInfo: JSON.parse(info) });
        console.log(info);
      } else this.props.navigation.replace("Login");
    });

    this.retrieveData("smart-app-id-login").then((info) => {
      if (info !== null) {
        info = JSON.parse(info);
        this.setState({
          ...this.state,
          phonenumber: info.phonenumber,
          email: info.email,
          name: info.name,
          nickname: info.nickname,
          gender: info.gender,
          genderId: info.genderId,
          statusownerid: info.statusownerid,
          dob: info.dob,
          profilepic: info.profilepic,
          phonenumberOwner: info.phonenumberOwner,
          statusbinding: info.statusbinding,
          ktp: info.ktp,
          custom_company: info.custom_company,
          partment: info.partment,
          idType: info.idType === "ID CARD" ? "KTP" : info.idType,
          nationality: info.nationality,
        });
        if (info.clusterInfo.length === 0) {
          this.setState({
            clusterInfo: [{ cluster: "", unit: "" }],
            unitCheck: [],
          });
        } else {
          this.setState({
            clusterInfo: info.clusterInfo,
            unitCheck: info.clusterInfo,
          });
        }
      } else this.props.navigation.replace("Login");
      console.log(info);

      this.retrieveData("imgProfile").then((imgProfile) => {
        console.log(imgProfile);
        if (imgProfile !== null) {
          imgProfile = JSON.parse(imgProfile);
          this.setState({
            ImageSource: imgProfile,
          });
        }
      });

      this.retrieveData("profilepic").then((profilepic) => {
        console.log(profilepic);
        if (profilepic !== null) {
          profilepic = JSON.parse(profilepic);
          this.setState({
            imageAvatar: profilepic,
          });
        }
      });

      this.retrieveData("name").then((name) => {
        console.log(name);
        if (name !== null) {
          name = JSON.parse(name);
          this.setState({
            name: name.name,
          });
        }
      });

      this.retrieveData("nickname").then((nickname) => {
        console.log(nickname);
        if (nickname !== null) {
          nickname = JSON.parse(nickname);
          this.setState({
            nickname: nickname.nickname,
          });
        }
      });

      this.retrieveData("gender").then((gender) => {
        console.log(gender);
        if (gender !== null) {
          gender = JSON.parse(gender);
          this.setState({
            gender: gender.gender,
            genderId: gender.genderId,
          });
        }
      });

      this.retrieveData("dob").then((dob) => {
        console.log(dob);
        if (dob !== null) {
          dob = JSON.parse(dob);
          this.setState({
            dob: dob.dob,
          });
        }
      });

      this.retrieveData("email").then((email) => {
        console.log(email);
        if (email !== null) {
          email = JSON.parse(email);
          this.setState({
            email: email.email,
          });
        }
      });

      this.retrieveData("ktp").then((ktp) => {
        console.log(ktp);
        if (ktp !== null) {
          ktp = JSON.parse(ktp);
          this.setState({
            ktp: ktp.ktp,
          });
        }
      });

      this.retrieveData("usertype").then((usertype) => {
        console.log(usertype);
        if (usertype !== null) {
          usertype = JSON.parse(usertype);
          this.setState({
            statusownerid: usertype.statusownerid,
            phonenumberOwner: usertype.phonenumberOwner,
            clusterInfo: usertype.clusterInfo,
          });
          this.setState({
            unitCheck: usertype.clusterInfo,
          });
        }
      });
    });

    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    //this.retrieveData('login-info');
  };

  componentWillUnmount() {
    AsyncStorage.removeItem("imgProfile");
    AsyncStorage.removeItem("profilepic");
    AsyncStorage.removeItem("name");
    AsyncStorage.removeItem("nickname");
    AsyncStorage.removeItem("gender");
    AsyncStorage.removeItem("dob");
    AsyncStorage.removeItem("email");
    AsyncStorage.removeItem("ktp");
    AsyncStorage.removeItem("usertype");
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera permission",
          message:
            "eposapp needs access to your camera " +
            "So you can take great photos。",
          buttonNeutral: "Ask me later",
          buttonNegative: "Cancel",
          buttonPositive: "Ok",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  doSelectPhotoStaff = () => {
    Alert.alert(
      "Information",
      "Bila ganti foto, harus hubungi Admin",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
    return false;
  };

  doSelectPhotoTapped() {
    const options = {
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePickerCamera.showImagePicker(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log(response.fileName);
        let source = { uri: "data:image/jpeg;base64," + response.data };
        console.log(source);

        this.storeData("imgProfile", JSON.stringify(source));

        let multipleImage = this.state.imageAvatar;
        multipleImage.push({ image: source.uri });
        let pushImage = multipleImage;
        this.storeData("profilepic", JSON.stringify(pushImage));
        this.setState({
          imageAvatar: pushImage,
        });

        this.setState({
          srcImg: { uri: response.uri },
          uri: response.uri,
          fileName: response.fileName,
          ImageSource: source,
          profilepic: source.uri,
        });
      }
    });

    this.requestCameraPermission();
  }

  changeDOB = async () => {
    //------FOR ANDROID------
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(this.state.dob),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        let tmpmonth = month + 1;
        tmpmonth = tmpmonth > 9 ? tmpmonth : "0" + tmpmonth;

        let tmpday = day;
        tmpday = tmpday > 9 ? tmpday : "0" + tmpday;

        this.setState({ dob: year + "-" + tmpmonth + "-" + tmpday });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
    //----------------------
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    this.setState({ dob: date, dobText: day + "-" + month + "-" + year });
    this._hideDateTimePicker();
  };

  getGenderList = () => {
    fetch(
      global.serverurl + global.webserviceurl + "/app_get_gender_list.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: JSON.stringify({}),
      }
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        else throw new Error("Something wrong with api server");
      })
      .then((response) => {
        if (response.status === "OK") {
          this.genderData = [];

          for (let i = 0; i < response.records.length; i++) {
            this.genderData.push({
              value: response.records[i].id,
              text: response.records[i].name,
            });
          }
          //if(this.state.genderId === 0 && this.genderData.length>0){
          this.setState({
            genderId: this.genderData[0].value,
            genderText: this.genderData[0].text,
          });
          //}
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doChange = () => {
    if (this.state.ImageSource === "") {
      Alert.alert(
        this.globallang.alert,
        "Please fill your picture",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
      return false;
    }

    if (this.state.profilepic === "") {
      Alert.alert(
        this.globallang.alert,
        "Please fill your picture",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
      return false;
    }

    let params = {
      phonenumber: this.state.phonenumber,
      name: this.state.name,
      nickname: this.state.nickname,
      gender: this.state.genderId,
      email: this.state.email,
      dob: this.state.dob,
      profilepic: this.state.profilepic,
    };

    console.log(params);
    this.setState({ showLoading: true });
    fetch(global.serverurl + global.webserviceurl + "/app_update_profile.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else throw new Error("Something wrong with api server");
      })
      .then((response) => {
        this.setState({ showLoading: false });
        console.log(response);
        if (response.status === "OK") {
          this.storeData(
            "smart-app-id-login",
            JSON.stringify(response.records[0])
          );
          this.props.navigation.replace("Home");
        } else {
          //error
          Alert.alert(
            this.globallang.alert,
            response.message,
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((error) => {
        this.setState({ showLoading: false });
        console.log(error);
      });
  };

  doSMSREQUEST = (phoneRequest) => {
    let params = {
      phonenumber: phoneRequest,
    };

    console.log(params);

    fetch(global.serverurl + global.webserviceurl + "/sms_request.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          return response.json();
        } else {
          Alert.alert(
            "Error",
            "Something wrong with api server",
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "unable to connect, check your internet connection.",
          [
            {
              text: this.globallang.ok,
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
        console.log(error);
      });
  };

  doSaveProfile = () => {
    if (this.state.imageAvatar !== "" || this.state.imageAvatar.length > 0) {
      var profileImg = [];
      var avatarImg = this.state.imageAvatar;

      avatarImg.map((imgValues, i) => {
        profileImg.push(imgValues.image);
      });
    } else {
      var profileImg = [];
    }

    let params = {
      phonenumber: this.state.phonenumber,
      profilepic: profileImg,
      name: this.state.name,
      nickname: this.state.nickname,
      gender: this.state.genderId,
      email: this.state.email,
      dob: this.state.dob,
      statusownerid: this.state.statusownerid,
      phonenumberOwner: this.state.phonenumberOwner,
      ktp: this.state.ktp,
      clusterInfo: this.state.clusterInfo,
    };

    console.log(params);
    this.setState({ showLoading: true });
    fetch(
      global.serverurl +
        global.webserviceurl +
        "/app_update_profile_20201123.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: JSON.stringify(params),
      }
    )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          return response.json();
        } else {
          Alert.alert(
            this.globallang.alert,
            "The upload failed, something went wrong while connecting to the server",
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false }
          );
          return false;
        }
      })
      .then((response) => {
        this.setState({ showLoading: false });
        if (response.status === "OK") {
          if (response.records.length === 0) {
            ToastAndroid.show(
              "Sorry, there was a problem with the server",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
          } else {
            if (
              this.state.statusownerid === 2 &&
              this.state.statusbinding !== 1
            ) {
              this.doSMSREQUEST(this.state.phonenumberOwner);
            }
            this.storeData(
              "smart-app-id-login",
              JSON.stringify(response.records[0])
            );
            AsyncStorage.removeItem("imgProfile");
            AsyncStorage.removeItem("profilepic");
            AsyncStorage.removeItem("name");
            AsyncStorage.removeItem("nickname");
            AsyncStorage.removeItem("gender");
            AsyncStorage.removeItem("dob");
            AsyncStorage.removeItem("email");
            AsyncStorage.removeItem("ktp");
            AsyncStorage.removeItem("usertype");
            this.props.navigation.replace("MyPage");
          }
        } else {
          //error
          ToastAndroid.show(
            response.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
      })
      .catch((error) => {
        this.setState({ showLoading: false });
        console.log(error);
      });
  };

  /* doSaveProfile = () => {
    if (this.state.imageAvatar !== '' || this.state.imageAvatar.length > 0) {
      var profileImg = [];
      var avatarImg = this.state.imageAvatar;

      avatarImg.map((imgValues, i) => {
        profileImg.push(imgValues.image);
      });
    } else {
      var profileImg = [];
    }

    if (this.state.statusownerid === 1) {
      if (this.state.ktp === '') {
        Alert.alert(
          'Warning',
          'Please enter your KTP/PASSPORT',
          [
            {
              text: this.globallang.ok,
              onPress: () => console.log('OK Pressed'),
            },
          ],
          {cancelable: false},
        );
        return false;
      } else if (this.state.unitCheck.length === 0) {
        Alert.alert(
          'Warning',
          'Please enter your cluster & unit number',
          [
            {
              text: this.globallang.ok,
              onPress: () => this.props.navigation.replace('EditUserType'),
            },
          ],
          {cancelable: false},
        );
        return false;
      }

      console.log(this.state.clusterInfo);
    }

    let params = {
      phonenumber: this.state.phonenumber,
      profilepic: profileImg,
      name: this.state.name,
      nickname: this.state.nickname,
      gender: this.state.genderId,
      email: this.state.email,
      dob: this.state.dob,
      statusownerid: this.state.statusownerid,
      phonenumberOwner: this.state.phonenumberOwner,
      ktp: this.state.ktp,
      clusterInfo: this.state.clusterInfo,
    };

    console.log(params);
    this.setState({showLoading: true});
    fetch(
      global.serverurl +
        global.webserviceurl +
        '/app_update_profile_20201123.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: JSON.stringify(params),
      },
    )
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          return response.json();
        } else {
          //   this.setState({
          //     showDialog: true,
          //   });
          Alert.alert(
            this.globallang.alert,
            'The upload failed, something went wrong while connecting to the server',
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log('OK Pressed'),
              },
            ],
            {cancelable: false},
          );
          return false;
        }
      })
      .then(response => {
        this.setState({showLoading: false});
        if (response.status === 'OK') {
          if (response.records.length === 0) {
            ToastAndroid.show(
              'Sorry, there was a problem with the server',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          } else {
            if (
              this.state.statusownerid === 2 &&
              this.state.statusbinding !== 1
            ) {
              this.doSMSREQUEST(this.state.phonenumberOwner);
            }
            this.storeData(
              'smart-app-id-login',
              JSON.stringify(response.records[0]),
            );
            AsyncStorage.removeItem('imgProfile');
            AsyncStorage.removeItem('profilepic');
            AsyncStorage.removeItem('name');
            AsyncStorage.removeItem('nickname');
            AsyncStorage.removeItem('gender');
            AsyncStorage.removeItem('dob');
            AsyncStorage.removeItem('email');
            AsyncStorage.removeItem('ktp');
            AsyncStorage.removeItem('usertype');
            this.props.navigation.replace('MyPage');
          }
        } else {
          //error
          ToastAndroid.show(
            response.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }
      })
      .catch(error => {
        this.setState({showLoading: false});
        console.log(error);
      });
  }; */

  renderModal = () => {
    if (this.state.openModal) {
      return (
        <ModalPicker
          data={this.genderData}
          selectedValue={this.state.genderId}
          onPick={(item) =>
            this.setState({
              genderId: item.value,
              genderText: item.text,
              openModal: false,
            })
          }
          onCancel={() => this.setState({ openModal: false })}
        />
      );
    }
  };

  handleBackPress = () => {
    this.props.navigation.replace("MyPage");
    return true;
  };

  goBack = () => {
    this.props.navigation.replace("MyPage");
  };

  goToEditName = () => {
    this.props.navigation.push("EditName");
  };

  goToEditNickname = () => {
    this.props.navigation.push("EditNickName");
  };

  goToEditGender = () => {
    this.props.navigation.push("EditGender");
  };

  goToEditDOB = () => {
    this.props.navigation.push("EditBOD");
  };

  goToEditEmail = () => {
    this.props.navigation.push("EditEmail");
  };

  goToEditKTP = () => {
    this.props.navigation.push("EditKTP");
  };

  goToEditMobilePhone = () => {
    // this.props.navigation.push('EditMobilePhone');
  };

  goToUserType = () => {
    if (this.state.loginInfo.statusownerid === 3) {
      this.props.navigation.push("EditUserType");
    } else if (
      this.state.loginInfo.statusownerid === 1 &&
      this.state.loginInfo.statusbinding === 1 &&
      this.state.loginInfo.clusterInfo.length === 0
    ) {
      this.props.navigation.push("EditUserType");
    } else if (
      this.state.loginInfo.statusownerid === 1 &&
      this.state.loginInfo.statusbinding === 0 &&
      this.state.loginInfo.clusterInfo.length === 0
    ) {
      this.props.navigation.push("EditUserType");
    } else if (
      this.state.loginInfo.statusownerid === 1 &&
      this.state.loginInfo.statusbinding === 1 &&
      this.state.loginInfo.clusterInfo.length > 0
    ) {
      Alert.alert(
        "Warning",
        "User type cannot be changed, you are currently the approved owner",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    } else if (
      this.state.loginInfo.statusownerid === 1 &&
      this.state.loginInfo.statusbinding === 0 &&
      this.state.loginInfo.clusterInfo.length > 0
    ) {
      Alert.alert(
        "Warning",
        "User type cannot be changed, your account is currently awaiting approval by customer service",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    } else if (
      this.state.loginInfo.statusownerid === 2 &&
      this.state.loginInfo.statusbinding === 0 &&
      this.state.loginInfo.phonenumberOwner !== "" &&
      this.state.loginInfo.typeRequestOwner === 1
    ) {
      Alert.alert(
        "Warning",
        "User type cannot be changed, your account is currently awaiting approval by the unit owner",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    } else if (
      this.state.loginInfo.statusownerid === 2 &&
      this.state.loginInfo.statusbinding === 0 &&
      this.state.loginInfo.phonenumberOwner === "" &&
      this.state.loginInfo.typeRequestOwner === 1
    ) {
      this.props.navigation.push("EditUserType");
    } else if (
      this.state.loginInfo.statusownerid === 2 &&
      this.state.loginInfo.statusbinding === 1 &&
      this.state.loginInfo.typeRequestOwner === 1 &&
      this.state.loginInfo.phonenumberOwner !== ""
    ) {
      Alert.alert(
        "Warning",
        "User type cannot be changed, your account has been approved by the unit owner",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    } else if (
      this.state.loginInfo.statusownerid === 2 &&
      this.state.loginInfo.statusbinding === 1 &&
      this.state.loginInfo.typeRequestOwner === 2 &&
      this.state.loginInfo.MultiOwner.length > 1
    ) {
      Alert.alert(
        "Warning",
        "User type cannot be changed, your account has been approved by the unit owner",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    } else if (
      this.state.loginInfo.statusownerid === 2 &&
      this.state.loginInfo.statusbinding === 0 &&
      this.state.loginInfo.typeRequestOwner === 2 &&
      this.state.loginInfo.MultiOwner.length > 1
    ) {
      this.props.navigation.push("EditUserType");
    }
  };

  /* goToUserType = () => {
    if (this.state.loginInfo.statusownerid === 3) {
      this.props.navigation.push('EditUserType');
    } else if (
      this.state.loginInfo.statusownerid === 1 &&
      this.state.loginInfo.statusbinding === 1 &&
      this.state.loginInfo.clusterInfo.length === 0
    ) {
      this.props.navigation.push('EditUserType');
    } else if (
      this.state.loginInfo.statusownerid === 1 &&
      this.state.loginInfo.statusbinding === 0 &&
      this.state.loginInfo.clusterInfo.length === 0
    ) {
      this.props.navigation.push('EditUserType');
    } else if (
      this.state.loginInfo.statusownerid === 1 &&
      this.state.loginInfo.statusbinding === 1 &&
      this.state.loginInfo.clusterInfo.length > 0
    ) {
      Alert.alert(
        'Warning',
        'User type cannot be changed, you are currently the approved owner',
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log('OK Pressed'),
          },
        ],
        {cancelable: false},
      );
    } else if (
      this.state.loginInfo.statusownerid === 1 &&
      this.state.loginInfo.statusbinding === 0 &&
      this.state.loginInfo.clusterInfo.length > 0
    ) {
      Alert.alert(
        'Warning',
        'User type cannot be changed, your account is currently awaiting approval by customer service',
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log('OK Pressed'),
          },
        ],
        {cancelable: false},
      );
    } else if (
      this.state.loginInfo.statusownerid === 2 &&
      this.state.loginInfo.statusbinding === 0 &&
      this.state.loginInfo.phonenumberOwner !== ''
    ) {
      Alert.alert(
        'Warning',
        'User type cannot be changed, your account is currently awaiting approval by the unit owner',
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log('OK Pressed'),
          },
        ],
        {cancelable: false},
      );
    } else if (
      this.state.loginInfo.statusownerid === 2 &&
      this.state.loginInfo.statusbinding === 0 &&
      this.state.loginInfo.phonenumberOwner === ''
    ) {
      this.props.navigation.push('EditUserType');
    } else if (
      this.state.loginInfo.statusownerid === 2 &&
      this.state.loginInfo.statusbinding === 1 &&
      this.state.loginInfo.phonenumberOwner !== ''
    ) {
      Alert.alert(
        'Warning',
        'User type cannot be changed, your account has been approved by the unit owner',
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log('OK Pressed'),
          },
        ],
        {cancelable: false},
      );
    }
  }; */

  renderStatusUserType = () => {
    if (this.state.statusownerid === 1) {
      return (
        <TouchableOpacity onPress={() => this.goToUserType()}>
          <View style={styles.formColumn}>
            <Text style={(styles.formColumnAlignRight, { color: "#255a8e" })}>
              I'm the owner
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (this.state.statusownerid === 2) {
      return (
        <TouchableOpacity onPress={() => this.goToUserType()}>
          <View style={styles.formColumn}>
            <Text style={(styles.formColumnAlignRight, { color: "#255a8e" })}>
              I'm not the owner
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (this.state.statusownerid === 3) {
      return (
        <TouchableOpacity onPress={() => this.goToUserType()}>
          <View style={styles.formColumn}>
            <Text style={(styles.formColumnAlignRight, { color: "#255a8e" })}>
              Visitor
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (this.state.statusownerid === 4) {
      return (
        <TouchableOpacity onPress={() => this.goToUserType()}>
          <View style={styles.formColumn}>
            <Text style={(styles.formColumnAlignRight, { color: "#255a8e" })}>
              Visitor
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
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
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <View style={styles.headerTitle}>
            <View style={{ flex: 0, flexDirection: "column", paddingLeft: 14 }}>
              <TouchableOpacity onPress={() => this.handleBackPress()}>
                <View
                  style={{ justifyContent: "center", flexDirection: "row" }}
                >
                  <Image
                    style={{ height: 20, width: 20, tintColor: "#255a8e" }}
                    source={require("../../assets/images/backretun.png")}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.textContentTitle}>
              <Text style={styles.fontTextTitle}>{this.state.title}</Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.formRowContainer1}>
                <View style={styles.Cardcontainer}>
                  <TouchableOpacity
                    onPress={
                      this.state.statusownerid === 3
                        ? this.doSelectPhotoTapped.bind(this)
                        : this.doSelectPhotoStaff.bind(this)
                    }
                  >
                    <View style={styles.formRow}>
                      <View style={styles.formColumn}>
                        <Text style={styles.formColumnAlignLeft}>
                          Profile Picture
                        </Text>
                      </View>
                      <View style={styles.formColumnPicture}>
                        {this.state.ImageSource === null ? (
                          <Image
                            source={
                              this.state.statusownerid === 3
                                ? this.state.profilepic === ""
                                  ? require("../../assets/images/user-default-profile.png")
                                  : { uri: this.state.profilepic }
                                : { uri: this.state.profilepic }
                            }
                            style={styles.picture}
                          ></Image>
                        ) : (
                          <Image
                            style={styles.picture}
                            source={this.state.ImageSource}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: "column",
                          alignItems: "flex-end",
                          paddingLeft: 6,
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          source={chevronRight}
                          style={{ height: 12, width: 12 }}
                          alt="dot"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      this.state.statusownerid === 3 ? this.goToEditName() : ""
                    }
                  >
                    <View style={styles.formRow}>
                      <View style={styles.formColumnlabel}>
                        <Text style={styles.label}>
                          {this.pagelang["name"]}
                        </Text>
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={styles.formColumnAlignRight}>
                          {this.state.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: "column",
                          alignItems: "flex-end",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          source={chevronRight}
                          style={{ height: 12, width: 12 }}
                          alt="dot"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      this.state.statusownerid === 3
                        ? this.goToEditGender()
                        : ""
                    }
                  >
                    <View style={styles.formRow}>
                      <View style={styles.formColumnlabel}>
                        <Text style={styles.label}>
                          {this.pagelang["gender"]}
                        </Text>
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={styles.formColumnAlignRight}>
                          {this.state.gender}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: "column",
                          alignItems: "flex-end",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          source={chevronRight}
                          style={{ height: 12, width: 12 }}
                          alt="dot"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  {this.state.statusownerid === 1 ? (
                    <TouchableOpacity>
                      <View style={styles.formRow1}>
                        <View style={styles.formColumnlabel}>
                          <Text style={styles.label}>Company</Text>
                        </View>
                        <View style={styles.formColumn}>
                          <Text style={styles.formColumnAlignRight}>
                            {this.state.custom_company}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 0,
                            flexDirection: "column",
                            alignItems: "flex-end",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={chevronRight}
                            style={{ height: 12, width: 12 }}
                            alt="dot"
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )}

                  {this.state.statusownerid === 1 ? (
                    <TouchableOpacity>
                      <View style={styles.formRow1}>
                        <View style={styles.formColumnlabel}>
                          <Text style={styles.label}>Partment</Text>
                        </View>
                        <View style={styles.formColumn}>
                          <Text style={styles.formColumnAlignRight}>
                            {this.state.partment}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 0,
                            flexDirection: "column",
                            alignItems: "flex-end",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={chevronRight}
                            style={{ height: 12, width: 12 }}
                            alt="dot"
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )}

                  {this.state.statusownerid === 3 ? (
                    <TouchableOpacity
                      onPress={() =>
                        this.state.statusownerid === 3 ? this.goToEditDOB() : ""
                      }
                    >
                      <View style={styles.formRow1}>
                        <View style={styles.formColumnlabel}>
                          <Text style={styles.label}>
                            {this.pagelang["dob"]}
                          </Text>
                        </View>
                        <View style={styles.formColumn}>
                          <Text style={styles.formColumnAlignRight}>
                            {this.state.dob}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 0,
                            flexDirection: "column",
                            alignItems: "flex-end",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={chevronRight}
                            style={{ height: 12, width: 12 }}
                            alt="dot"
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )}
                </View>
              </View>

              {this.state.statusownerid === 3 ? (
                <View style={styles.formRowContainer2}>
                  <View style={styles.Cardcontainer}>
                    <TouchableOpacity
                    // onPress={() => this.goToEditEmail()}
                    >
                      <View style={styles.formRow}>
                        <View style={styles.formColumnlabel}>
                          <Text style={styles.label}>
                            {this.pagelang["email"]}
                          </Text>
                        </View>
                        <View style={styles.formColumn}>
                          <Text style={styles.formColumnAlignRight}>
                            {this.state.email}
                          </Text>
                        </View>
                        {/* <View
                          style={{
                            flex: 0,
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                          }}>
                          <Image
                            source={chevronRight}
                            style={{height: 12, width: 12}}
                            alt="dot"
                          />
                        </View> */}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View style={styles.formRow}>
                        <View style={styles.formColumnlabel}>
                          <Text style={styles.label}>
                            {this.pagelang["phone"]}
                          </Text>
                        </View>
                        <View style={styles.formColumn}>
                          <Text style={styles.formColumnAlignRight}>
                            {this.state.phonenumber}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View style={styles.formRow1}>
                        <View style={styles.formColumnlabel}>
                          <Text style={styles.label}>NIK</Text>
                        </View>
                        <View style={styles.formColumn}>
                          <Text style={styles.formColumnAlignRight}>
                            {this.state.ktp}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <></>
              )}

              {/* {this.state.statusownerid === 3 ? (
                <View style={styles.formRowContainer3}>
                  <View style={styles.Cardcontainer}>
                    <TouchableOpacity>
                      <View style={styles.formRow}>
                        <View style={styles.formColumnlabel}>
                          <Text style={styles.label}>ID Type</Text>
                        </View>
                        <View style={styles.formColumn}>
                          <Text style={styles.formColumnAlignRight}>
                            {this.state.idType}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View style={styles.formRow1}>
                        <View style={styles.formColumnlabel}>
                          <Text style={styles.label}>Nationality</Text>
                        </View>
                        <View style={styles.formColumn}>
                          <Text style={styles.formColumnAlignRight}>
                            {this.state.nationality}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <></>
              )} */}

              {/* <View style={styles.formRowContainer3}>
                <View style={styles.Cardcontainer}>
                  <View style={styles.formRowType}>
                    <View style={styles.formColumn}>
                      <Text style={styles.label}>User Type</Text>
                    </View>
                    {this.renderStatusUserType()}
                  </View>
                </View>
              </View> */}

              {this.state.statusownerid === 3 ? (
                <View style={{ marginTop: 20, margin: 16 }}>
                  <TouchableOpacity onPress={() => this.doSaveProfile()}>
                    <View
                      style={{
                        backgroundColor: "#255a8e",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        height: 50,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          textAlign: "center",
                          color: "#fff",
                        }}
                      >
                        SAVE
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <></>
              )}
            </ScrollView>
            {/* <ScrollView style={styles.scrollView}>
              <View style={styles.formRowContainer1}>
                <View style={styles.Cardcontainer}>
                  <TouchableOpacity
                    onPress={this.doSelectPhotoTapped.bind(this)}>
                    <View style={styles.formRow}>
                      <View style={styles.formColumn}>
                        <Text style={styles.formColumnAlignLeft}>
                          Profile Picture
                        </Text>
                      </View>
                      <View style={styles.formColumnPicture}>
                        {this.state.ImageSource === null ? (
                          <Image
                            source={
                              this.state.profilepic === ''
                                ? require('../../assets/images/user-default-profile.png')
                                : {uri: this.state.profilepic}
                            }
                            style={styles.picture}
                          />
                        ) : (
                          <Image
                            style={styles.picture}
                            source={this.state.ImageSource}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          paddingLeft: 6,
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={chevronRight}
                          style={{height: 12, width: 12}}
                          alt="dot"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.goToEditName()}>
                    <View style={styles.formRow}>
                      <View style={styles.formColumnlabel}>
                        <Text style={styles.label}>
                          {this.pagelang['name']}
                        </Text>
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={styles.formColumnAlignRight}>
                          {this.state.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={chevronRight}
                          style={{height: 12, width: 12}}
                          alt="dot"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.goToEditNickname()}>
                    <View style={styles.formRow}>
                      <View style={styles.formColumnlabel}>
                        <Text style={styles.label}>Nick Name</Text>
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={styles.formColumnAlignRight}>
                          {this.state.nickname}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={chevronRight}
                          style={{height: 12, width: 12}}
                          alt="dot"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.goToEditGender()}>
                    <View style={styles.formRow}>
                      <View style={styles.formColumnlabel}>
                        <Text style={styles.label}>
                          {this.pagelang['gender']}
                        </Text>
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={styles.formColumnAlignRight}>
                          {this.state.gender}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={chevronRight}
                          style={{height: 12, width: 12}}
                          alt="dot"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.goToEditDOB()}>
                    <View style={styles.formRow1}>
                      <View style={styles.formColumnlabel}>
                        <Text style={styles.label}>{this.pagelang['dob']}</Text>
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={styles.formColumnAlignRight}>
                          {this.state.dob}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={chevronRight}
                          style={{height: 12, width: 12}}
                          alt="dot"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.formRowContainer2}>
                <View style={styles.Cardcontainer}>
                  <TouchableOpacity onPress={() => this.goToEditMobilePhone()}>
                    <View style={styles.formRow}>
                      <View style={styles.formColumnlabel}>
                        <Text style={styles.label}>
                          {this.pagelang['phone']}
                        </Text>
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={styles.formColumnAlignRight}>
                          {this.state.phonenumber}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={chevronRight}
                          style={{height: 12, width: 12}}
                          alt="dot"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.goToEditEmail()}>
                    <View style={styles.formRow}>
                      <View style={styles.formColumnlabel}>
                        <Text style={styles.label}>
                          {this.pagelang['email']}
                        </Text>
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={styles.formColumnAlignRight}>
                          {this.state.email}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={chevronRight}
                          style={{height: 12, width: 12}}
                          alt="dot"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.goToEditKTP()}>
                    <View style={styles.formRow1}>
                      <View style={styles.formColumnlabel}>
                        <Text style={styles.label}>KTP/Passport</Text>
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={styles.formColumnAlignRight}>
                          {this.state.ktp}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={chevronRight}
                          style={{height: 12, width: 12}}
                          alt="dot"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.formRowContainer3}>
                <View style={styles.Cardcontainer}>
                  <View style={styles.formRowType}>
                    <View style={styles.formColumn}>
                      <Text style={styles.label}>User Type</Text>
                    </View>
                    {this.renderStatusUserType()}
                  </View>
                </View>
              </View>
              <View style={{marginTop: 20, margin: 16}}>
                <TouchableOpacity onPress={() => this.doSaveProfile()}>
                  <View
                    style={{
                      backgroundColor: '#1990EA',
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      height: 50,
                      borderRadius: 8,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#fff',
                      }}>
                      SAVE
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView> */}
          </View>
        </View>
        {this.renderLoading()}
      </View>
    );
  }
}

export default ProfileScreen;
