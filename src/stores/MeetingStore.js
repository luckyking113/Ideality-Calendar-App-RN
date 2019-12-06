import { observable, action } from "mobx";
import { showMessage, retrieveItem } from './../validator'
import { NEARBY_URL, CREATE_EVENT,BASE_URL, UPDATE_EVENT, NEARBY_PLACES, MICROSOFT_API_URL } from './../const/urls'
import { API_KEY, TOKEN } from './../const/variables'
import { getApi } from './../api'

class MeetingStore {
    @observable isCreated = false;
    @observable basicDetails = {
        subject: "",
        emails: [],
        agenda: ""
    };
    @observable locationDetails = {
        phone: "",
        meeting: "",
        room: "",
        location: ""
    };
    @observable timeDetails = {};
    @observable isLoading = false;
    @observable isRefreshing = false;
    @observable errorMessage = '';

    @action setCreated = async (created) => {
        this.isCreated = created;
    }
    @action setBasicDetails = async (details) => {
        this.basicDetails = details;
    }
    @action setLocationDetails = async (locations) => {
        this.locationDetails = locations;
    }
    @action setTimeDetails = async (time) => {
        this.timeDetails = time;
    }
    @action setLoading = (status) => {
        this.isLoading = status;
    }

    @action setRefreshing = (status) => {
        this.isRefreshing = status;
    }

    @action setErrorMessage = (error) => {
        this.errorMessage = error;
    }

    @action nearByUser = async (location) => {

        showMessage(' store is called');

        // let url = NEARBY_URL + `${location.latitude},${location.longitude}&radius=${location.radius}&key=${API_KEY}&query=${location.query}`;
        let url = NEARBY_PLACES + `&input=${location.query}&locationbias=circle:${location.radius}@${location.latitude},${location.longitude}`;
        showMessage(url)
        let headers = {
        }
        let config = {
            url: url,
            headers: headers,
            data: null,
            type: 'GET'
        }

        this.setLoading(true);
        return getApi(config)
            .then(response => {
                this.setLoading(false);
                return response;
            }).catch(error => {
                this.setLoading(false);
                this.setErrorMessage(error);
            });

    }

    @action createServerEvent = async (data) => {

        showMessage('createServerEvent store is called');

        let url = BASE_URL + 'set_timeslots_dbx';
        let headers = {
            'Content-Type': 'application/json'
        }
       
        // data.append('email', 'test@gmail.com')
        let config = {
            url: url,
            headers: headers,
            data: JSON.stringify(data),
            type: 'POST'
        }

        this.setLoading(true);
        return getApi(config)
            .then(response => {
                this.setLoading(false);
                return response;
            }).catch(error => {
                this.setLoading(false);
                this.setErrorMessage(error);
            });
    }

    @action createEvent = async (data) => {
        showMessage('createEvent store is called');
        let token = await retrieveItem(TOKEN);
        showMessage(token);
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.accessToken
        }
        let config = {
            url: CREATE_EVENT,
            headers: headers,
            data: JSON.stringify(data),
            type: 'POST'
        }
        showMessage(config)
        this.setLoading(true);
        return getApi(config)
            .then(response => {
                this.setLoading(false);
                return response;
            }).catch(error => {
                this.setLoading(false);
                this.setErrorMessage(error);
            });
    }
    
    @action createMicrosoftEvent = async (data) => {
        showMessage('createMicrosoftEvent store is called');
        let token = await retrieveItem(TOKEN);
        showMessage(token);
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.access_token
        }
        
        let config = {
            url: MICROSOFT_API_URL+"events",
            headers: headers,
            data: JSON.stringify(data),
            type: 'POST'
        }
        showMessage(config)
        this.setLoading(true);
        return getApi(config)
            .then(response => {
                this.setLoading(false);
                return response;
            }).catch(error => {
                this.setLoading(false);
                this.setErrorMessage(error);
            });
    }
    
    @action updateEvent = async (data) => {
        showMessage('updateEvent store is called');
        let token = await retrieveItem(TOKEN);
        showMessage(token);
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.accessToken
        }
        let url = UPDATE_EVENT+data.calendar_id+"/events/"+data.event_id
        let config = {
            url: url,
            headers: headers,
            data: JSON.stringify(data.body),
            type: 'PUT'
        }

        this.setLoading(true);
        return getApi(config)
            .then(response => {
                this.setLoading(false);
                return response;
            }).catch(error => {
                this.setLoading(false);
                this.setErrorMessage(error);
            });
    }

    @action updateMicrosoftEvent = async (data) => {
        showMessage('updateMicrosoftEvent store is called');
        let token = await retrieveItem(TOKEN);
        showMessage(token);
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.access_token
        }
        
        let config = {
            url: MICROSOFT_API_URL+"events/"+data.event_id,
            headers: headers,
            data: JSON.stringify(data.body),
            type: 'PATCH'
        }
        showMessage(config)
        this.setLoading(true);
        return getApi(config)
            .then(response => {
                this.setLoading(false);
                return response;
            }).catch(error => {
                this.setLoading(false);
                this.setErrorMessage(error);
            });
    }

    @action getTimeForEmails = async (emailIds) => {
        showMessage('getTimeForEmails store is called');
        let params = '';
        emailIds.map((item,index)=>{
            if(index === emailIds.length-1)
            params = params+"'"+item+"'"
            else
            params = params+"'"+item+"'|"

        })
        let url = BASE_URL+'get_timesforemails_dbx?emails='+params
        showMessage(url)
        let config = {
            url: url,
            type: 'GET'
        }

        this.setLoading(true);
        return getApi(config)
            .then(response => {
                this.setLoading(false);
                return response;
            }).catch(error => {
                this.setLoading(false);
                this.setErrorMessage(error);
            });
    }

}
export default MeetingStore