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
  tab:{
     backgroundColor:colors.lightBlue ,
     borderWidth:0,
     elevation:0
  },
  tabText:{
   //  backgroundColor:colors.white 
  },
  activeTab:{
     backgroundColor:colors.blue 
  },
  activeTabText:{
     color:colors.blue ,
     fontWeight:'600'
  },
  header:{
     backgroundColor:'transparent'
  },
  footer:{
   alignItems: 'center',
   justifyContent: 'center',
}
})
export default styles