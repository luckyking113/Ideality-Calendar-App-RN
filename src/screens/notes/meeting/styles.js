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
      paddingVertical:responsiveHeight(1.5),
      fontSize:responsiveFontSize(2)
      
  },
  desc:{
      paddingVertical:responsiveHeight(1.5),
      fontSize:responsiveFontSize(2),
      color:colors.gray
  }
})
export default styles;