import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { common, colors } from './../../../styles'
import styles from './styles';
import {
    Container,
    Text,
    Row,
    Form,
    Content,
    Textarea,
    Button
} from 'native-base'
import { showToast, showMessage } from '../../../validator';
import moment from 'moment';
import { responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { observer, inject } from "mobx-react";

@inject("BaseStore")
@observer
class MeetingNotes extends Component {
    constructor(props) {
        super(props);

        const notification_data = this.props.navigation.getParam('notification_data');

        this.state = {
            message: '',
            notification_data: notification_data ? notification_data : {},
            goal: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            sentimentRating: ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5'],
            selectedGoal: '',
            selectedSentiment: ''
        };
    }


   async onSave() {
        let type = await retrieveItem(TYPE) 
        if(type === 'google') {
            this.updateGoogleEvent();
        }  
        else{
            this.updateMicrosoftEvent();
        }
    }

   async updateGoogleEvent() {
        let { message, selectedGoal, selectedSentiment,notification_data } = this.state
        let description = "";
        if(selectedGoal!="")
        {
            description = description+"Goal Achieved : "+selectedGoal+"\n"
        }
        if(selectedSentiment!="") {
            description = description+"Sentiments : "+selectedGoal+"\n"
        }
        if(message!="") {
            description = description+"Message : "+message+"\n"
        }

        showMessage(notification_data);
        let start_time = moment(notification_data.start_time).unix()*1000;
        let end_time = moment(notification_data.end_time).unix()*1000;
        let id = notification_data.id;
        let calendar_id = notification_data.calendar_id;
        
        let body = {
            summary:notification_data.title,
            description: description,
            start: {
                dateTime: new Date(start_time).toISOString(),
                timeZone: "US/Pacific"
            },
            end: {
                dateTime: new Date(end_time).toISOString(),
                timeZone: "US/Pacific"
            }
        };
        let params = {
            body:body,
            calendar_id:calendar_id,
            event_id:id
        }
        showMessage(params);
       let response = await this.props.BaseStore.meetingStore.updateEvent(params);
       showMessage(response)
       if(response.error) {
           showToast(response.error.message,'danger');
           return
       }
       showToast("Meeting note updated",'success');
    }

    async updateMicrosoftEvent() {
        let { message, selectedGoal, selectedSentiment,notification_data } = this.state
        let description = "";
        if(selectedGoal!="")
        {
            description = description+"Goal Achieved : "+selectedGoal+"\n"
        }
        if(selectedSentiment!="") {
            description = description+"Sentiments : "+selectedGoal+"\n"
        }
        if(message!="") {
            description = description+"Message : "+message+"\n"
        }

        showMessage(notification_data);
        let start_time = moment(notification_data.start_time).unix()*1000;
        let end_time = moment(notification_data.end_time).unix()*1000;
        let id = notification_data.id;
        let body = {
            Subject:notification_data.title,
            BodyPreview: description,
            Start: {
                DateTime: new Date(start_time).toISOString(),
                TimeZone: "US/Pacific"
            },
            End: {
                DateTime: new Date(end_time).toISOString(),
                TimeZone: "US/Pacific"
            }
        };
        let params = {
            body:body,
            event_id:id
        }
        showMessage(params);
       let response = await this.props.BaseStore.meetingStore.updateMicrosoftEvent(params);
       showMessage(response)
       if(response.error) {
           showToast(response.error.message,'danger');
           return
       }
       showToast("Meeting note updated",'success');
    }
    render() {
        let { message, notification_data } = this.state
        let title = notification_data.title ? notification_data.title : 'No title';
        let date = notification_data.notification_start_time ? moment(notification_data.notification_start_time).format("LL") : moment().format("LL");
        let start_time = notification_data.notification_start_time ? moment(notification_data.notification_start_time).format("LT") : moment().format("LT");
        let end_time = notification_data.notification_end_time ? moment(notification_data.notification_end_time).format("LT") : moment().format("LT");
        return (
            <Container style={[common.safeArea]}>
                <Row style={common.marginHorizontal_5} size={50}>
                    <Form>
                        <Text style={[common.text]}>Save Meeting Notes</Text>
                        <Text style={[styles.text]}>{title}</Text>
                        <Text style={[styles.text]}>{date}</Text>
                        <Text style={[styles.desc]}>{start_time} - {end_time}</Text>
                        <Text style={[styles.desc]}>Goal achieved rating:</Text>
                        <Form style={{ flexDirection: 'row' }}>
                            {this.renderGoal()}
                        </Form>
                        <Text style={[styles.desc]}>Sentiment rating:</Text>
                        <Form style={{ flexDirection: 'row' }}>
                            {this.renderSentimentRating()}
                        </Form>
                        <Text style={[styles.desc]}>Do follow up meeting:</Text>
                    </Form>
                </Row>
                <Row style={common.marginHorizontal_5} size={50}>
                    <Content>
                        <Textarea bordered
                            rowSpan={4}
                            style={common.textArea}
                            value={message}
                            onChangeText={(text) => this.setState({ message: text })}
                        />
                        <Button primary
                            onPress={() => this.onSave()}
                            style={[common.rowMarginTop_2, common.center, common.button]}>
                            <Text>Save</Text>
                        </Button>
                    </Content>

                </Row>
            </Container>
        );
    }

    renderGoal() {
        return this.state.goal.map((item) => {
            return (
                <TouchableOpacity style={{
                    width: responsiveWidth(7),
                    height: responsiveWidth(7),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: this.state.selectedGoal == item ? '#fff' : '#000',
                    borderWidth: 1,
                    marginLeft: responsiveWidth(1)
                }}
                    onPress={() => this.setState({ selectedGoal: item })}
                >
                    <Text style={{ color: this.state.selectedGoal == item ? '#000' : '#fff', fontSize: responsiveFontSize(1.5) }}>{item}</Text>
                </TouchableOpacity>
            )
        })
    }


    renderSentimentRating() {
        return this.state.sentimentRating.map((item) => {
            return (
                <TouchableOpacity style={{
                    width: responsiveWidth(7),
                    height: responsiveWidth(7),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: this.state.selectedSentiment == item ? '#fff' : '#000',
                    borderWidth: 1,
                    marginLeft: responsiveWidth(1)
                }}
                    onPress={() => this.setState({ selectedSentiment: item })}
                >
                    <Text style={{ color: this.state.selectedSentiment == item ? '#000' : '#fff', fontSize: responsiveFontSize(1.5) }}>{item}</Text>
                </TouchableOpacity>
            )
        })
    }
}

export default MeetingNotes;
