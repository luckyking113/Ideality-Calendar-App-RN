import React,{
    Component
} from 'react';
import {
 TouchableOpacity,
 StyleSheet,
 Image,
 View
} from 'react-native';
import { responsiveHeight,responsiveWidth,responsiveFontSize } from 'react-native-responsive-dimensions'
import Modal from 'react-native-modalbox'
import { Row,Col,Text,Spinner } from 'native-base'
import { common,colors } from './../../styles'

export default class Loader extends Component{

    componentDidMount() {
        this.props.onRef(this.refs.loadModal); 
    }
    render() {
        return(
            <Modal 
            style={styles.modal} 
            position={'center'} 
            ref={"loadModal"} 
            >
            <Row size={20} style={[common.center,common.marginHorizontal_5]}>
             <Col size={20}>
                <Spinner
                 color={colors.black}
                />
             </Col>
             <Col size={90} style={common.marginHorizontal_2}>
                 <Text>{this.props.title}</Text>
             </Col>
            </Row>    
           </Modal>
        )
    }
    
}

const styles = StyleSheet.create({
    modal:{
        minHeight: responsiveHeight(20),
        height:responsiveHeight(20),
        width:responsiveWidth(80),
        borderRadius:responsiveWidth(2),
        backgroundColor:'#ffffff',
   
    }
})