import { observable, action } from "mobx";
import { showMessage } from './../validator'
import { BASE_URL, ATTENDENCE_URL,MICROSOFT_API_URL } from './../const/urls'
import { getApi } from './../api'

class LoginStore {
    @observable isLoading = false;
    @observable isRefreshing = false;
    @observable errorMessage = '';

    constructor(baseStore) {
        this.baseStore = baseStore;
    }

    @action createUser = async (emailId) => {

        showMessage('createUser store is called');

        let url = BASE_URL + 'init_user_dbx';
        let headers = {
            'Content-Type': 'application/json'
        }
        let data = {

        };
        data.email = 'test@gmail.com'
        // data.append('email', 'test@gmail.com')
        let config = {
            url: url,
            headers: headers,
            data: JSON.stringify({
                email:emailId
            }),
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

    @action getEventAttendence = async (token) => {

        showMessage('getEventAttendence store is called');

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

        let config = {
            url: ATTENDENCE_URL,
            headers: headers,
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
    
    @action getEventAttendenceMicrosoft = async (token) => {

        showMessage('getEventAttendenceMicrosoft store is called');

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

        let config = {
            url: MICROSOFT_API_URL+"events",
            headers: headers,
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

    @action setLoading = (status) => {
        this.isLoading = status;
    }

    @action setRefreshing = (status) => {
        this.isRefreshing = status;
    }

    @action setErrorMessage = (error) => {
        this.errorMessage = error;
    }
}

export default LoginStore;