import { observable, action } from "mobx";
import { showMessage, retrieveItem, showToast } from './../validator'
import { REDIRECT_URL,MICROSOFT_TOKEN_URL,MICROSOFT_API_URL } from './../const/urls'
import { MICROSOFT_CLIENT_ID,MICROSOFT_CLIENT_SECRET } from './../const/variables'
import { getApi } from './../api'

class MicrosoftStore {
    @observable isLoading = false;
    @observable isRefreshing = false;
    @observable errorMessage = ''

    @action setLoading = (status) => {
        this.isLoading = status;
    }

    @action setRefreshing = (status) => {
        this.isRefreshing = status;
    }

    @action setErrorMessage = (error) => {
        this.errorMessage = error;
    }

    @action getToken = async (code) => {
        showMessage('getToken store is called');
       
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        let url = MICROSOFT_TOKEN_URL+"?client_id="+MICROSOFT_CLIENT_ID+"&client_secret="+
        MICROSOFT_CLIENT_SECRET+"&redirect_uri="+REDIRECT_URL+"&grant_type=authorization_code&"+
        "code="+code;
        showMessage(url)
        let data = {
            client_id:MICROSOFT_CLIENT_ID,
            client_secret:MICROSOFT_CLIENT_SECRET,
            redirect_uri:REDIRECT_URL,
            grant_type:"authorization_code",
            code:code
        }

        const formBody = Object.keys(data)
        .map(
          key => `${encodeURIComponent(key)}=${data[key]}`
        )
        .join("&");

        let config = {
            url: MICROSOFT_TOKEN_URL,
            headers: headers,
            data: formBody,
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

    @action getProfile = async (token) => {

        showMessage('getProfile store is called');

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

        let config = {
            url: MICROSOFT_API_URL,
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

}

export default MicrosoftStore;