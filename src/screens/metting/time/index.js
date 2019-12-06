import React, { Component } from 'react';
import { TouchableOpacity, View, FlatList } from 'react-native';
import {
    Container,
    Content,
    Text,
    Button,
    Row,
    Col,
    Icon,
    Fab,
    Footer,
    Spinner,
    Form,
    Item,
    Input,
    Label,
    Textarea,
    Picker
} from 'native-base'
import { showMessage, showToast, sleep, retrieveItem } from './../../../validator'
import { common, colors } from './../../../styles'
import styles from './styles';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import Carousel from 'react-native-snap-carousel'
import { time } from './../../../const/data/time'
import { observer, inject } from "mobx-react";
import moment from 'moment'
import firebase from 'react-native-firebase'
import { TYPE } from '../../../const/variables';
import { USER_DATA } from '../../../const/variables';
import Loader from './../../../components/loader'
const colorsArray = [
    '#5261f0', '#829BF8', '#54CBF6', '#FF1358', '#99153D', '#c8bfe7', '#f0f5fa', '#ff9966'
]

@inject("BaseStore")
@observer
class MeetingTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendar: [],
            items: time,
            emails: [],
            timings: [],
            id_selected: '',
            objs: [],
            user: '',
            timezone: 'US/Pacific',
            isFetched: false,
            isLoading:true
        };
        // this._renderItem = this._renderItem.bind(this)
    }


    getUniqueArr(old) {
        let arr = [];
        for (let i = 0; i < old.length; i++) {
            let element = old[i];
            // showMessage(arr.indexOf(element[0])+" value "+element[0])

            if (arr.indexOf(element[0]) === -1) {
                arr.push(element[0])
            }
        }
        showMessage(arr.length)
        return arr;
    }

    findData(arr, item) {
        let result = [];
        for (let i = 0; i < arr.length; i++) {

            if (item === arr[i][0]) {
                result.push(arr[i])
            }
        }
        return result;
    }

    async prepareData(dates, arr, emails) {
        let new_array = [];
        let new_emails = [];
        for (let c = 0; c < emails.length; c++) {
            new_emails.push({
                email: emails[c],
                status: "NA"
            })

        }

        for (let i = 0; i < dates.length; i++) {
            let searched = this.findData(arr, dates[i]);
            // showMessage(searched)
            let new_timings = [];

            let items = {};
            // showMessage(searched);


            for (let a = 0; a < searched.length; a++) {

                items.date = dates[i];

                for (let b = 0; b < searched[a].length; b++) {

                    var t_item = new_timings.find(x => x.title === searched[a][1]);
                    if (!t_item) {
                        let ids = [];
                        new_emails.map((item) => {
                            let email = item.email;
                            let index = searched[a].indexOf(email)
                            if (index) {
                                ids.push({
                                    email: searched[a][index],
                                    status: searched[a][index + 1]
                                })
                            }
                        })
                        new_timings.push({
                            id: a,
                            title: searched[a][1],
                            status: searched[a][4],
                            emails: ids,
                            selected: false
                        })
                    }
                }

            }
            // items.emails = new_emails;
            items.timings = new_timings;
            items.id = i;
            new_array.push(items);
        }
        // showMessage(new_array);
        return new_array;
    }

    async getTimeId() {
        let basic = this.props.BaseStore.meetingStore.basicDetails;
        showMessage(basic);
        let user = await retrieveItem(USER_DATA);
        if (user) {
            this.setState({
                user: user
            })
        }
        let emails = [];
        basic.emails.map((item) => {
            if (item) {
                emails.push(item)
            }
        })
        if (basic.emails.length === 0) {
            emails.push('sachtech2018.3@gmail.com')
        }
        // this.loadModal.open();
        let response = await this.props.BaseStore.meetingStore.getTimeForEmails(emails);

        let data = response.response;
        if (data!="null") {
            let items = JSON.parse(data);

            let dates = this.getUniqueArr(items)

            if (data.length > 0) {
                let final_data = await this.prepareData(dates, items, emails);
                final_data.sort((a, b) => {
                    let first_date = moment(a.date).unix();
                    let second_date = moment(b.date).unix();
                    return first_date - second_date
                })
                let final = []
                final_data.map((item, index) => {
                    if (index < 20) {
                        final.push(item)
                    }
                })
                await this.setState({
                    calendar: final,
                    isFetched: final.length > 0 ? false : true,
                    isLoading:false
                })
                // showMessage(JSON.stringify(final))
            }
            this.loadModal.close();
        }
        else{
            await this.setState({
                calendar: [],
                isFetched: true,
                isLoading:false
            })
        }

    }

    findStartEndTime(time) {
        let start = time[0].date + " " + time[0].time;
        let end_time = 0;
        if (time.length > 1) {
            let end = time[time.length - 1].date + " " + time[time.length - 1].time;
            let plus_time = moment(end).unix() + 1800;
            showMessage(plus_time)
            end_time = moment.unix(plus_time).format("YYYY-MM-DD HH:mm:ss")
        }
        if (time.length === 1) {

            let plus_time = moment(start).unix() + 1800;
            showMessage(plus_time)
            end_time = moment.unix(plus_time).format("YYYY-MM-DD HH:mm:ss")

        }
        let data = {
            start: start,
            end: end_time
        }
        return data
    }


    async syncServer(time) {
        // showMessage(data)
        let { id_selected, calendar } = this.state;
        let timings = calendar[id_selected].timings;
        let start_time = moment(time.start).unix();
        let end_time = moment(time.end).unix();
        

        // emails.map(async (email) => {
            for (let i = start_time; i < end_time;) {

                let date = moment.unix(i).format("YYYY-MM-DD");
                let sec = moment.unix(i).format("HH:mm:ss");
                let data = timings.find((item) => { return item.title === sec });
                
                if (data) {
                    showMessage(data);
                    let emails = data.emails;
                    emails.map(async(email)=>{
                        let params = {}
                        params.email = email.email
                        params.status = email.status ==='Available'|| email.status ==='Unknown'?'Not Available':email.status
                        params.date = date
                        params.time = sec
                        let response = await this.props.BaseStore.meetingStore.createServerEvent(params)
                        showMessage(response);
                    })
                    
                }

                i = i + 1800;
            }
        // })

    }

    async onNext() {
        // showToast('hello');
        let time = await this.findDateTime();
        let type = await retrieveItem(TYPE)
        if (time.length === 0) {
            showToast('Please select time', 'danger');
            return false;
        }

        if (type === 'google') {
            this.createGoogleEvent(time)
            return;
        }
        this.createMicrosoftEvent(time);
    }

    async createMicrosoftEvent(time) {
        let { timezone } = this.state;
        let basic = this.props.BaseStore.meetingStore.basicDetails;
        let location = this.props.BaseStore.meetingStore.locationDetails;

        let time_data = this.findStartEndTime(time);
        this.syncServer(time_data);

        let start_time = moment(time_data.start).unix() * 1000;
        let end_time = moment(time_data.end).unix() * 1000;
        let attendees = [];

        let description = "";

        if (location.phone != "") {
            description = description + 'Phone : ' + location.phone + "\n"
        }
        if (location.meeting != "") {
            description = description + 'Web Meeting : ' + location.meeting + "\n"
        }
        if (location.room != "") {
            description = description + 'Conf Room : ' + location.room + "\n"
        }
        if (basic.agenda != "") {
            description = description + 'Agenda : ' + basic.agenda + "\n";
        }

        basic.emails.map((email) => {
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
            Subject: basic.subject,
            Body: {
                ContentType: "TEXT",
                Content: description
            },
            Start: {
                DateTime: new Date(start_time).toISOString(),
                TimeZone: timezone
            },
            End: {
                DateTime: new Date(end_time).toISOString(),
                TimeZone: timezone
            },
            Location: {
                DisplayName: location.location,

            },
            Attendees: attendees
        }
        let response = await this.props.BaseStore.meetingStore.createMicrosoftEvent(body);
        if (response.error) {
            showToast(response.error.message, 'danger');
            return
        }
        showToast('Event created successfully', 'success');
        await sleep(1000)
        this.props.navigation.navigate('MeetingContext')
    }

    async createGoogleEvent(time) {
        let { timezone } = this.state;
        let basic = this.props.BaseStore.meetingStore.basicDetails;
        let location = this.props.BaseStore.meetingStore.locationDetails;
        showMessage(time);
        let time_data = this.findStartEndTime(time);
        this.syncServer(time_data);
        let start_time = moment(time_data.start).unix() * 1000;
        let end_time = moment(time_data.end).unix() * 1000;
        let description = "";

        if (location.phone != "") {
            description = description + 'Phone : ' + location.phone + "\n"
        }
        if (location.meeting != "") {
            description = description + 'Web Meeting : ' + location.meeting + "\n"
        }
        if (location.room != "") {
            description = description + 'Conf Room : ' + location.room + "\n"
        }
        if (basic.agenda != "") {
            description = description + 'Agenda : ' + basic.agenda + "\n";
        }
        // showMessage(start_time) 
        showMessage(basic.emails)

        let emails = [];
        basic.emails.map((email) => {
            let item = {}
            item.email = email;
            emails.push(item)
        })
        let body = {
            summary: basic.subject,
            description: description,
            location: location.location,
            start: {
                dateTime: new Date(start_time).toISOString(),
                timeZone: timezone
            },
            end: {
                dateTime: new Date(end_time).toISOString(),
                timeZone: timezone
            },
            attendees: emails
        };

        let response = await this.props.BaseStore.meetingStore.createEvent(body);
        if (response.error) {
            showToast(response.error.message, 'danger');
            return
        }
        showToast('Event created successfully', 'success');
        await sleep(1000)
        this.props.navigation.navigate('MeetingContext')
    }

    schduleNotification(item) {
        const notification = new firebase.notifications.Notification()
            .setTitle(item.summary)
            .setData({
                route: 'MeetingContext',
                notification_start_time: item.start.dateTime,
                notification_end_time: item.end.dateTime,
                title: item.summary
            })
            .android.setChannelId('idealily_notification')
            .android.setSmallIcon('ic_launcher')
            .android.setPriority(firebase.notifications.Android.Priority.Max)

        firebase.notifications().scheduleNotification(notification, {
            fireDate: new Date(item.end.dateTime).getTime(),
        })
    }

    initDates() {
        let date = moment();
        let startDate = moment().format("LL");
        let dates = [];
        let test = [];
        dates.push(startDate)
        for (let i = 1; i < 60; i++) {
            let new_date = moment(date, "DD-MM-YYYY").add("days", i);
            dates.push(new_date.format("LLL"));
        }
        this.setState({
            calendar: dates
        })
        showMessage(test);
    }

    async onTimingDeSelected(item, index) {

        let { calendar } = this.state;
        await this.onReset(item);

        let c_item = item.timings;
        let indexx = calendar.indexOf(item)
        let obj = c_item[index];
        showMessage(obj)
        c_item.map((itm) => {

            //    showMessage(itm.id) 
            if (obj.id === itm.id) {
                itm.selected = false;
            }
        })
        // c_item[index].selected = isSelected;
        calendar[indexx].timings = c_item;
        this.setState({
            calendar: calendar,
            id_selected: indexx
        }, () => {
            showMessage(calendar)
        })

    }

    async onTimingSelected(item, index) {

        let { calendar } = this.state;

        await this.onReset(item);
        let c_item = item.timings;
        let e_item = c_item[index].emails;
        c_item[index].selected = true;

        let indexx = calendar.indexOf(item)
        showMessage('index here --- ' + indexx);
        calendar[indexx].timings = c_item;
        this.setState({
            calendar: calendar,
            id_selected: indexx,
            emails: c_item[index].emails
        }, () => {
            showMessage(calendar)
        })

    }

    async onReset(item) {
        let { calendar, id_selected } = this.state;
        let indexx = calendar.indexOf(item)
        if (id_selected === '' || indexx === id_selected) {
            return;
        }
        let timings = calendar[id_selected].timings;
        timings.map((item, index) => {
            timings[index].selected = false;
        });
        calendar[id_selected].timings = timings;
        this.setState({
            calendar: calendar
        })
    }

    async onResetCurrent(item) {
        let { calendar } = this.state;

        let timings = calendar[item.id].timings;
        timings.map((item, index) => {
            timings[index].selected = false;
        });
        calendar[item.id].timings = timings;
        this.setState({
            calendar: calendar
        })
    }

    async findDateTime() {
        let { calendar } = this.state;
        let data = [];
        for (let i = 0; i < calendar.length; i++) {
            let timings = calendar[i].timings;
            let date = calendar[i].date;
            // showMessage(timings[0])
            timings.map((item, idx) => {

                if (item.selected) {
                    data.push({
                        time: item.title,
                        date: date,
                        email: item.email,
                        user_id: item.user_id
                    })
                }
            })

        }
        return data;
    }



    componentDidMount() {
        //   this.initDates();
        this.getTimeId();
    }



    render() {
        let { isFetched, calendar, emails, user,isLoading } = this.state
        return (
            <Container style={[common.safeArea]}>
                {/* <Content > */}
                <Row size={10} style={common.marginHorizontal_5}>
                    <Form>
                        <Text style={[common.text]}>Pick Time</Text>
                        {this.renderTimeZoneList()}
                    </Form>
                </Row>
                <Row size={70} >
                    {calendar.length > 0 && (
                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={calendar}
                            renderItem={({ item }) => this._renderItem(item)}
                            sliderWidth={responsiveWidth(100)}
                            itemWidth={responsiveWidth(91)}
                            layout={'default'}
                            loop={false}
                        // onSnapToItem={(obj) => this.setState({ 'selected_date': calendar[obj] })}
                        />
                    )}
                    {isFetched && (
                      <Text style={common.marginHorizontal_5}>Time slotes not found for selected email</Text>
                     )}
                    {isLoading && (
                       <Form style={common.center}>  
                       <Spinner
                        color={'blue'}
                        style={{width:responsiveWidth(100)}}
                       />
                       <Text>Fetching time slots</Text>
                       </Form>
                     )}


                </Row>
                {/* <Row size={20} > */}
                <View style={{ marginTop: 5 }}>
                    {this.renderEmails()}
                </View>
                {/* </Row> */}
                <Row size={20} style={[common.marginHorizontal_10]}>
                    {/* {this.renderEmails()} */}
                    {calendar.length > 0 && (
                        <Row size={20} style={[common.inputMargin]} >
                            <Button block style={{ backgroundColor: colors.pink }}
                                onPress={() => this.onNext()}>
                                <Text>BOOK !</Text>
                            </Button>
                        </Row>
                    )}
                </Row>
                {/* </Content> */}
                <Footer style={styles.footer}>
                    <Col size={70} style={common.marginHorizontal_5}>
                        <Text style={[common.text, { color: 'white' }]}>{user}</Text>
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
                <Loader
                    onRef={ref => this.loadModal = ref}
                    title={'Loading...'}
                />

            </Container>
        );
    }

    _renderItem(main_item) {
        let data = [];
        let { date, timings } = main_item;

        data.push(
            <Row size={10} style={[common.rowMarginTop_2]}>
                <Col size={50}>
                    <Text style={common.text}>{date}</Text>
                </Col>
            </Row>
        )

        data.push(
            <Row size={70}>
                <FlatList
                    data={timings}
                    //    renderItem={({items})=>this.renderTiming(items,item)}
                    renderItem={({ item }) => this.renderTiming(item, main_item)}
                    showsVerticalScrollIndicator={false}
                />
            </Row>
        );
        // emails.map((item, index) => {
        //     data.push(
        //         <View size={20} style={[common.rowMarginTop_2, { flexDirection: 'row' }]}>
        //             <Col size={70}>
        //                 <Text style={common.text}>{item.email} :</Text>
        //             </Col>
        //             <Col size={30}>
        //                 <Text style={common.text}>{item.status}</Text>
        //             </Col>
        //         </View>
        //     )
        // })

        return data;
    }
    onValueChange(value) {
        this.setState({
            timezone: value
        });
    }

    renderTimeZoneList() {
        let { calendar, timezone } = this.state;
        if (calendar.length === 0) {
            return null;
        }
        return (
            <>
                <Picker
                    mode="dropdown"
                    iosHeader="Select your SIM"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: responsiveWidth(65) }}
                    selectedValue={timezone}
                    onValueChange={(value) => this.onValueChange(value)}
                >
                    <Picker.Item label="PST - US/Pacific" value="US/Pacific" />
                    <Picker.Item label="CST - America/Chicago" value="America/Chicago" />
                    <Picker.Item label="EST - America/New_York" value="America/New_York" />
                    <Picker.Item label="IST - Asia/Kolkata" value="Asia/Kolkata" />
                </Picker>
            </>
        )
    }
    renderTiming(c_item, item) {
        // showMessage(c_item)
        let db_emails = c_item.emails;
        let color = '#3f48cc';
        db_emails.map((item)=>{
            if(item.status === 'Not Available' || item.status === 'Unknown') {
                color = '#7030a0'
            }
        })
        // if (c_item.status === 'Available') {
        //     color = '#3f48cc';
        // }
        // else if (c_item.status === 'Not Available') {
        //     color = '#7030a0'
        // }
        return (
            <Row size={10} style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => this.onTimingSelected(item, c_item.id)}>
                    <Col size={90} style={[styles.item,
                    {
                        backgroundColor: color,
                        borderWidth: c_item.selected ? 3 : 0,
                        width: responsiveWidth(80)
                    }]}>
                        <Text style={[common.text, { color: '#ffffff' }]}>{c_item.title}</Text>
                    </Col>
                </TouchableOpacity>
                <Col size={10} style={[common.center, { width: responsiveWidth(10) }]}>

                    {c_item.selected && (
                        <TouchableOpacity onPress={() => this.onTimingDeSelected(item, c_item.id)}>
                            <Icon
                                type={'AntDesign'}
                                name={'close'}
                            />
                        </TouchableOpacity>
                    )}
                </Col>
            </Row>
        )
    }
    renderEmails() {
        let { emails } = this.state;

        return emails.map((item) => {
            return (
                <View style={[common.marginHorizontal_5, { flexDirection: 'row' }]}>
                    <Col size={70}>
                        <Text style={common.text}>{item.email} :</Text>
                    </Col>
                    <Col size={30}>
                        <Text style={common.text}>{item.status}</Text>
                    </Col>
                </View>
            )

        })
    }
}

export default MeetingTime;
