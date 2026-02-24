import React from "react";
import {
  Alert,
  BackHandler,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountDown from "react-native-countdown-component";
import HeaderTitle from "../../components/headerTitle/index";
import LoadingScreen from "../../components/LoadingScreen";
import { getPageLang } from "../../languages";
import globalStyles from "../global.style";
import styles from "./style";
import { serverurl, webserviceurl } from "../../config";

class PasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang("password");
    this.globallang = getPageLang("global");

    this.state = {
      title: this.pagelang["title"],
      canGoBack: true,
      canChangeCommunity: false,
      phonenumber: "",
      passold: "",
      passnew: "",
      passconfirm: "",
      passwordValid: false,
      passwordconfirmValid: false,
      hidepassOld: true,
      hidePassword: true,
      hideConfirmPassword: true,
      isButtonDisabled: false,
      isTimer: false,
      code: "",
      codeOTP: "",
      otp: "",
      showLoading: false,
    };
  }

  _retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  componentDidMount = (props) => {
    this._retrieveData("smart-app-id-login").then((info) => {
      if (info !== null) {
        info = JSON.parse(info);
        this.setState({ ...this.state, phonenumber: info.phonenumber });
      } else this.props.navigation.replace("Login");

      console.log(info);
    });

    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  generateOTP = () => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    this.setState({ otp: OTP });
    return OTP;
  };

  _onFinishCheckingCode2(isValid, code) {
    console.log(isValid);
    if (!isValid) {
      Alert.alert(
        "Verification Code",
        "The codes don't match!",
        [{ text: "好" }],
        { cancelable: false }
      );
    } else {
      this.setState({ code, isTimer: false });
      setTimeout(function () {
        Alert.alert("Verification Code", "Success!", [{ text: "Ok" }], {
          cancelable: false,
        });
      }, 50);
    }
  }

  handleBackPress = () => {
    this.props.navigation.replace("Setting");
    return true;
  };

  goBack = () => {
    this.props.navigation.replace("Setting");
  };

  changeCommunity(community) {
    global.community = community;
    //let d = new Date();
    //this.setState({ webUri: global.serverurl + '/?community=' + community.code + '&t=' + d.getTime(), title: community.text, canGoBack: false, canChangeCommunity: true });
  }

  //----receive on message from webview
  receivePost(param) {
    //let jsonParam = JSON.parse(param);
    //this.setState({ title: jsonParam.title, canGoBack: jsonParam.canGoBack });
  }
  //------------------------------------

  refreshPage = () => {
    this.props.navigation.replace("MyPage");
    //let d = new Date();
    //this.setState({ webUri: global.serverurl + '/?page=mypage&community=' + global.community.code + '&t=' + d.getTime(), title: community.text, canGoBack: false, canChangeCommunity: true });
  };

  canBeSubmitted() {
    const { phonenumber, passold } = this.state;
    return phonenumber.length > 0 && passold.length > 0;
  }

  managePasswordOldVisibility = () => {
    this.setState({ hidepassOld: !this.state.hidepassOld });
  };

  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };

  manageConfirmPasswordVisibility = () => {
    this.setState({ hideConfirmPassword: !this.state.hideConfirmPassword });
  };

  validatePassword = (text) => {
    console.log(text);
    // let reg = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    let reg = /^.{6,50}$/;
    if (reg.test(text) === false) {
      console.log("Password is Not Correct");
      // Alert.alert(this.globallang.alert, this.pagelang.phonenumbercorrect, [{ text: this.globallang.ok, onPress: () => console.log('OK Pressed') }], { cancelable: false });
      this.setState({ passnew: text, passwordValid: false });
      console.log(this.state.passwordValid);
      return false;
    } else {
      this.setState({ passnew: text, passwordValid: true });
      console.log(this.state.passwordValid);
      console.log("Password is Correct");
    }
  };

  onErrorPass() {
    if (this.state.passnew === "") {
      return null;
    }
    if (this.state.passwordValid === false) {
      return (
        <Text style={{ color: "red", fontSize: 11 }}>
          * The password must be a combination of letters, numbers, or symbols
          of at least 6 digits, without spaces
        </Text>
      );
    }
    {
      return (
        <Text style={{ color: "green", fontSize: 11 }}>* Password match </Text>
      );
    }
  }

  validatePasswordConfirm = (text) => {
    console.log(text);
    // let reg = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    let reg = /^.{6,50}$/;
    if (reg.test(text) === false) {
      console.log("Password Confirm is Not Correct");
      this.setState({ passconfirm: text, passwordconfirmValid: false });
      console.log(this.state.passwordconfirmValid);
      return false;
    } else {
      this.setState({ passconfirm: text, passwordconfirmValid: true });
      console.log(this.state.passwordconfirmValid);
      console.log("Password Confirm is Correct");
    }
  };

  onErrorPassConfirm() {
    if (this.state.passconfirm === "") {
      return null;
    }
    if (
      this.state.passnew !== this.state.passconfirm ||
      this.state.passwordValid === false
    ) {
      return (
        <Text style={{ color: "red", fontSize: 11 }}>
          * Must be the same as the password created
        </Text>
      );
    }
    {
      return (
        <Text style={{ color: "green", fontSize: 11 }}>
          * Password Confirmation match
        </Text>
      );
    }
  }

  _doVerificationCode = () => {
    if (this.state.phonenumber === "") {
      Alert.alert(
        this.globallang.alert,
        this.pagelang.pleaseentermobile,
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

    if (this.state.phonenumber !== "") {
      this.setState({
        isButtonDisabled: true,
        isTimer: true,
      });

      setTimeout(
        () => this.setState({ isButtonDisabled: false, isTimer: false }),
        300000
      );
    }

    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    this.setState({ otp: OTP });
    console.log(OTP);

    let params = {
      phonenumber: this.state.phonenumber,
      otp: OTP,
    };
    console.log(params);

    fetch(serverurl + webserviceurl + "/sms_otp.php", {
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
        console.log(response);
        // this._storeData('user-phonenumber', JSON.stringify(params));
        // this.props.navigation.replace('CodeOTP');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onErrorOTP() {
    if (this.state.code === "") {
      return (
        <Text style={{ color: "red", fontSize: 11 }}>
          * 6 digit verification code
        </Text>
      );
    }
    {
      return (
        <Text style={{ color: "green", fontSize: 11 }}>
          * 6 digit verification code
        </Text>
      );
    }
  }

  onTimer() {
    if (this.state.isTimer === true) {
      return (
        <CountDown
          until={300}
          size={9}
          timeToShow={["M", "S"]}
          timeLabels={{ m: "MM", s: "SS" }}
        />
      );
    }
    {
      return null;
    }
  }

  doCheckOldPassword = () => {
    if (this.state.passold === "") {
      Alert.alert(
        this.globallang.alert,
        this.pagelang.faled_pass_old,
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
    if (this.state.passnew === "") {
      Alert.alert(
        this.globallang.alert,
        this.pagelang.faled_pass_new,
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
    if (this.state.passconfirm === "") {
      Alert.alert(
        this.globallang.alert,
        this.pagelang.faled_pass_confrim,
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
    if (this.state.passnew !== this.state.passconfirm) {
      Alert.alert(
        this.globallang.alert,
        this.pagelang.faled_samepass,
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
    if (this.state.passwordValid === false) {
      Alert.alert(
        this.globallang.alert,
        "Please correct your password!",
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
    if (this.state.passwordconfirmValid === false) {
      Alert.alert(
        this.globallang.alert,
        "Please correct your password confirmation!",
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
      passwordold: this.state.passold,
      phonenumber: this.state.phonenumber,
    };
    console.log(params);

    this.setState({ showLoading: true });

    fetch(serverurl + webserviceurl + "/app_password_validation.php", {
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
          this.doChange();
        } else {
          Alert.alert(
            this.globallang.alert,
            "The original password is incorrect",
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

  doChange = () => {
    let params = {
      phonenumber: this.state.phonenumber,
      passold: this.state.passold,
      passnew: this.state.passnew,
      passconfirm: this.state.passconfirm,
    };

    console.log(params);

    this.setState({ showLoading: true });

    fetch(serverurl + webserviceurl + "/app_set_password.php", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify(params),
    })
      .then((response) => {
        this.setState({ showLoading: false });
        console.log(response);
        global.logininfo = undefined;
        AsyncStorage.removeItem("smart-app-id-login");
        AsyncStorage.removeItem("smart-app-id-binding");
        AsyncStorage.removeItem("smart-app-id-token");
        AsyncStorage.removeItem("Modernland-Account");
        AsyncStorage.setItem("smart-app-do-logout", "1");
        this.props.navigation.replace("Home");
        return response.json();
      })
      .catch((error) => {
        this.setState({ showLoading: false });
        console.log(error);
      });
  };

  renderLoading = () => {
    if (this.state.showLoading) {
      return <LoadingScreen />;
    }
  };

  render() {
    const isEnabled = this.canBeSubmitted();
    return (
      <View style={globalStyles.screenContainer}>
        <ImageBackground
          source={require("../../assets/images/bg_form.png")}
          style={styles.pictureContainer}
        >
          <HeaderTitle
            param={{
              title: this.state.title,
              canGoBack: this.state.canGoBack,
              canChangeCommunity: this.state.canChangeCommunity,
              showPointerIcon: false,
            }}
            change={this.changeCommunity.bind(this)}
            back={this.goBack.bind(this)}
          />
          <ScrollView
            style={{
              flex: 1,
              position: "absolute",
              top: 50,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <View style={styles.formContainer}>
              <Text style={styles.label}>{this.pagelang.oldPass}:</Text>
              <View style={styles.inputContainer1}>
                <Image
                  style={styles.inputIcon}
                  source={require("../../assets/images/lock.png")}
                />
                <TextInput
                  style={styles.inputs}
                  placeholder="Input your old password"
                  placeholderTextColor="#000"
                  autoFocus={false}
                  secureTextEntry={this.state.hidepassOld}
                  keyboardType="default"
                  underlineColorAndroid="transparent"
                  value={this.state.passold}
                  // onChangeText={(text) => this.validatePassword(text)}
                  onChangeText={(text) => this.setState({ passold: text })}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.visibilityBtn}
                  onPress={this.managePasswordOldVisibility}
                >
                  <Image
                    source={
                      this.state.hidepassOld
                        ? require("../../assets/images/eye.png")
                        : require("../../assets/images/view.png")
                    }
                    style={styles.btnImageIcon}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>{this.pagelang.newPass}:</Text>
              <View style={styles.inputContainer1}>
                <Image
                  style={styles.inputIcon}
                  source={require("../../assets/images/lock.png")}
                />
                <TextInput
                  style={styles.inputs}
                  placeholder="Input your new password"
                  placeholderTextColor="#000"
                  autoFocus={false}
                  secureTextEntry={this.state.hidePassword}
                  keyboardType="default"
                  underlineColorAndroid="transparent"
                  value={this.state.passnew}
                  onChangeText={(text) => this.validatePassword(text)}
                  // onChangeText={(text)=>this.setState({password: text})}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.visibilityBtn}
                  onPress={this.managePasswordVisibility}
                >
                  <Image
                    source={
                      this.state.hidePassword
                        ? require("../../assets/images/eye.png")
                        : require("../../assets/images/view.png")
                    }
                    style={styles.btnImageIcon}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: -16,
                  marginBottom: 20,
                }}
              >
                {this.onErrorPass()}
              </View>

              <Text style={styles.label}>{this.pagelang.confirmPass}:</Text>
              <View style={styles.inputContainer1}>
                <Image
                  style={styles.inputIcon}
                  source={require("../../assets/images/lock.png")}
                />
                <TextInput
                  style={styles.inputs}
                  placeholder="Input your password confirm"
                  placeholderTextColor="#000"
                  autoFocus={false}
                  secureTextEntry={this.state.hideConfirmPassword}
                  keyboardType="default"
                  underlineColorAndroid="transparent"
                  value={this.state.passconfirm}
                  onChangeText={(text) => this.validatePasswordConfirm(text)}
                  // onChangeText={(text)=>this.setState({confirmPassword: text})}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.visibilityBtn}
                  onPress={this.manageConfirmPasswordVisibility}
                >
                  <Image
                    source={
                      this.state.hideConfirmPassword
                        ? require("../../assets/images/eye.png")
                        : require("../../assets/images/view.png")
                    }
                    style={styles.btnImageIcon}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: -16,
                  marginBottom: 6,
                }}
              >
                {this.onErrorPassConfirm()}
              </View>

              <View style={{ marginTop: 20, margin: 0 }}>
                <TouchableOpacity onPress={() => this.doCheckOldPassword()}>
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
                      UPDATE PASSWORD
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* <View style={{marginTop: 20}}>
                <TouchableOpacity onPress={() => this.doCheckOldPassword()}>
                  <View
                    style={{
                      backgroundColor: 'rgb(8,194,223)',
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      height: 50,
                      borderRadius: 25,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                      }}>
                      UPDATE PASSWORD
                    </Text>
                  </View>
                </TouchableOpacity>
              </View> */}
            </View>
          </ScrollView>
        </ImageBackground>
        {this.renderLoading()}
      </View>
    );
  }
}

export default PasswordScreen;
