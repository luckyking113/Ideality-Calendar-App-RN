import {
    StyleSheet
} from 'react-native'
import {colors} from './../../../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

const styles = StyleSheet.create({
    item:{
        marginVertical:10,
        paddingVertical:10,
        paddingHorizontal:5,
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