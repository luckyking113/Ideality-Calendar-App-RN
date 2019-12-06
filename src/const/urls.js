import { API_KEY } from './../const/variables'

export const BASE_URL='http://54.193.69.187:8000/';
export const ATTENDENCE_URL='https://content.googleapis.com/calendar/v3/calendars/primary/events?key='+API_KEY
export const NEARBY_PLACES='https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key='+API_KEY
export const NEARBY_URL ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='
export const CREATE_EVENT = 'https://content.googleapis.com/calendar/v3/calendars/primary/events?maxAttendees=4&sendNotifications=true&sendUpdates=all&supportsAttachments=true&alt=json&key='+API_KEY;
export const UPDATE_EVENT = 'https://www.googleapis.com/calendar/v3/calendars/';
export const LOGIN = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
export const REDIRECT_URL='http://localhost'        
export const MICROSOFT_TOKEN_URL='https://login.microsoftonline.com/common/oauth2/v2.0/token'        
export const MICROSOFT_API_URL='https://outlook.office.com/api/v2.0/me/'        