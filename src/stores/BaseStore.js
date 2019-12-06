import LoginStore from './LoginStore';
import MeetingStore from './MeetingStore';
import MicrosoftStore from './MicrosoftStore';
class BaseStore {
    constructor() {
        this.loginStore = new LoginStore(this);
        this.meetingStore = new MeetingStore(this);
        this.microsoftStore = new MicrosoftStore(this);
    }
}

export default BaseStore;