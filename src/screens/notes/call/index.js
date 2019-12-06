import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { common, colors } from './../../../styles'
import styles from './styles';
import {
    Container,
    Text,
    Row,
    Col,
    Form,
    Content,
    Textarea,
    Button,
    Item,
    Icon,
    Input
} from 'native-base'
import { responsiveWidth } from 'react-native-responsive-dimensions'
import moment from 'moment'
import { showToast, showMessage, retrieveItem } from '../../../validator';
import { observer, inject } from "mobx-react";
import { TYPE, USER_DATA } from '../../../const/variables';
import { check, request, PERMISSIONS } from 'react-native-permissions';
import Contacts from 'react-native-contacts'

@inject("BaseStore")
@observer
class MeetingCall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            emails: [],
            email: '',
            goal: '',
            sentiment: '',
            followup: '',
            subject: '',
            isGranted: false,
            start_utc: 0,
            end_utc: 0,
            phone: ''

        };
    }

    componentDidMount() {

        this.initContacts();
    }

    initData() {
        let params = this.props.navigation.getParam('item')
        showMessage(params)
        if (params) {
            let phone = params.phone;
            let time = this.findStartEnd(params);
            showMessage(time);
            Contacts.getContactsByPhoneNumber(phone, (err, contacts) => {
                if (err !== 'denied') {
                    // error
                    showMessage(contacts);
                    let emails = [];
                    if (contacts.length > 0) {
                        let contact = contacts[0];
                        contact.emailAddresses.map((email) => {
                            emails.push(email.email)
                        })
                        this.setState({
                            start_utc: time.start,
                            end_utc: time.end,
                            emails: emails,
                            phone: phone
                        })
                    }
                    else {
                        this.setState({
                            start_utc: time.start,
                            end_utc: time.end,
                            phone: phone
                        })
                    }

                }
                else {
                    this.setState({
                        start_utc: time.start,
                        end_utc: time.end,
                        phone: phone
                    })
                }
            })
        }
    }

    findStartEnd(params) {
        let start = params.start;
        let end = params.end;
        let mins = moment.unix(start).minute();
        let secs = moment.unix(start).second();
        showMessage("mins " + mins + " sec " + secs)
        let start_time = 0;
        let end_time = 0;
        if (mins < 30) {
            start_time = start - (mins * 60) - secs;
            //    start_time = moment.unix(time).format("YYYY-MM-DD hh:mm:ss");
            //    showMessage(start_time);
        }
        else {
            let diff = mins - 30;
            start_time = start - (diff * 60) - secs;
            // start_time = moment.unix(time).format("YYYY-MM-DD hh:mm:ss");
            // showMessage(start_time);  
        }
        end_time = start_time + 1800;
        let data = {
            start: start_time,
            end: end_time,
            start_date: moment.unix(start_time).format("YYYY-MM-DD hh:mm:ss A"),
            end_date: moment.unix(end_time).format("YYYY-MM-DD hh:mm:ss A")
        }
        return data;
    }

    async syncServer(emails) {
        let { start_utc, end_utc } = this.state;
        emails.map(async(item) => {
            for (let i = start_utc; i <= end_utc;) {
                let date = moment.unix(i).format("YYYY-MM-DD");
                let time = moment.unix(i).format("HH:mm:ss");
                let params = {}
                params.email = item
                params.status = "Not Available"
                params.date = date
                params.time = time
                let response = await this.props.BaseStore.meetingStore.createServerEvent(params)
                showMessage(response);
                i = i + 1800;
            }
        })

    }

    async initContacts() {
        let status = await request(
            Platform.select({
                android: PERMISSIONS.ANDROID.READ_CONTACTS,
                ios: PERMISSIONS.IOS.CONTACTS,
            }),
        )
        // alert(status)
        if (status === 'granted') {
            this.initData()
        }
    }

    onAddEmail() {
        let { email, emails } = this.state;
        if (email === '') {
            showToast('Please enter emal id', 'danger');
            return;
        }
        emails.push(email);
        this.setState({
            emails: emails,
            email: ''
        })
    }

    async onSave() {

        let type = await retrieveItem(TYPE)

        if (type === 'google') {
            this.createGoogleEvent();
        }
        else {
            this.createMicrosoftEvent();
        }

    }



    async createGoogleEvent() {
        let { message, goal, sentiment, followup, subject, emails, email, start_utc, end_utc, phone } = this.state
        // let start_time = moment().format("YYYY-MM-DD") + " " + "11:00 am";
        // let end_time = moment().format("YYYY-MM-DD") + " " + "12:30 pm";
        // // let s_time = moment(start_time).unix() * 1000;
        // let e_time = moment(end_time).unix() * 1000;
        let s_time = start_utc * 1000;
        let e_time = end_utc * 1000;
        let user = await retrieveItem(USER_DATA);
        if (user) {
            emails.push(user)
        }
        if (email != "") {
            emails.push(email);
        }

        if (subject === '') {
            showToast('Please enter subject to proceed');
            return false;
        }


        let description = "";
        if (goal != "") {
            description = description + 'Goal Achived :' + goal + "\n"
        }
        if (sentiment != "") {
            description = description + 'Sentiment : ' + sentiment + "\n"
        }
        if (followup != "") {
            description = description + 'Followup :' + followup + "\n"
        }
        if (phone != "") {
            description = description + 'Phone :' + phone + "\n"
        }
        if (message != "") {
            description = description + 'Message :' + message + "\n"
        }

        let email_data = [];
        emails.map((email) => {
            let item = {}
            item.email = email;
            email_data.push(item)
        })

        let body = {
            summary: subject,
            description: description,

            start: {
                dateTime: new Date(s_time).toISOString(),
                timeZone: "US/Pacific"
            },
            end: {
                dateTime: new Date(e_time).toISOString(),
                timeZone: "US/Pacific"
            },
            attendees: email_data
        };
        let response = await this.props.BaseStore.meetingStore.createEvent(body);

        if (response.error) {
            showToast(response.error.message, 'danger');
            return
        }
        showToast('Event created successfully');
        this.syncServer(emails)
        this.props.navigation.navigate('MeetingContext')
    }

    async createMicrosoftEvent() {
        let { message, goal, sentiment, followup, subject, emails, email, start_utc, end_utc, phone } = this.state
        // let start_time = moment().format("YYYY-MM-DD") + " " + "11:00 am";
        // let end_time = moment().format("YYYY-MM-DD") + " " + "12:30 pm";
        // let s_time = moment(start_time).unix() * 1000;
        // let e_time = moment(end_time).unix() * 1000;
        let s_time = start_utc * 1000;
        let e_time = end_utc * 1000;
        let user = await retrieveItem(USER_DATA);
        if (user) {
            emails.push(user)
        }
        if (email != "") {
            emails.push(email);
        }
        if (subject === '') {
            showToast('Please enter subject to proceed');
            return false;
        }
        else if (emails.length === 0) {
            showToast('Please enter participant to proceed');
            return false;
        }

        let description = "";
        if (goal != "") {
            description = description + 'Goal Achived :' + goal + "\n"
        }
        if (sentiment != "") {
            description = description + 'Sentiment : ' + sentiment + "\n"
        }
        if (followup != "") {
            description = description + 'Followup :' + followup + "\n"
        }
        if (phone != "") {
            description = description + 'Phone :' + phone + "\n"
        }
        if (message != "") {
            description = description + 'Message :' + message + "\n"
        }
        let attendees = []
        emails.map((email) => {
            let item = {
                "EmailAddress": {
                    "Address": email,
                    "Name": email
                },
                "Type": "Required"
            }
            attendees.push(item)
        })

        let body = {
            Subject: subject,
            Body: {
                ContentType: "TEXT",
                Content: description
            },
            Start: {
                DateTime: new Date(s_time).toISOString(),
                TimeZone: "US/Pacific"
            },
            End: {
                DateTime: new Date(e_time).toISOString(),
                TimeZone: "US/Pacific"
            },
            Location: {
                DisplayName: "Not Found",
            },
            Attendees: attendees
        }
        let response = await this.props.BaseStore.meetingStore.createMicrosoftEvent(body);
        if (response.error) {
            showToast(response.error.message, 'danger');
            return
        }
        showToast('Event created successfully', 'success');
        // await sleep(1000)
        this.syncServer(emails)
        this.props.navigation.navigate('MeetingContext')
    }

    render() {
        let { message, email, emails, goal, sentiment, followup, subject, start_utc, end_utc } = this.state
        return (
            <Container style={[common.safeArea]}>
                <Content>
                    <Row style={common.marginHorizontal_5} size={50}>
                        <Form>
                            <Text style={[common.text]}>Save Call Notes:</Text>
                            {start_utc != '' && (
                                <>
                                    <Text style={[styles.text]}>{moment.unix(start_utc).format('LL')}</Text>
                                    <Text style={[styles.desc]}>{moment.unix(start_utc).format('hh:mm:ss A')} - {moment.unix(end_utc).format('hh:mm:ss A')}</Text>
                                </>
                            )}

                        </Form>
                    </Row>
                    <Row size={20} style={common.marginHorizontal_5}>
                        <Col size={80}>
                            <Form style={common.inputMargin}>
                                <Text >Participants</Text>
                                {emails.map((item) => {
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
                    <Row size={20} style={{ marginLeft: responsiveWidth(5) }}>
                        <Col size={88} >
                            <Input
                                style={[common.input, common.inputMargin]}
                                onChangeText={(text) => this.setState({ email: text })}
                                value={email}
                            />

                        </Col>
                        <Col size={12} style={common.center}>
                            <TouchableOpacity onPress={() => this.onAddEmail()}>
                                <Icon
                                    name={'plus'}
                                    type={'AntDesign'}
                                />
                            </TouchableOpacity>
                        </Col>
                    </Row>

                    <Row size={20} style={[common.marginHorizontal_5, common.rowMarginTop_2]}>
                        <Col size={50} style={styles.justifyCenter}>
                            <Text>Subject</Text>

                        </Col>
                        <Col size={50}>
                            <Item regular>
                                <Input
                                    placeholder={'Product Design'}
                                    placeholderTextColor={colors.darkGray}
                                    style={styles.prodBox}
                                    value={subject}
                                    onChangeText={(text) => this.setState({ subject: text })}
                                />
                            </Item>
                        </Col>
                    </Row>

                    <Row size={20} style={[common.marginHorizontal_5, common.rowMarginTop_2]}>
                        <Col size={85} style={styles.justifyCenter}>
                            <Text>Goal achieved rating:</Text>

                        </Col>
                        <Col size={15} >
                            <Item regular>
                                <Input
                                    placeholder={'9'}
                                    placeholderTextColor={colors.darkGray}
                                    style={styles.box}
                                    value={goal}
                                    onChangeText={(text) => this.setState({ goal: text })}
                                />
                            </Item>
                        </Col>
                    </Row>

                    <Row size={20} style={[common.marginHorizontal_5, common.rowMarginTop_2]}>
                        <Col size={85} style={styles.justifyCenter}>
                            <Text>Sentiment rating:</Text>

                        </Col>
                        <Col size={15} >
                            <Item regular>
                                <Input
                                    placeholder={'+3'}
                                    placeholderTextColor={colors.darkGray}
                                    style={styles.box}
                                    value={sentiment}
                                    onChangeText={(text) => this.setState({ sentiment: text })}
                                />
                            </Item>
                        </Col>
                    </Row>

                    <Row size={20} style={[common.marginHorizontal_5, common.rowMarginTop_2]}>
                        <Col size={85} style={styles.justifyCenter}>
                            <Text>Do follow up meeting:</Text>

                        </Col>
                        <Col size={15} >
                            <Item regular>
                                <Input
                                    placeholder={'X'}
                                    placeholderTextColor={colors.darkGray}
                                    style={styles.box}
                                    value={followup}
                                    onChangeText={(text) => this.setState({ followup: text })}
                                />
                            </Item>
                        </Col>
                    </Row>
                    <Row style={[common.marginHorizontal_5]} size={50}>
                        <Form style={styles.meeting}>
                            <Textarea bordered
                                rowSpan={4}
                                style={common.textArea}
                                value={message}
                                onChangeText={(text) => this.setState({ message: text })}
                                placeholder={'Notes from meeting'}
                            />
                            <Button primary
                                onPress={() => this.onSave()}
                                style={[common.rowMarginTop_2, common.center, common.button]}>
                                <Text>Save</Text>
                            </Button>
                        </Form>
                    </Row>
                </Content>
            </Container>
        );
    }
}

export default MeetingCall;
