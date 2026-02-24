import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    
    ContainerForm: {
        flex: 0,
        position: 'relative',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    inputContainer1: {
        borderColor:'#000',
        backgroundColor:'rgba(255, 255, 255, 0.4)',
        borderWidth: 1,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center',
    },
    formColumnPicture:{
        flex:0,
        paddingTop:15,
        paddingBottom:15,
        justifyContent:"center"
    },
    formContainer:{
        marginTop:60,
        marginLeft:25,
        marginRight:25,
        paddingLeft:16,
        paddingRight:16
    },
    input:{
        marginBottom:20,
        borderWidth:1,
        borderColor:'#000',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#fff'
    },
    verficationcode:{
        paddingLeft:10,
        paddingTop:10,
        paddingBottom:10,
        textAlign:'right',
        color:'#ff0000',
        backgroundColor:'#fff'
    },
    formRowContainer:{
        paddingRight:15,
        paddingLeft:15,
        backgroundColor:'#fff',
    },
    formRowContainer1:{
        paddingTop:20,
        paddingBottom:20,
    },
    formRowContainer2:{
        paddingTop:0,
        paddingBottom:10,
    },
    formRow1:{
        flex:0,
        flexShrink:1,
        flexDirection:'row',
        paddingLeft:10,
        paddingRight:10
    },
    formRow:{
        flex:0,
        flexShrink:1,
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#d9d9d9',
        paddingLeft:10,
        paddingRight:10
    },
    formRowGender:{
        flex:0,
        flexShrink:1,
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#d9d9d9',
        paddingLeft:10,
        paddingRight:10
    },
    formRow2:{
        flex:0,
        flexShrink:1,
        flexDirection:'row',
        paddingLeft:10,
        paddingRight:10
    },
    Cardcontainer: {
        flex: 1,
        padding: 6,
        width: '100%',
        height: undefined,
        backgroundColor: '#FFF',
        elevation: 2,
    },
    formColumn:{
        flex:1,
        paddingTop:15,
        paddingBottom:15,
        justifyContent:"center"
    },
    formColumnPicture:{
        flex:0,
        paddingTop:15,
        paddingBottom:15,
        justifyContent:"center"
    },
    formColumn2:{
        flex:1,
        paddingTop:15,
        paddingBottom:15,
        paddingRight:0,
        alignItems:"flex-end"
    },
    formColumnAlignLeft:{
        textAlign:'left',
        color:'#000'
    },
    formColumnAlignRight:{
        textAlign:'right',
        paddingRight:6
    },
    label:{
        color:'#000'
    },
    picture:{
        width:80,
        height:80,
        borderRadius:40,
        borderWidth:1,
        borderColor:'#d9d9d9'
    },
    buttonContainer:{
        paddingRight:15,
        paddingLeft:15,
        paddingTop:15,
        paddingBottom:15
    },
    buttonContainer2:{
        paddingRight:15,
        paddingLeft:15,
        paddingBottom:15
    }
});
export default styles;
