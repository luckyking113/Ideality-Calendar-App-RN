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
    roundButton:{
      width:responsiveWidth(17),
      height:responsiveWidth(17),
      borderRadius:responsiveWidth(8.5),
      backgroundColor:colors.lightBluee,
      borderWidth:0
    },
    text:{
        fontSize:responsiveFontSize(3)
    },
    icon:{
        color:colors.black,
        fontSize:responsiveFontSize(4)
    },
    progress:{
        color:colors.black
    }
})

export default styles;