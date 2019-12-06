import React, { Component } from 'react';
import { TouchableOpacity,Keyboard } from 'react-native';
import {
    Container,
    Content,
    Text,
    Button,
    Row,
    Col,
    Icon,
    Footer,
    Spinner,
    Form,
    Item,
    Input,
    Label,
    Textarea,
    Toast,
    Fab,
    View
} from 'native-base'
import { showMessage, showToast, sleep, retrieveItem } from './../../../validator'
import { common, colors } from './../../../styles'
import styles from './styles';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { observer, inject } from "mobx-react";
import { USER_DATA } from '../../../const/variables';

@inject("BaseStore")
@observer
class MettingCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            emails:[],
            email:'',
            subject:'',
            agenda:'',
            user:'',
            selected_email:''
        };
    }

    async onNext() {
        let { email,emails,subject,agenda } = this.state;
        // await Keyboard.dismiss();
        if(email !== '') {
           emails.push(email)
        }
        if(subject === '') {
            
          showToast('Please enter subject','danger');
          return;
        }
        else if(emails.length === 0) {
            showToast('Please enter participent','danger');
            return;  
        }
        else if(agenda ===''){
            showToast('Please enter agenda','danger');
            return;
        }
        let userInfo = await retrieveItem(USER_DATA);
        
        emails.push(userInfo);
        let uniqueEmails = [...new Set(emails)];
        
        let details = {
            subject:subject,
            emails:uniqueEmails,
            agenda:agenda
        }
        this.props.BaseStore.meetingStore.setBasicDetails(details)
        this.props.navigation.navigate('MeetingLocation');
    }

    onAddEmail() {
        let { email,emails } = this.state;
        if(email === '') {
            showToast('Please enter emal id','danger');
            return;
        }
        emails.push(email);
        this.setState({
            emails:emails,
            email:''
        })
    }

    onBlur() {
        let { email } = this.state
        this.setState({
            selected_email:email
        })
     }

    async initData() {
        let data = await this.props.BaseStore.meetingStore.basicDetails;
        let user = await retrieveItem(USER_DATA);
        // this.setState({
        //     subject:data.subject,
        //     emails:data.emails,
        //     agenda:data.agenda
        // })
        this.setState({
            user:user
        })
    }
    componentDidMount() {
    //   let isCreated = this.props.BaseStore.meetingStore.isCreated;
    //   if(isCreated) {
    //     this.props.navigation.navigate('MeetingLocation');
    //   }
     this.initData();

    }

    render() {
        let { isLoading,emails,email,subject,agenda,user } = this.state
        return (
            <Container style={[common.safeArea]}>
                <Content padder>
                    <Form style={[common.marginHorizontal_10]}>
                        <Row size={20} >
                            <Col size={70}>
                                <Text style={common.text}>Subject</Text>
                                <Textarea bordered
                                    rowSpan={4}
                                    style={common.textArea}
                                    value={subject}
                                    onChangeText={(text)=>this.setState({subject:text})}
                                />
                            </Col>
                        </Row>
                        
                        <Row size={20} >
                            <Col size={80}>
                                <Form style={common.inputMargin}>
                                    <Text style={common.text}>Participants</Text>
                                    {emails.map((item)=>{
                                        return (
                                        <Input
                                        style={[common.input, common.inputMargin]}
                                        disabled
                                        value={item}
                                    />
                                     )
                                     })}
                                    
                                </Form>
                            </Col>
                        </Row>
                    </Form>
                    <Row size={20} style={{ marginLeft: responsiveWidth(10) }}>
                        <Col size={88} >
                            <Input 
                             style={[common.input, common.inputMargin]} 
                             onChangeText={(text)=>this.setState({email:text})}
                             value={email}
                             onSubmitEditing={Keyboard.dismiss}
                            //  onBlur={()=>this.onBlur()}
                            />

                        </Col>
                        <Col size={12} style={common.center}>
                            <TouchableOpacity onPress={()=>this.onAddEmail()}>
                            <Icon
                                name={'plus'}
                                type={'AntDesign'}
                            />
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    <Form style={[common.marginHorizontal_10]}>
                        <Row size={20} style={[common.inputMargin]}>
                            <Col size={80}>
                                <Text style={common.text}>Agenda</Text>
                                <Textarea bordered
                                    rowSpan={4}
                                    style={common.textArea}
                                    value={agenda}
                                    onChangeText={(text)=>this.setState({agenda:text})}
                                />
                            </Col>
                        </Row>
                        <Row size={20} style={[common.inputMargin, common.center]}>
                            <Button block style={{ backgroundColor: colors.pink }} onPress={()=>this.onNext()}>
                                <Text>Next</Text>
                            </Button>
                        </Row>
                    </Form>
                </Content>
                <Footer style={styles.footer}>
                    <Col size={70} style={common.marginHorizontal_5}>
                        <Text style={[common.text,{color:'white'}]}>{user}</Text>
                    </Col>
                    {/* <Col size={50}>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('MeetingContext')}>
                    <View style={styles.iconView}>
                    <Icon
                     name={'plus'}
                     type={'AntDesign'}
                     style={styles.icon}
                    />
                    </View>
                    </TouchableOpacity>
                    </Col> */}
                   
                </Footer>
                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('MeetingContext')}>
                    <Icon 
                     name="plus"
                     type={'AntDesign'}
                    />

                </Fab>
            </Container>
        )
    }
}

export default MettingCreate