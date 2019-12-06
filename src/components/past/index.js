import React from 'react'
import { Text,StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { View, Row, Card, Content } from 'native-base';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { common,colors } from './../../styles'
import moment from 'moment'

const propTypes ={
  text:''
}

const defaulProps ={
   text:PropTypes.string
}

const past=(props)=>{
  return(
    <Content
    showsVerticalScrollIndicator={false} 
    style={{height:responsiveHeight(100),backgroundColor:colors.lightBlue}}>
     {
       props.data && props.data.length>0 && (
          renderData(props.data)
       )
     }  
     {
       props.data && props.data.length==0 && (
          <Text style={[styles.text,common.marginHorizontal_5]}>No events found</Text>
       )
     }  
    
  
    </Content>
  )
}

const renderData=(data)=> {
  return data.map((item)=>{
    if(item.title!=='') {
      let date = moment.unix(item.start).format("YYYY-MM-DD")
      let start_time = moment.unix(item.start).format("hh:mm A")
      let end_time = moment.unix(item.end).format("hh:mm A")
    
      return(
        <View style={[styles.container,common.rowMarginTop_2]}>
          <Text style={styles.text}>{item.title}</Text>
          <Text style={styles.text}>{date+" "+start_time+" - "+end_time}</Text>
          <Text style={styles.text}>{item.description}</Text>
          <Text style={styles.text}>{item.location}</Text>
         </View> 
        )
    }
    
  })
 }
 const styles = StyleSheet.create({
   container:{
    width:responsiveWidth(90),
    backgroundColor:'#eee',
    paddingHorizontal:responsiveWidth(4),
    paddingVertical:responsiveWidth(2),
    borderRadius:10,
    borderWidth:1,
    borderColor:'lightgrey'
   },
   text:{
     fontSize: responsiveFontSize(2) 
   }
 })

past.defaulProps = defaulProps;
past.propTypes = propTypes
export default past;