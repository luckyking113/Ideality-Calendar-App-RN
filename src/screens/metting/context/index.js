import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import {
    Container,
    Text,
    Row,
    Tab,
    Tabs,
    Fab,
    Icon,
    Col,
    Footer,
    Button
} from 'native-base'
import { showMessage, showToast, retrieveItem } from './../../../validator'
import { common, colors } from './../../../styles'
import styles from './styles';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { observer, inject } from "mobx-react";
import Upcoming from './../../../components/upcoming'
import Past from './../../../components/past'
import { TOKEN, USER_DATA, TYPE } from './../../../const/variables'
import moment from 'moment'

@inject("BaseStore")
@observer
class MettingContext extends Component {

    constructor(props) {
        super(props);
        this.state = {
            past: [],
            upcoming: [],
            user: '',
            type:''
        }
    }
    componentDidMount() {
        this.getData();
    }

    async getData() {
        let type = await retrieveItem(TYPE);

        if (type === 'google') {
            this.getEventsData();
        }
        else {
            this.getMicrosoftEvents();
        }
      
    }

    async onRefresh() {
        showToast('Refreshing data')
        this.getData()
    }

    async getMicrosoftEvents() {
        let token = await retrieveItem(TOKEN);
        let user = await retrieveItem(USER_DATA);
        if (user) {
            this.setState({
                user: user
            })
        }
        let response = await this.props.BaseStore.loginStore.getEventAttendenceMicrosoft(token.access_token)
        showMessage(response)
        let value = response.value;
        let past = [];
        let upcoming = [];
        if (value && value.length > 0) {
           
            value.map((item) => {
                let start = item.Start.DateTime
                let end = item.End.DateTime
                let end_time = moment(end).unix();
                let start_time = moment(start).unix();
                let curr_time = moment().unix();
                if (!item.Subject) {
                    return;
                }
                if (end_time > curr_time) {
                    upcoming.push({
                        title: item.Subject,
                        location: item.Location.DisplayName,
                        description: item.BodyPreview,
                        start: start_time,
                        end: end_time
                    })
                }
                else{
                    past.push({
                        title: item.Subject,
                        location: item.Location.DisplayName,
                        description: item.BodyPreview,
                        start: start_time,
                        end: end_time
                    })
                }
            })
        }
        this.setState({
            past: past,
            upcoming: upcoming
        })
    }

    async getEventsData() {
        let token = await retrieveItem(TOKEN);
        let user = await retrieveItem(USER_DATA);
        if (user) {
            this.setState({
                user: user
            })
        }
        let events = await this.props.BaseStore.loginStore.getEventAttendence(token.accessToken);
        if (events.items && events.items.length === 0) {
            return;
        }
        let past = [];
        let upcoming = [];
        events.items.map((item) => {
            let end = item.end.dateTime;
            let start = item.start.dateTime;
            let end_time = moment(end).unix();
            let start_time = moment(start).unix();
            let curr_time = moment().unix();
            // showMessage(curr_time)  
            if (!item.summary) {
                return;
            }
            if (end_time > curr_time) {
                upcoming.push({
                    title: item.summary,
                    location: item.location,
                    description: item.description,
                    start: start_time,
                    end: end_time
                })
            }
            else {
                past.push({
                    title: item.summary,
                    location: item.location,
                    description: item.description,
                    start: start_time,
                    end: end_time
                })
            }

        })
        past.sort((a,b)=>{
            return a.start-b.start
        })
        upcoming.sort((a,b)=>{
            return a.start-b.start
        })
        this.setState({
            past: past,
            upcoming: upcoming
        })
    }
    render() {
        let { user } = this.state
        return (
            <Container style={[common.safeArea]}>
                <Row style={common.marginHorizontal_2} size={7}>
                    <Col size={80} >
                        <Text style={[common.text]}>Context Info</Text>
                    </Col>
                    <Col size={20}>
                        <Button style={common.center} small bordered onPress={() => this.onRefresh()}>
                            <Icon
                                name={'cw'}
                                type={'Entypo'}
                            />
                        </Button>
                    </Col>
                </Row>
                {/* <Content > */}

                <Row style={[common.marginHorizontal_5]} size={93}>

                    <Tabs
                        tabBarUnderlineStyle={styles.activeTab}
                        tabBarActiveTextColor={styles.activeTabText}
                        tabContainerStyle={styles.tab}
                    //   renderTabBar={()=> <ScrollableTab />}
                    >
                        <Tab
                            heading="Upcoming Events"
                            tabStyle={styles.tab}
                            activeTabStyle={styles.tab}
                            textStyle={styles.tabText}
                            activeTextStyle={styles.activeTabText}
                        >
                            <Upcoming
                                data={this.state.upcoming}
                            />
                        </Tab>
                        <Tab
                            heading="Past Events"
                            tabStyle={styles.tab}
                            activeTabStyle={styles.tab}
                            textStyle={styles.tabText}
                            activeTextStyle={styles.activeTabText}
                        >
                            <Past
                                // screenProps = {this.state.repsonse}
                                data={this.state.past}
                            />
                        </Tab>

                    </Tabs>
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
                    onPress={() => this.props.navigation.navigate('MeetingCreate')}>
                    <Icon
                        name="plus"
                        type={'AntDesign'}
                    />

                </Fab>
            </Container>
        )
    }
}

export default MettingContext;