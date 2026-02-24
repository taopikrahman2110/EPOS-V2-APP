import React from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker from "react-native-modal-datetime-picker";
import LoadingScreen from "../../components/LoadingScreen";
import CountDown from "react-native-countdown-component";
import ModalPicker from "../../components/ModalPicker";
import { getPageLang } from "../../languages";
import { generateUUID } from "../../global";
import globalStyles from "../global.style";
import styles from "./style";
import { serverurl, webserviceurl } from "../../config";

const { width } = Dimensions.get("window");

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang("register");
    this.globallang = getPageLang("global");

    let dob = new Date();
    let year = dob.getFullYear();
    let month = dob.getMonth() + 1;
    let day = dob.getDate();

    this.state = {
      title: "Daftar",
      canGoBack: true,
      webUri: "",
      canChangeCommunity: false,
      communityList: [],
      phonenumber: "",
      name: "",
      nickname: "",
      genderId: "0",
      genderText: "",
      dob: dob,
      dobText: day + "-" + month + "-" + year,
      profilePic: "",
      email: "",
      company: "",
      location: "",
      password: "",
      confirmPassword: "",
      currentPage: 0,
      openModal: false,
      isDateTimePickerVisible: false,
      fields: {},
      errors: {},
      otp: "",
      hidePassword: true,
      hideConfirmPassword: true,
      phonenumberValid: false,
      passwordValid: false,
      passwordconfirmValid: false,
      emailValid: false,
      isButtonDisabled: false,
      isTimer: false,
      code: "",
      showLoading: false,
      userTypeId: 0,
      userTypeText: "",
      phonenumberOwner: "",
      ktp: "",
      addUnit: 0,
      formFields: [{ cluster: "", unit: "" }],
      type_user: 0,
      showDataTipeUser: [],
      showDataReseller: [],
      showDataAgent: [],
      linkedSelected: "",
      id_reseller: 0,
      id_agent: 0,
      uuid: "",
      selectedLanguage: "",
    };
    this.genderData = [];
    this.handleChange = this.handleChange.bind(this);
    this.onLaunchClicked = this.onLaunchClicked.bind(this);

    this.usertype = [
      { id: 1, text: "I'm the owner" },
      { id: 2, text: "I'm not owner" },
      { id: 3, text: "None of above" },
    ];
  }

  saveSign = () => {
    this.refs["sign"].saveImage();
  };

  resetSign = () => {
    this.refs["sign"].resetImage();
  };

  handleChange() {
    let fields = this.state.fields;
    fields[target.value];
    this.setState({
      fields,
    });
  }

  _onFinishCheckingCode2(isValid, code) {
    console.log(isValid);
    if (!isValid) {
      Alert.alert("Confirmation Code", "Code not match!", [{ text: "OK" }], {
        cancelable: false,
      });
    } else {
      this.setState({ code, isTimer: false });
      setTimeout(function () {
        Alert.alert("Confirmation Code", "Successful!", [{ text: "OK" }], {
          cancelable: false,
        });
      }, 50);
    }
  }

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
          until={180}
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

  componentDidMount() {
    // console.log(generateUUID());
    this.setState({
      uuid: generateUUID(),
    });
    this.getDataTipeUser();
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  getDataTipeUser = () => {
    fetch(serverurl + webserviceurl + "/data_type_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Something wrong with api server");
        }
      })
      .then((response) => {
        if (response.status === "OK") {
          if (response.records.length > 0) {
            let result = response.records.filter((obj) => obj.value !== 1);
            this.setState({
              showDataTipeUser: result,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doOTP = () => {
    var digits = "0123456789";
    var OTP = "";
    for (let i = 0; i < 5; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    this.setState({ otp: OTP });
    console.log(OTP);

    let params = {
      phoneno: this.state.phonenumber,
      email: this.state.email,
      otp: OTP,
    };

    this._storeData("user-register", JSON.stringify(params));
    console.log(params);

    fetch(serverurl + webserviceurl + "/email_otp.php", {
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
        this.setState({
          showLoadingOTP: false,
        });
        console.log(error);
      });
  };

  dovalidationPhone = () => {
    if (this.state.phonenumber === "") {
      Alert.alert(
        "Warning",
        "Silahkan masukan nomor handphone Anda.",
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
    if (this.state.phonenumberValid === false) {
      Alert.alert(
        "Warning",
        "Silahkan masukan nomor handphone yang valid.",
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
    if (this.state.password === "") {
      Alert.alert(
        "Warning",
        "Silahkan masukan kata sandi",
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
    if (this.state.password !== this.state.confirmPassword) {
      Alert.alert(
        "Warning",
        "Konfirmasi kata sandi tidak sama dengan kata sandi yang dibuat",
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
        "Warning",
        "Format Kata sandi salah!",
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
        "Warning",
        "Konfirmasi kata sandi tidak sama dengan kata sandi yang dibuat",
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
    };
    console.log(params);
    this.setState({ showLoading: true });
    fetch(serverurl + webserviceurl + "/verifikasi_phonenumber.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        this.setState({ showLoading: false });
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
      .then((response) => {
        this.setState({ showLoading: false });
        console.log(response);
        if (response.status === "OK") {
          Alert.alert(
            "Informasi",
            "Nomor handphone yang anda gunakan sudah terdaftar, mohon gunakan nomor handphone lain",
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false }
          );
        } else {
          this.doNext(this.state.currentPage + 1, this.state.currentPage);
        }
      })
      .catch((error) => {
        this.setState({ showLoading: false });
        Alert.alert(
          "Error",
          "Internet terputus, cek koneksi Anda",
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

  doValidateEmail = () => {
    if (this.state.name === "") {
      Alert.alert(
        "Informasi",
        "Mohon untuk memasukkan Nama terlebih dahulu",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
      return false;
    } else if (this.state.email === "") {
      Alert.alert(
        "Informasi",
        "Mohon untuk memasukkan alamat email terlebih dahulu",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
      return false;
    } else if (this.state.emailValid === false) {
      Alert.alert(
        "Informasi",
        "Format alamat email salah",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
      return false;
    } else if (this.state.type_user === 0) {
      Alert.alert(
        "Informasi",
        "Mohon untuk pilih tipe pengguna",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
      return false;
    } else {
      let params = {
        email: this.state.email.replace(/\s/g, ""),
      };
      console.log(params);
      this.setState({ showLoading: true });
      fetch(serverurl + webserviceurl + "/verifikasi_email.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: JSON.stringify(params),
      })
        .then((response) => {
          this.setState({ showLoading: false });
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
        .then((response) => {
          this.setState({ showLoading: false });
          console.log(response);
          if (response.status === "OK") {
            Alert.alert(
              "Informasi",
              "Alamat email yang anda gunakan sudah terdaftar, mohon gunakan alamat email lain",
              [
                {
                  text: this.globallang.ok,
                  onPress: () => console.log("OK Pressed"),
                },
              ],
              { cancelable: false }
            );
          } else {
            this.doRegister();
          }
        })
        .catch((error) => {
          this.setState({ showLoading: false });
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
    }
  };

  doGetReseller = () => {
    this.setState({
      showLoading: true,
    });
    fetch(serverurl + webserviceurl + "/option_data_reseller.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        console.log(response);
        this.setState({
          showLoading: false,
        });
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Something wrong with api server");
        }
      })
      .then((response) => {
        this.setState({
          showLoading: false,
        });
        if (response.status === "OK") {
          if (response.records.length > 0) {
            console.log(response.records);
            this.setState({
              showDataReseller: response.records,
            });
          }
        }
      })
      .catch((error) => {
        this.setState({
          showLoading: false,
        });
        console.log(error);
      });
  };

  doGetAgent = () => {
    this.setState({
      showLoading: true,
    });
    fetch(serverurl + webserviceurl + "/option_data_agent.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        this.setState({
          showLoading: false,
        });
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Something wrong with api server");
        }
      })
      .then((response) => {
        this.setState({
          showLoading: false,
        });
        if (response.status === "OK") {
          if (response.records.length > 0) {
            console.log(response.records);
            this.setState({
              showDataAgent: response.records,
            });
          }
        }
      })
      .catch((error) => {
        this.setState({
          showLoading: false,
        });
        console.log(error);
      });
  };

  doRegister = () => {
    let params = {
      user_id: this.state.uuid,
      phonenumber: this.state.phonenumber,
      email: this.state.email,
      name: this.state.name,
      type_user: this.state.type_user,
      linked:
        this.state.type_user === 3
          ? this.state.id_reseller
          : this.state.type_user === 4
          ? this.state.id_agent
          : 0,
      password: this.state.password,
    };

    console.log(params);

    this.setState({ showLoading: true });
    fetch(serverurl + webserviceurl + "/registrasi.php", {
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
      .then((response) => {
        this.setState({ showLoading: false });
        console.log(response);
        if (response.status === "OK") {
          this.doOTP();
          this.props.navigation.replace("RegisterOTP");
        } else {
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

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack() {
    if (this.state.currentPage > 0) {
      this.setState({ currentPage: this.state.currentPage - 1 });
    } else {
      this.props.navigation.replace("Login");
    }
  }

  generateOTP = () => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 5; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    this.setState({ otp: OTP });
    return OTP;
  };

  _storeData2 = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };

  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };

  onLaunchClicked(event) {
    event.preventDefault();
    this.setState({
      isButtonDisabled: true,
    });

    setTimeout(() => this.setState({ isButtonDisabled: false }), 180000);
    // return this.props.onLaunchClicked();
  }

  doNext = (toIdx, currIdx) => {
    if (toIdx < 3) {
      if (currIdx === 0) {
      }
      this.setState({ currentPage: toIdx });
    }
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

  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };

  manageConfirmPasswordVisibility = () => {
    this.setState({ hideConfirmPassword: !this.state.hideConfirmPassword });
  };

  validatePhone = (text) => {
    console.log(text);
    let reg = /^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/;
    if (reg.test(text) === false) {
      console.log("Format nomor handphone HARUS benar");
      this.setState({ phonenumber: text, phonenumberValid: false });
      console.log(this.state.phonenumberValid);
      return false;
    } else {
      this.setState({ phonenumber: text, phonenumberValid: true });
      console.log("Format nomor handphone SUDAH benar");
    }
  };

  onErrorPhone() {
    if (this.state.phonenumber === "") {
      return null;
    }
    if (this.state.phonenumberValid === false) {
      return (
        <Text style={{ color: "red", fontSize: 11 }}>
          * Format nomor handphone harus benar{" "}
        </Text>
      );
    }
    {
      return (
        <Text style={{ color: "green", fontSize: 11 }}>
          * Format nomor handphone sudah benar{" "}
        </Text>
      );
    }
  }

  validateEmail = (text) => {
    console.log(text);
    let reg = /\S+@\S+\.\S+/;
    if (reg.test(text) === false) {
      console.log("Format email harus benar");
      this.setState({ email: text, emailValid: false });
      console.log(this.state.emailValid);
      return false;
    } else {
      this.setState({ email: text, emailValid: true });
      console.log("Format email sudah benar");
    }
  };

  onErrorEmail() {
    if (this.state.email === "") {
      return (
        <Text style={{ color: "black", fontSize: 11, marginTop: 5 }}>
          *Email yang digunakan harus aktif dan selalu digunakan{" "}
        </Text>
      );
    }
    if (this.state.emailValid === false) {
      return (
        <Text style={{ color: "red", fontSize: 11, marginTop: 5 }}>
          * Email harus mempunyai simbol (@ dan .com){" "}
        </Text>
      );
    }
    {
      return (
        <Text style={{ color: "green", fontSize: 11, marginTop: 5 }}>
          * Format email sudah benar{" "}
        </Text>
      );
    }
  }

  validatePassword = (text) => {
    console.log(text);
    // let reg = /^(?=.[A-Z])(?=.\d)(?=.[@$!%#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    let reg = /^.{6,50}$/;
    if (reg.test(text) === false) {
      console.log("Kata Sandi HARUS benar");
      this.setState({ password: text, passwordValid: false });
      console.log(this.state.passwordValid);
      return false;
    } else {
      this.setState({ password: text, passwordValid: true });
      console.log(this.state.passwordValid);
      console.log("Kata Sandi SUDAH benar");
    }
  };

  onErrorPass() {
    if (this.state.password === "") {
      return null;
    }
    if (this.state.passwordValid === false) {
      return (
        <Text style={{ color: "red", fontSize: 11 }}>
          * Password minimal 6 digit dan tidak boleh spasi
        </Text>
      );
    }
    {
      return (
        <Text style={{ color: "green", fontSize: 11 }}>
          * Kata sandi sudah benar{" "}
        </Text>
      );
    }
  }

  validatePasswordConfirm = (text) => {
    console.log(text);
    // let reg = /^(?=.[A-Z])(?=.\d)(?=.[@$!%#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    let reg = /^.{6,50}$/;
    if (reg.test(text) === false) {
      console.log("Konfirmasi kata sandi harus benar");
      this.setState({ confirmPassword: text, passwordconfirmValid: false });
      console.log(this.state.passwordconfirmValid);
      return false;
    } else {
      this.setState({ confirmPassword: text, passwordconfirmValid: true });
      console.log(this.state.passwordconfirmValid);
      console.log("Konfirmasi kata sandi sudah benar");
    }
  };

  onErrorPassConfirm() {
    if (this.state.confirmPassword === "") {
      return null;
    }
    if (
      this.state.password !== this.state.confirmPassword ||
      this.state.passwordValid === false
    ) {
      return (
        <Text style={{ color: "red", fontSize: 11 }}>
          * Harus sama dengan kata sandi
        </Text>
      );
    }
    {
      return (
        <Text style={{ color: "green", fontSize: 11 }}>
          * Konfirmasi kata sandi sudah benar
        </Text>
      );
    }
  }

  renderButtonVerify = () => {
    if (this.state.showLoading === true) {
      return (
        <View style={styles.buttonstyle}>
          <ActivityIndicator
            animating={this.state.showLoading}
            size="large"
            color="#fff"
          />
        </View>
      );
    } else {
      return (
        <View style={styles.buttonstyle}>
          <Text style={styles.buttontextstyle}>VERIFIKASI</Text>
        </View>
      );
    }
  };

  renderButtonNext = () => {
    if (this.state.showLoading === true) {
      return (
        <View style={styles.buttonstyle}>
          <ActivityIndicator
            animating={this.state.showLoading}
            size="large"
            color="#fff"
          />
        </View>
      );
    } else {
      return (
        <View style={styles.buttonstyle}>
          <Text style={styles.buttontextstyle}>NEXT</Text>
        </View>
      );
    }
  };

  renderButtonSubmit = () => {
    if (this.state.showLoading === true) {
      return (
        <View style={styles.buttonstyle}>
          <ActivityIndicator
            animating={this.state.showLoading}
            size="large"
            color="#fff"
          />
        </View>
      );
    } else {
      return (
        <View style={styles.buttonstyle}>
          <Text style={styles.buttontextstyle}>SUBMIT</Text>
        </View>
      );
    }
  };

  renderPage = () => {
    if (this.state.currentPage === 0) {
      //profile page
      return (
        <View style={{ marginTop: 30 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: 0,
            }}
          >
            <View style={{ flex: 0, flexDirection: "column", paddingLeft: 30 }}>
              <View
                style={{ justifyContent: "center", flexDirection: "column" }}
              >
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: "#000",
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                paddingRight: 30,
              }}
            >
              <Text
                style={{
                  paddingLeft: 16,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                VERIFIKASI NOMOR HANDPHONE & PASSWORD
              </Text>
            </View>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nomor Handphone</Text>
            <View style={styles.inputContainer1}>
              <Image
                style={styles.inputIcon}
                source={require("../../assets/images/smartphone.png")}
              />
              <TextInput
                style={styles.inputs}
                placeholder={this.pagelang.inputyourphone}
                placeholderTextColor="#999999"
                autoFocus={false}
                maxLength={13}
                keyboardType="phone-pad"
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                value={this.state.phonenumber}
                onChangeText={(text) => this.validatePhone(text)}
              />
            </View>
            <View
              style={{ flexDirection: "row", marginTop: -16, marginBottom: 6 }}
            >
              {this.onErrorPhone()}
            </View>

            <Text style={styles.label}>Kata Sandi</Text>
            <View style={styles.inputContainer1}>
              <Image
                style={styles.inputIcon}
                source={require("../../assets/images/password.png")}
              />
              <TextInput
                style={styles.inputs}
                placeholder="************"
                placeholderTextColor="#999999"
                autoFocus={false}
                secureTextEntry={this.state.hidePassword}
                keyboardType="default"
                underlineColorAndroid="transparent"
                maxLength={25}
                value={this.state.password}
                onChangeText={(text) => this.validatePassword(text)}
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
              style={{ flexDirection: "row", marginTop: -16, marginBottom: 6 }}
            >
              {this.onErrorPass()}
            </View>

            <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
            <View style={styles.inputContainer1}>
              <Image
                style={styles.inputIcon}
                source={require("../../assets/images/password_confirm.png")}
              />
              <TextInput
                style={styles.inputs}
                placeholder="************"
                placeholderTextColor="#999999"
                autoFocus={false}
                secureTextEntry={this.state.hideConfirmPassword}
                keyboardType="default"
                underlineColorAndroid="transparent"
                maxLength={25}
                value={this.state.confirmPassword}
                onChangeText={(text) => this.validatePasswordConfirm(text)}
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
              style={{ flexDirection: "row", marginTop: -16, marginBottom: 6 }}
            >
              {this.onErrorPassConfirm()}
            </View>

            <View>
              <TouchableOpacity onPress={() => this.dovalidationPhone()}>
                {this.renderButtonVerify()}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else if (this.state.currentPage === 1) {
      const data = [{ key: "1", value: "Jammu & Kashmir" }];
      const countries = ["Egypt", "Canada", "Australia", "Ireland"];

      return (
        <View style={{ marginTop: 30 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: 0,
            }}
          >
            <View style={{ flex: 0, flexDirection: "column", paddingLeft: 30 }}>
              <View
                style={{ justifyContent: "center", flexDirection: "column" }}
              >
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: "#000",
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                paddingRight: 30,
              }}
            >
              <Text
                style={{
                  paddingLeft: 16,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                INFORMASI DATA
              </Text>
            </View>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={styles.inputContainer1}>
              <Image
                style={styles.inputIcon}
                source={require("../../assets/images/identity-card.png")}
              />
              <TextInput
                style={styles.inputs}
                placeholder="Nama lengkap anda"
                placeholderTextColor="#999999"
                autoFocus={false}
                autoCapitalize="words"
                underlineColorAndroid="transparent"
                value={this.state.name}
                onChangeText={(text) => this.setState({ name: text })}
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer1}>
              <Image
                style={styles.inputIcon}
                source={require("../../assets/images/email.png")}
              />
              <TextInput
                style={styles.inputs}
                placeholder={this.pagelang.inputyouremail}
                placeholderTextColor="#999999"
                autoFocus={false}
                keyboardType="default"
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                value={this.state.email}
                onChangeText={(text) => this.validateEmail(text)}
              />
            </View>
            <View
              style={{ flexDirection: "row", marginTop: -16, marginBottom: 16 }}
            >
              {this.onErrorEmail()}
            </View>

            <Text style={styles.label}>Tipe Pengguna</Text>

            <Picker
              selectedValue={this.state.type_user}
              style={stylesPicker.picker}
              itemStyle={stylesPicker.pickerItem}
              onValueChange={(itemValue, itemIndex) =>
                this.handleChangeTypeUser(itemValue)
              }
            >
              {this.state.showDataTipeUser.map((item, index) => {
                return (
                  <Picker.Item
                    label={item.label}
                    value={item.value}
                    key={index}
                  />
                );
              })}
            </Picker>

            {this.state.type_user === 3 ? (
              <>
                <Text style={styles.label}>Reseller</Text>

                <Picker
                  selectedValue={this.state.id_reseller}
                  style={stylesPicker.picker}
                  itemStyle={stylesPicker.pickerItem}
                  onValueChange={(itemValue, itemIndex) =>
                    this.handleChangeReseller(itemValue)
                  }
                >
                  {this.state.showDataReseller.map((item, index) => {
                    return (
                      <Picker.Item
                        label={item.label}
                        value={item.value}
                        key={index}
                      />
                    );
                  })}
                </Picker>
              </>
            ) : (
              <></>
            )}

            {this.state.type_user === 4 ? (
              <>
                <Text style={styles.label}>Agent</Text>

                <Picker
                  selectedValue={this.state.id_agent}
                  style={stylesPicker.picker}
                  itemStyle={stylesPicker.pickerItem}
                  onValueChange={(itemValue, itemIndex) =>
                    this.handleChangeAgent(itemValue)
                  }
                >
                  {this.state.showDataAgent.map((item, index) => {
                    return (
                      <Picker.Item
                        label={item.label}
                        value={item.value}
                        key={index}
                      />
                    );
                  })}
                </Picker>
              </>
            ) : (
              <></>
            )}

            <View>
              <TouchableOpacity onPress={() => this.doValidateEmail()}>
                {this.renderButtonSubmit()}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  };

  handleChangeTypeUser = (value) => {
    console.log(value);
    this.setState({
      type_user: value,
    });

    if (value === 3) {
      this.doGetReseller();
    } else if (value === 4) {
      this.doGetAgent();
    }
  };

  handleChangeAgent = (value) => {
    this.setState({
      id_agent: value,
    });
  };

  handleChangeReseller = (value) => {
    this.setState({
      id_reseller: value,
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
        <ImageBackground
          source={require("../../assets/images/brankas/brankas-12.png")}
          style={styles.pictureContainer}
        >
          <View style={styles.headerTitle}>
            <View style={{ flex: 0, flexDirection: "column", paddingLeft: 14 }}>
              <TouchableOpacity onPress={() => this.goBack()}>
                <View
                  style={{ justifyContent: "center", flexDirection: "row" }}
                >
                  <Image
                    style={{ height: 20, width: 20, tintColor: "#fff" }}
                    source={require("../../assets/images/backretun.png")}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.textContentTitle}>
              <Text style={styles.fontTextTitle}>{this.state.title}</Text>
            </View>
          </View>
          <ScrollView
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {this.renderPage()}
          </ScrollView>
        </ImageBackground>
        {this.renderModal()}
        {this.renderLoading()}
        <DateTimePicker
          isDarkModeEnabled={false}
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          date={this.state.dob}
        />
      </View>
    );
  }
}

export default Register;

const stylesPicker = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    borderColor: "#AAAAAA",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerItem: {
    color: "black",
  },
  onePicker: {
    width: 200,
    height: 44,
    backgroundColor: "#FFF0E0",
    borderColor: "black",
    borderWidth: 1,
  },
  onePickerItem: {
    height: 44,
    color: "red",
  },
  twoPickers: {
    width: 200,
    height: 88,
    backgroundColor: "#FFF0E0",
    borderColor: "black",
    borderWidth: 1,
  },
  twoPickerItems: {
    height: 88,
    color: "red",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    borderColor: "#AAAAAA",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

const SelectOption = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    width,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
  },
  headerTitle: { color: "#000", fontWeight: "bold", fontSize: 16 },
  saveAreaViewContainer: { flex: 1, backgroundColor: "#FFF" },
  viewContainer: { flex: 1, width, backgroundColor: "#FFF" },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "10%",
    paddingBottom: "20%",
  },

  dropdown1BtnStyle: {
    width: "80%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdown1BtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
  dropdown1SelectedRowStyle: { backgroundColor: "rgba(0,0,0,0.1)" },
  dropdown1searchInputStyleStyle: {
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },

  dropdown2BtnStyle: {
    width: "80%",
    height: 50,
    backgroundColor: "#444",
    borderRadius: 8,
  },
  dropdown2BtnTxtStyle: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  dropdown2DropdownStyle: {
    backgroundColor: "#444",
    borderRadius: 12,
  },
  dropdown2RowStyle: { backgroundColor: "#444", borderBottomColor: "#C5C5C5" },
  dropdown2RowTxtStyle: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  dropdown2SelectedRowStyle: { backgroundColor: "rgba(255,255,255,0.2)" },
  dropdown2searchInputStyleStyle: {
    backgroundColor: "#444",
    borderBottomWidth: 1,
    borderBottomColor: "#FFF",
  },

  dropdown3BtnStyle: {
    width: "80%",
    height: 50,
    backgroundColor: "#FFF",
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#444",
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  dropdown3BtnImage: { width: 45, height: 45, resizeMode: "cover" },
  dropdown3BtnTxt: {
    color: "#444",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    marginHorizontal: 12,
  },
  dropdown3DropdownStyle: { backgroundColor: "slategray" },
  dropdown3RowStyle: {
    backgroundColor: "slategray",
    borderBottomColor: "#444",
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  dropdownRowImage: { width: 45, height: 45, resizeMode: "cover" },
  dropdown3RowTxt: {
    color: "#F1F1F1",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    marginHorizontal: 12,
  },
  dropdown3searchInputStyleStyle: {
    backgroundColor: "slategray",
    borderBottomWidth: 1,
    borderBottomColor: "#FFF",
  },
});
