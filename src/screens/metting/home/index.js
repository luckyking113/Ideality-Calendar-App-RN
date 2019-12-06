import React, { Component } from 'react';
import { View, Switch } from 'react-native';
import {
    Container,
    Content,
    Text,
    Button,
    Row,
    Col,
    Icon,
    Footer,
    Spinner
} from 'native-base'
import { GoogleSignin } from 'react-native-google-signin';
import { showMessage, showToast,sleep } from './../../../validator'
import { common,colors } from './../../../styles'
import styles from './styles';
import { observer, inject } from "mobx-react";

@inject("BaseStore")
@observer
class MettingHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading:false
        };
    }

    async onCreate() {
        this.setState({
            isLoading:true
        })
        await sleep(1000);
        this.setState({
            isLoading:false
        })
        await this.props.BaseStore.meetingStore.setCreated(true);
      
        this.props.navigation.navigate('MeetingCreate')
    }

    render() {
        let { isLoading } = this.state
        return (

            <Container style={[common.safeArea]}>

                <Row size={30} style={[common.center]}>
                    {/* <Button transparent block bordered style={common.button} onPress={() => this.callGoogleApi()}> */}
                        <Text style={[common.text,styles.text]}>Create new meeting</Text>
                    {/* </Button> */}
                </Row>
                <Row size={20} style={[common.rowTop, common.rowCenter]}>
                    <Button transparent block style={[common.buttonCenter,styles.roundButton]} onPress={() => this.onCreate()}>
                        <Icon
                         name={'plus'}
                         type={'AntDesign'}
                         style={styles.icon}
                        />
                    </Button>
                </Row>
                <Row size={50}/>
                <Footer style={common.footer}>
                 {isLoading &&(
                    <Spinner color={colors.black} />
                 )}   
                </Footer>
            </Container>
        );
    }
}

export default MettingHome;
