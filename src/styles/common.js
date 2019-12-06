import { StyleSheet, StatusBar, Platform } from 'react-native';
import { responsiveHeight,responsiveFontSize,responsiveWidth } from 'react-native-responsive-dimensions'
import colors from './colors';
import fonts from './fonts';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Platform.select({ ios: 0, android: StatusBar.currentHeight }),
  },
  textInput: {
    borderColor: '#e3e6ea',
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 4
  },
  formText: {
    color: '#000',
    marginTop: 10
  },
  accentButton: {
    // backgroundColor: '#ff9966',
    borderWidth: 0,
    color: '#fff'
  },
  center:{
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center'
  },
  rowCenter:{
    justifyContent:'center'
  },
  rowTop:{
    paddingTop:responsiveHeight(10)
  },
  rowTop_5:{
    paddingTop:responsiveHeight(5)
  },
  rowMarginTop_5:{
    marginTop:responsiveHeight(5)
  },
  rowMarginTop_2:{
    marginTop:responsiveHeight(2)
  },
  text:{
    fontFamily:fonts.primaryCorsiva,
    fontSize:responsiveFontSize(2.3),
    fontWeight:'800',
    color:colors.black,
  },
  button:{
    borderColor:colors.black
  },
  buttonCenter:{
    alignSelf:'center'
  },
  footer:{
    marginVertical:responsiveHeight(1),
    backgroundColor:'transparent'
  },
  input:{
    // backgroundColor:colors.white,
  },
  inputMargin:{
    marginTop:responsiveHeight(2)
  },
  textArea:{
    // backgroundColor:colors.white,
    marginTop:responsiveHeight(2)
  },
  paddingHorizontal_5:{
    paddingHorizontal:responsiveWidth(5)
  },
  marginHorizontal_5:{
    marginHorizontal:responsiveWidth(5)
  },
  paddingHorizontal_5:{
    paddingHorizontal:responsiveWidth(5)
  },
  marginHorizontal_5:{
    marginHorizontal:responsiveWidth(5)
  },
  marginHorizontal_2:{
    marginHorizontal:responsiveWidth(2)
  },
  marginHorizontal_10:{
    marginHorizontal:responsiveWidth(10)
  },

  contentStyle:{
    flex:1, 
    justifyContent:'center', 
    alignItems:'center'
  },
  loginTabContainer:{
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',     
    width:'100%'
  },
  loginTabContent:{
    backgroundColor:'white', 
    width:'100%',
    height:'50%',     
    justifyContent:'center',
    width:'90%',
    // alignItem:'center',
    alignSelf:"center"
  },
  scene: {
    flex: 1,
  },
  GooglePlusStyle: {
    flexDirection: 'row',
    alignItems: 'center',    
    // backgroundColor: '#dc4e41',
    borderWidth: 2,
    borderColor: '#3E92CE',
    height: 40,
    borderRadius: 5 ,
    width: 230,
    // margin: 5, 
    paddingHorizontal:10,
    paddingVertical:4,
    justifyContent:'flex-start'
  },
  OutlookStyle: {
    flexDirection: 'row',
    alignItems: 'center',    
    // backgroundColor: '#dc4e41',
    borderWidth: 2,
    borderColor: '#3E92CE',
    height: 40,
    borderRadius: 5 ,
    width: 230,
    // margin: 5, 
    paddingHorizontal:10,
    paddingVertical:4,
    justifyContent:'flex-start'  
  },
  MainContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,    
    width:'100%',
    paddingVertical:'4%'
  },
  ImageIconGoogleStyle : {
    marginLeft : 10,
    height: 20,
    width: 20,
    resizeMode : 'stretch',
  },
  TextStyle :{
    color: "#000",
    textDecorationLine:'underline'
  },
  TextStyle1 :{
    color: "#000",
    // backgroundColor : 'black',
    // width: 207,
    // height: 40,
    marginLeft:10
  },
  ImageIconOutlookStyle : {
    marginLeft: 10,
    height: 20,
    width: 20,
    resizeMode : 'stretch',
  },
  GuestStyle: {
    flexDirection: 'row',
    alignItems: 'center',
//    backgroundColor: '#fff',
    borderWidth: 0,
    borderColor: '#fff',
    height: 40,
    borderRadius: 5 ,
  //    margin: 5,   
  },
  ImageIconStyle: {
    // padding: 10,
    // margin: 5,
    height: 15,
    width: 21,
    resizeMode : 'stretch',  
  },
});
