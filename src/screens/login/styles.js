import { StyleSheet } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default StyleSheet.create ({
		tabStyle: {
				display:'flex',
				justifyContent:"center",
				alignContent:"center",
				borderWidth: 0,
				borderBottomWidth: 1
		},
		tabTextStyle: {
				color:'black'
		},
		tabContainerStyle: {
				borderWidth: 0,
				backgroundColor: Colors.primary
		},
		MainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0
    },

    TabMainContainer: {
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,    
      width:'100%',
      paddingVertical:'4%'
    },

    FooterMainContainer:{
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      margin: 0,
      marginBottom:'4%'
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
      paddingLeft:15,
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
      paddingLeft:15,
      paddingVertical:4,
      justifyContent:'flex-start'  
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

		ImageIconGoogleStyle : {
			marginLeft : 10,
			height: 20,
			width: 20,
			resizeMode : 'stretch',
		},

		ImageIconOutlookStyle : {
			marginLeft: 10,
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
		SeparatorLine :{
			backgroundColor : '#fff',
			width: 1,
			height: 40
		},
		scene: {
			flex: 1,
		},

})