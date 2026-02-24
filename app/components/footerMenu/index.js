/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  Image,
  Text,
  TouchableHighlight,
  View,
  AsyncStorage,
} from "react-native";
import A from "../../assets/images/brankas/brankas-21.png";
import B from "../../assets/images/brankas/brankas-22.png";
import C from "../../assets/images/brankas/brankas-23.png";
import D from "../../assets/images/brankas/brankas-24.png";

import AA from "../../assets/images/brankas/brankas-17.png";
import BB from "../../assets/images/brankas/brankas-18.png";
import CC from "../../assets/images/brankas/brankas-19.png";
import DD from "../../assets/images/brankas/brankas-20.png";

import { getPageLang } from "../../languages";
import styles from "./style";

class FooterMenu extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang("menu");
    this.state = {
      currentMenu: parseInt(props.currentMenu),
      totalUnRead: 0,
      menu: [
        {
          id: 1,
          text: "Beranda",
          style:
            props.currentMenu === 1 ? styles.activelink : styles.nonactivelink,
          imgSource: props.currentMenu === 1 ? AA : A,
          count: 0,
        },
        {
          id: 2,
          text: "Riwayat",
          style:
            props.currentMenu === 2 ? styles.activelink : styles.nonactivelink,
          imgSource: props.currentMenu === 2 ? BB : B,
          count: 0,
        },
        // {
        //   id: 3,
        //   text: "Notifikasi",
        //   style:
        //     props.currentMenu === 3 ? styles.activelink : styles.nonactivelink,
        //   imgSource: props.currentMenu === 3 ? CC : C,
        //   count: 0,
        // },
        {
          id: 4,
          text: "Profil",
          style:
            props.currentMenu === 4 ? styles.activelink : styles.nonactivelink,
          imgSource: props.currentMenu === 4 ? DD : D,
          count: 0,
        },
      ],
    };
  }

  _retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  componentDidMount = () => {
    this._retrieveData("smart-app-id-login").then((info) => {
      if (info !== null) {
        info = JSON.parse(info);
      }
    });
  };

  _changeMenu(idx) {
    if (this.state.currentMenu !== idx) {
      this.setState({ currentMenu: idx });
      if (idx === 1) {
        this.props.navigation.replace("Home");
      } else if (idx === 2) {
        this.props.navigation.replace("AktivitasPage");
      }
      // else if (idx === 3) {
      //   this.props.navigation.replace("NotifikasiPage");
      // }
      else if (idx === 4) {
        this.props.navigation.replace("ProfilePage");
      }
    } else {
      this.props.refreshPage();
    }
  }

  renderBadge = () => {
    if (this.state.totalUnRead !== 0) {
      return <View>{this.state.totalUnRead}</View>;
    }
  };

  render() {
    return (
      <View style={styles.footer}>
        {this.state.menu.map((menu, i) => (
          <View style={styles.menuView} key={menu.id}>
            <TouchableHighlight
              onPress={() => this._changeMenu(menu.id)}
              underlayColor={"rgba(0,0,0,0)"}
            >
              <View style={styles.menuItem}>
                {menu.id === 4 ? (
                  menu.count !== 0 ? (
                    <Text
                      style={{
                        backgroundColor: "red",
                        color: "#fff",
                        fontSize: 7,
                        borderRadius: 10,
                        padding: 1,
                        position: "relative",
                        width: 12,
                        height: 12,
                        textAlign: "center",
                        marginBottom: -10,
                        marginRight: -10,
                        zIndex: 1,
                      }}
                    >
                      {" "}
                      {menu.count}{" "}
                    </Text>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
                <Image
                  source={menu.imgSource}
                  style={{
                    resizeMode: "contain",
                    flex: 1,
                    width: 70,
                    height: 70,
                    marginBottom: 0,
                  }}
                />
              </View>
            </TouchableHighlight>
          </View>
        ))}
      </View>
    );
  }
}

export default FooterMenu;
