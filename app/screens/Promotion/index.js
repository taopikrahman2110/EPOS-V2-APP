import moment from "moment";
import React from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageView from "react-native-image-view";
import ReadMore from "react-native-read-more-text";
import Nodata from "../../assets/images/kosong2.png";
import HeaderTitle from "../../components/headerTitle/index";
import LoadingScreen from "../../components/LoadingScreen";
import { getPageLang } from "../../languages";
import globalStyles from "../global.style";
import styles from "./style";

class ActivityHistory extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang("historicalfeedback");
    this.globallang = getPageLang("global");

    this.state = {
      title: "Promosi",
      canGoBack: true,
      canChangeCommunity: false,
      showLoading: false,
      phonenumber: "",
      historyFeedBack: [],
      index: 0,
      modalVisible: true,
      currentImageIndex: 0,
      setImageIndex: 0,
      isVisible: false,
      setIsVisible: false,
      setImages: [],
      name: "",
    };

    this.background = {
      blue: "#6680ff",
      default: "#cccccc",
    };

    this.color = {
      red: "#cc0000",
      green: "#39e600",
      orange: "#ffcc00",
      blue: "#6680ff",
      gray: "#d9d9d9",
    };

    this.renderFooter = this.renderFooter.bind(this);
  }

  _retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  componentWillMount = (props) => {};

  componentDidMount = (props) => {
    this._retrieveData("smart-app-id-login").then((info) => {
      if (info !== null) {
        info = JSON.parse(info);
        this.setState({
          phonenumber: info.phonenumber,
          name: info.name,
        });

        this.getMomentData(info.phonenumber);
      }
    });

    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  getMomentData = (phonenumber) => {
    let param = {
      phonenumber: phonenumber,
    };
    console.log(param);
    this.setState({ showLoading: true });

    fetch(
      global.serverurl + global.webserviceurl + "/app_load_history_moment.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: JSON.stringify(param),
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          Alert.alert(
            "Error",
            "Something wrong with api server",
            [
              {
                text: "OK",
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
          let historyFeedBack = response.records;
          this.setState({
            historyFeedBack: historyFeedBack,
            dataEmpaty: true,
          });
          console.log(this.state.historyFeedBack);
        } else {
          Alert.alert(
            "Warning",
            response.message,
            [
              {
                text: "OK",
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
          "Something went wrong, you can check again.",
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
    this.props.navigation.replace("Home");
    return true;
  };

  goBack = () => {
    this.props.navigation.replace("Home");
  };

  changeCommunity(community) {
    global.community = community;
  }

  ListEmptyView = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          marginTop: 160,
        }}
      >
        <Image
          style={{ height: 200, width: 200 }}
          source={Nodata}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: 16,
            alignItems: "center",
            textAlign: "left",
            marginTop: -10,
          }}
        >
          Promosi Tidak Tersedia
        </Text>
      </View>
    );
  };

  renderStatusCategory = (item) => {
    if (item.feedbackcategory === 1) {
      return <Text style={{ fontSize: 16, color: "#000" }}>Complaints</Text>;
    }
    if (item.feedbackcategory === 2) {
      return (
        <Text style={{ fontSize: 16, color: "#000" }}>
          Software optimization
        </Text>
      );
    }
    if (item.feedbackcategory === 3) {
      return <Text style={{ fontSize: 16, color: "#000" }}>Other</Text>;
    }
  };

  onSelect = (images, index) => {
    console.log(images);
    console.log(index);
    this.setState({
      setImageIndex: index,
    });

    this.setState({
      setIsVisible: true,
    });

    this.setState({
      setImages: images,
    });
  };

  onRequestClose = () => {
    this.setState({
      setIsVisible: false,
    });
  };

  renderImages = (data) => {
    if (data.images.length > 0) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            borderTopWidth: 1,
            borderTopColor: "#f2f2f2",
            marginBottom: 6,
          }}
        >
          {data.images.map((image, index) => {
            return (
              <TouchableOpacity
                style={styles.formColumnImage}
                key={index}
                onPress={() => this.onSelect(data.images, index)}
              >
                <Image
                  source={image.source}
                  style={{ width: 60, height: 60 }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      );
    } else {
      return null;
    }
  };

  _handleTextReady = () => {
    console.log("ready!");
  };

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ color: "#007aff", marginTop: 5 }} onPress={handlePress}>
        Read more
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ color: "#007aff", marginTop: 5 }} onPress={handlePress}>
        Collapse
      </Text>
    );
  };

  renderStatusMoment = (item) => {
    if (item.show === 1) {
      return <Text>Status: Waiting to be approved </Text>;
    } else {
      return <Text>Status: Show </Text>;
    }
  };

  RenderItem = ({ item, index }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <View style={styles.formColumn}>
            <Text style={{ fontSize: 16, color: "#000" }}>
              {this.state.name}{" "}
            </Text>
          </View>
          <View style={styles.formColumn}>
            <Text style={styles.formColumnAlignRight}>
              {moment(item.datetime).fromNow()}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: "row", paddingBottom: 8 }}>
          <View style={styles.card}>
            <ReadMore
              numberOfLines={2}
              onReady={this._handleTextReady()}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
            >
              <Text
                numberOfLines={500}
                ellipsizeMode="middle"
                style={{ fontSize: 14, textAlign: "justify", lineHeight: 22 }}
              >
                {item.description}
              </Text>
            </ReadMore>
          </View>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          style={{ flex: 1, flexDirection: "row", backgroundColor: "#fff" }}
        >
          <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
            {this.renderImages(item)}
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            marginTop: 6,
            justifyContent: "flex-end",
          }}
        >
          {this.renderStatusMoment(item)}
        </View>
      </View>
    );
  };

  renderLoading = () => {
    if (this.state.showLoading) {
      return <LoadingScreen />;
    }
  };

  renderFooter() {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} />
      </View>
    );
  }

  render() {
    return (
      <View style={globalStyles.screenContainer}>
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
        <View style={styles.contentContainer}>
          <ScrollView
            style={{
              flex: 1,
              position: "absolute",
              top: 50,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#f2f2f2",
            }}
          >
            <View style={styles.FlatlistContainer}>
              <FlatList
                data={this.state.historyFeedBack}
                renderItem={this.RenderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={this.ListEmptyView}
              />
            </View>
          </ScrollView>
        </View>
        <ImageView
          images={this.state.setImages}
          imageIndex={this.state.setImageIndex}
          isVisible={this.state.setIsVisible}
          onClose={() => this.setState({ setIsVisible: false })}
          renderFooter={this.renderFooter}
          onImageChange={(index) => {
            console.log(index);
          }}
        />
        {this.renderLoading()}
      </View>
    );
  }
}
export default ActivityHistory;
