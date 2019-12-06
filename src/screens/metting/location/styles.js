import {
    StyleSheet
} from 'react-native'
import {colors} from './../../../styles'
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions'

const styles = StyleSheet.create({
   text:{
       fontSize:responsiveFontSize(2)
   },
   boxText:{
       color:colors.white
   },
   box:{
       paddingVertical:5,
       paddingHorizontal:5,
       marginLeft:5
    //    width:responsiveWidth(25)
   },
   boxBorder:{
       borderWidth:2,
       borderColor:'#000000'
   },
   boxRed:{
       backgroundColor:colors.red,
       paddingVertical:5,
       paddingHorizontal:5,
    //    width:responsiveWidth(25)
   },
   boxBlue:{
       backgroundColor:colors.voilet,
       paddingVertical:5,
       paddingHorizontal:5,
       marginLeft:5,
       
    //    width:responsiveWidth(25)
   },
   boxGreen:{
       backgroundColor:colors.green,
       marginLeft:5,
       paddingVertical:5,
       paddingHorizontal:5,
    //    width:responsiveWidth(25)
   },
   boxGray:{
       backgroundColor:colors.lightGray,
       marginLeft:5,
       paddingVertical:5,
       paddingHorizontal:5,
    //    width:responsiveWidth(25)
   },
   mapBox:{
       height:responsiveHeight(25),
       borderColor:colors.gray,
       borderWidth:2

   },
   map: {
    ...StyleSheet.absoluteFillObject,
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