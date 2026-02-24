import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    
    formRowContainer:{
        paddingLeft:30,
        paddingRight:30
    },
    pictureContainer: {
        flex: 1,
        position: 'relative',
        alignItems: 'center',
        paddingTop: 16,
        paddingLeft:20,
        paddingRight:20,
        paddingBottom: 16,
        elevation: 6
    },
    formRow:{
        flex:0,
        flexShrink:1,
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#d9d9d9',
        paddingLeft:20,
        paddingRight:20,
        marginBottom:10
    },
    formRowEdit:{
        flex:0,
        flexShrink:1,
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#d9d9d9',
        paddingLeft:20,
        paddingRight:10,
        marginBottom:10
    },
    picture:{
        width:100,
        height:100,
        borderRadius:60,
        borderWidth:1,
        borderColor:'#d9d9d9'
    },
    formContainer:{
        padding:20,
        backgroundColor:'#fff'
    },
    label:{
        marginBottom:6,
        // color:'#000'
    },
    input:{
        marginBottom:20,
        borderWidth:1,
        borderColor:'#000',
        color:'#000',
        borderRadius:10,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:8,
        paddingBottom:8
    },
    select:{
        marginBottom:20,
        borderColor:'#000',
        backgroundColor:'rgba(246,246,246,1)',
        borderRadius:5,
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:8,
        paddingBottom:8
    },
    selectLabel:{
        marginBottom:20,
        paddingTop:8,
        paddingBottom:8,
        
    },
    selectText:{
        alignSelf:'flex-start',
        marginLeft:16,
        color:'#000',
        borderBottomColor: '#FFFFFF',
        flex:1,
        marginTop:16,
        marginBottom:16
    },

    selectTextDate:{
        alignSelf:'flex-start',
        marginLeft:16,
        color:'#000',
        borderBottomColor: '#FFFFFF',
        flex:1,
        marginTop:10,
        marginBottom:10
    },

    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatar: {
        width:120,
        height:120,
        borderRadius:80,
        borderWidth:1,
        borderColor:'#d9d9d9'
      },

    inputContainer1: {
        borderColor:'#000',
        backgroundColor:'rgba(246,246,246,1)',
        borderRadius:5,
        borderWidth: 1,
        marginBottom:16,
        flexDirection: 'row',
        alignItems:'center',
    },
    inputIcon:{
        width:20,
        height:20,
        marginLeft:15,
        justifyContent: 'center'
    },
    inputs:{
        height:45,
        marginLeft:16,
        color:'#000',
        borderBottomColor: '#FFFFFF',
        flex:1,
        marginTop:5
    },
    visibilityBtn:
    {
    position: 'absolute',
    right: 4,
    padding: 8
    },
 
    btnImage:
    {
        width:20,
        height:20,
    },
    btnImageIcon:{
        width:20,
        height:20,
    },

    contentContainer: {
        flex: 1,
    },
    formRowContainer1:{
        paddingTop:20,
        paddingBottom:20,
    },
    formRowContainer2:{
        paddingTop:0,
        paddingBottom:10,
    },
    Cardcontainer: {
        flex: 1,
        padding: 6,
        width: '100%',
        height: undefined,
        backgroundColor: '#FFF',
        elevation: 2,
    },
    formRow1:{
        flex:0,
        flexShrink:1,
        flexDirection:'row',
        paddingLeft:20,
        paddingRight:20
    },
    formColumn:{
        flex:1,
        paddingTop:15,
        paddingBottom:15,
        justifyContent:"center"
    },
    formColumnEmail:{
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
    formColumnAlignRight:{
        textAlign:'right',
        color:'#000',
    },
    formColumnAlignRightEdit:{
        textAlign:'right',
        color:'rgb(8,194,223)'
    },

    picture:{
        width:80,
        height:80,
        borderRadius:40,
        borderWidth:1,
        borderColor:'#d9d9d9'
    },
});
export default styles;
