import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth
} from 'react-native-responsive-dimensions'
import {
    StyleSheet
} from 'react-native'
import {colors} from './../../../styles'

const styles = StyleSheet.create({
  
  textarea:{
      width:responsiveWidth(80)
  },
  form:{
      width:responsiveWidth(80)
  },
  disabledInput:{
      color:colors.lightGray
  },
  row:{
      flexDirection:'column',
      width:responsiveWidth(80),
      backgroundColor:'grey'
  },
  iconView:{
      width:responsiveWidth(10),
      height:responsiveWidth(10),
      borderRadius:responsiveWidth(5),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#eee',
  },
  icon:{
    color:'black',
    // fontSize:responsiveFontSize(3),
    fontWeight:'bold',
    alignSelf:'center'
  },
  footer:{
      alignItems: 'center',
      justifyContent: 'center',
  }
})

export default styles;