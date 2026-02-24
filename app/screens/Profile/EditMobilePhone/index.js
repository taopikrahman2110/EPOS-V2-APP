import React from 'react';
import { Alert, AsyncStorage, BackHandler, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import chevronLeft from '../../../assets/images/chevron-left.png';
import CodeInput from '../../../components/ConfirmationCodeInput/ConfirmationCodeInput';
import { getPageLang } from '../../../languages';
import globalStyles from '../../global.style';
import styles from './style';

class EditMobilePhoneScreen extends React.Component {

    constructor(props) {
        super(props);
        this.pagelang = getPageLang('editmobilephone');
        this.globallang = getPageLang('global');

        this.state = {
            title: this.pagelang['title'],
            canGoBack: true,
            //webUri: global.serverurl + '/?page=mypage&community=' + global.community.code + '&t=' + new Date().getTime(),
            canChangeCommunity: false,
            userid:'',
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
            codeOTP:'',
            otp:'',
            fields: {},
            errors: {},
            code: '',
            prepareQuit:false,
            hidePassword: true,
            hideConfirmPassword: true   

        }
    }

    _retrieveData = async (key) => {
        let value = await AsyncStorage.getItem(key);
        return value;
    }

    componentWillMount=(props)=>{
        this._retrieveData(global.appId+'-login-info').then(info => {
            if(info === null)  this.props.navigation.replace('Login');            
        })

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentDidMount=(props)=>{
        this.generateOTP();
        console.log(this.state.otp);
        this._retrieveData(global.appId+'-login-info').then(info => {
            if(info !== null){

                console.log(info);
                
                info = JSON.parse(info)
                this.setState({
                    userid: info.userid,
                    name: info.name,
                    nickname: info.nickname,
                })
            }  
        })
        
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = ()=>{
        this.goBack();
    }

    goBack=()=> {
        this.props.navigation.replace('Profile');
      }

    generateOTP = ()=>{
        var digits = '0123456789'
        let OTP = '';
        for (let i = 0; i < 6; i++){
            OTP += digits[Math.floor(Math.random() * 10)];
        }

        this.setState({otp : OTP})
        return OTP;
    }

    _onFulfill(code) {
        // TODO: call API to check code here
        // If code does not match, clear input with: this.refs.codeInputRef1.clear()
        if (code == 'Q234E') {
          Alert.alert(
            'Confirmation Code',
            'Successful!',
            [{text: 'OK'}],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            'Confirmation Code',
            'Code not match!',
            [{text: 'OK'}],
            { cancelable: false }
          );
          
          this.refs.codeInputRef1.clear();
        }
    }

    _onFinishCheckingCode1(isValid) {
        console.log(isValid);
        if (!isValid) {
          Alert.alert(
            'Confirmation Code',
            'Code not match!',
            [{text: 'OK'}],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            'Confirmation Code',
            'Successful!',
            [{text: 'OK'}],
            { cancelable: false },
          );
        }
    }

    _onFinishCheckingCode2(isValid, code) {
        console.log(isValid);
        if (!isValid) {
          Alert.alert(
            '验证码',
            '代码不匹配！',
            [{text: '好'}],
            { cancelable: false }
          );
        } else {
          this.setState({ code });
          Alert.alert(
            '验证码',
            '成功！',
            [{text: '好'}],
            { cancelable: false }
          );
        }
    }

    getGenderList=()=>{
        fetch(global.serverurl + global.webserviceurl + '/app_get_gender_list.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: JSON.stringify({})
        }).then((response) => {
            if (response.status === 200)
                return response.json();
            else
                throw new Error('Something wrong with api server');
        }).then((response) => {
            if (response.status === "OK") {
                this.genderData = [];
                
                for(let i=0;i<response.records.length ;i++){
                    this.genderData.push({ value:response.records[i].id, text: response.records[i].name});
                }
                //if(this.state.genderId === 0 && this.genderData.length>0){
                    this.setState({genderId: this.genderData[0].value, genderText: this.genderData[0].text});
                //}

            } else {
                //error
                /*Alert.alert(this.globallang.alert, response.message,
                    [{ text: this.globallang.ok, onPress: () => console.log('OK Pressed') }],
                    { cancelable: false });*/
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    _doVerificationCode =()=>{
        if(this.state.phonenumber === ''){
            Alert.alert(this.globallang.alert, this.pagelang.pleaseentermobile, [{ text: this.globallang.ok, onPress: () => console.log('OK Pressed') }], { cancelable: false });
            return false;
        }

        let params = {
            phonenumber : this.state.phonenumber,
            otp : this.state.otp,
        }
        console.log(params);

        fetch(global.serverurl + global.webserviceurl + '/app_sms_otp.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: JSON.stringify(params)
        }).then((response) => {
            if (response.status === 200)
                return response.json();
            else
                throw new Error('Something wrong with api server');
        }).then((response) => {
            console.log(response);
            // this._storeData('user-phonenumber', JSON.stringify(params));
            // this.props.navigation.replace('CodeOTP');
        }).catch((error) => {
            console.log(error);
        });
    }

    _doLogout = () => {
        AsyncStorage.removeItem(global.appId+'-login-info');
        AsyncStorage.setItem(global.appId+'-do-logout', "1");
        this.props.navigation.replace('Home');
    }

    _doChangeNumberPhone = ()=>{
        if(this.state.phonenumber === ''){
            Alert.alert(this.globallang.alert, this.pagelang.pleaseentermobile, [{ text: this.globallang.ok, onPress: () => console.log('OK Pressed') }], { cancelable: false });
            return false;
        }

        if(this.state.code === ''){
            Alert.alert(this.globallang.alert, this.pagelang.pleaseverificationcode, [{ text: this.globallang.ok, onPress: () => console.log('OK Pressed') }], { cancelable: false });
            return false;
        }

        let params = {
            userid : this.state.userid,
            phonenumber : this.state.phonenumber,
        }
        console.log(params);

        fetch(global.serverurl + global.webserviceurl + '/app_update_profile_phoneno.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: JSON.stringify(params)
        }).then((response) => {
            console.log(response);
            this._doLogout();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    changeCommunity(community) {
        global.community = community;
        //let d = new Date();
        //this.setState({ webUri: global.serverurl + '/?community=' + community.code + '&t=' + d.getTime(), title: community.text, canGoBack: false, canChangeCommunity: true });
    }

    // goBack=()=> {
    //     //let d = new Date();
    //     //this.setState({ webUri: global.serverurl + '/?page=mypage&community=' + global.community.code + '&t=' + d.getTime(), title: this.pagelang['title'], canGoBack: false, canChangeCommunity: false });
    //     this.props.navigation.goBack();
    // }

    //----receive on message from webview
    receivePost(param) {
        //let jsonParam = JSON.parse(param);
        //this.setState({ title: jsonParam.title, canGoBack: jsonParam.canGoBack });
    }
    //------------------------------------

    refreshPage = () => {
        //let d = new Date();
        //this.setState({ webUri: global.serverurl + '/?page=mypage&community=' + global.community.code + '&t=' + d.getTime(), title: community.text, canGoBack: false, canChangeCommunity: true });
    }

    canBeVerification() {
        const { phonenumber } = this.state;
        return phonenumber.length > 0;
    }
    canBeSubmitted() {
        const { code, phonenumber } = this.state;
        return code.length > 0 && phonenumber.length >0 ;
    }

    render() {
        const isEnabledOtp = this.canBeVerification();
        const isEnabled = this.canBeSubmitted();
        return (
            <View style={globalStyles.screenContainer}>
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor:'#fff' }}>
                    <View style={{flexDirection:'row', justifyContent:'center', paddingTop:20, paddingBottom:20,backgroundColor:'#2679F3'}}>
                        <View style={{flex:0, flexDirection:'column', paddingLeft:14}} >
                            <TouchableOpacity onPress={()=>this.handleBackPress()}>
                                <View style={{justifyContent:'center', flexDirection:'row'}} >
                                    <Image style={{ height:20, width:20 }} source={chevronLeft}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1, flexDirection:'column', justifyContent:'center'}}>
                            <Text style={{ fontSize:18, textAlign:'center', fontWeight:'bold', color:'#ffff'}} >{this.state.title}</Text>
                        </View>
                        <View style={{flex:0, flexDirection:'column', paddingRight:14}} >
                            <TouchableOpacity>
                                <View style={{justifyContent:'center', flexDirection:'row'}} >
                                    <Text style={{flexDirection:'column', textAlign:'center', color:'#000', fontSize:18, fontWeight:'bold', alignSelf:'center'}}>{this.pagelang.determine}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.formContainer}>
                        <View>
                            <TextInput style={styles.input} 
                                underlineColorAndroid='transparent' 
                                placeholder={this.pagelang.pleaseentermobile} 
                                style={styles.input} 
                                autoFocus={false}
                                keyboardType='phone-pad'
                                autoCapitalize = 'none'
                                onChangeText={(text)=>this.setState({phonenumber: text})}></TextInput>
                        </View>
                        <View style={{flex:0, flexDirection:'row', justifyContent:'center', marginTop:10}} >
                            <View style={{flex:2, flexDirection:'column', paddingRight:10 }} >
                                <View style={styles.inputContainer1}>
                                        <CodeInput
                                        ref="codeInputRef1"
                                        keyboardType="numeric"
                                        codeLength={6}
                                        inputPosition='center'
                                        size={15}
                                        containerStyle={{ marginTop: 15, marginBottom:18 }}
                                        activeColor='#000'
                                        inactiveColor='#000'
                                        compareWithCode={this.state.otp}
                                        autoFocus={false}
                                        onFulfill={(isValid, code) => this._onFinishCheckingCode2(isValid, code)}
                                        onCodeChange={(code) => { this.state.code = code }}
                                        />
                                </View>
                            </View>
                            <View style={{flex:1.2, flexDirection:'column'}} >
                                <TouchableOpacity onPress={()=>{this._doVerificationCode()}} disabled={!isEnabledOtp} >
                                    <View style={{backgroundColor:'#d4d5d5', justifyContent:'center', alignContent:'center', alignItems:'center', height:50, borderRadius:8 }} >
                                        <Text style={{fontSize:16, textAlign:'center', color:'#ff0000' }}>{this.pagelang.getverification}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{marginTop:10}} >
                            <TouchableOpacity disabled={!isEnabled} onPress={()=>{this._doChangeNumberPhone()}} >
                                <View style={{backgroundColor:'#2679F3', justifyContent:'center', alignContent:'center', alignItems:'center', height:50, borderRadius:6, elevation: 6 }} >
                                    <Text style={{fontSize:16, textAlign:'center', color:'#fff' }}>{this.pagelang.carryout}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    
}

export default EditMobilePhoneScreen