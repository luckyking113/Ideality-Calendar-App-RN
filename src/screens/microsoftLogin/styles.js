import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth
} from 'react-native-responsive-dimensions'
import {
    StyleSheet
} from 'react-native'
import { colors } from './../../styles'

const styles = StyleSheet.create({
  header:{
      justifyContent:'flex-end',
      alignItems:'flex-start'
  },
  loader:{
    position:'absolute',
    zIndex:2
  },
  webView:{
      zIndex:1,
      marginTop:5
  }
});
export default styles;