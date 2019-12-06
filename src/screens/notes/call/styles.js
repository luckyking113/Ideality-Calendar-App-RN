import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth
} from 'react-native-responsive-dimensions'
import {
    StyleSheet
} from 'react-native'
import { colors } from './../../../styles'

const styles = StyleSheet.create({
  text:{
      paddingVertical:responsiveHeight(1),
      fontSize:responsiveFontSize(2)
      
  },
  desc:{
      paddingVertical:responsiveHeight(1),
      fontSize:responsiveFontSize(2),
      color:colors.gray
  },
  meeting:{
      width:responsiveWidth(90)
  },
  justifyCenter:{
      justifyContent:'center'
  },
  box:{
      backgroundColor:colors.white
  },
  prodBox:{
      backgroundColor:colors.white,
  }
})
export default styles;