package com.idealilyy;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.telephony.TelephonyManager;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.util.Locale;

import io.telephony.TelephonyTask;

public class PhoneStateReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        try {
            String state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
            String incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);
            TelephonyManager tm = (TelephonyManager)context.getSystemService(Context.TELEPHONY_SERVICE);
            String countryCodeValue = tm.getNetworkCountryIso();

//            Toast.makeText(context, "Ringing", Toast.LENGTH_SHORT).show();

            if (state.equals(TelephonyManager.EXTRA_STATE_RINGING)) {
//                Toast.makeText(context, "Ringing State Number is - "+countryCodeValue + incomingNumber, Toast.LENGTH_SHORT).show();
                WritableMap data = Arguments.createMap();
                data.putString("country",countryCodeValue);
                data.putString("phone",incomingNumber);
                TelephonyTask.sendEvent(TelephonyTask.getReactContext(),"ringing",data);
            }
            else if(state.equals(TelephonyManager.EXTRA_STATE_OFFHOOK))
            {
//                Toast.makeText(context, "OFFHOOK State Number is - " +countryCodeValue + incomingNumber, Toast.LENGTH_SHORT).show();
                WritableMap data = Arguments.createMap();
                data.putString("country",countryCodeValue);
                data.putString("phone",incomingNumber);
                TelephonyTask.sendEvent(TelephonyTask.getReactContext(),"busy",data);
            }
            else if((state.equals(TelephonyManager.EXTRA_STATE_IDLE)))
            {
//                Toast.makeText(context, "IDLE State Number is - "+countryCodeValue  + incomingNumber, Toast.LENGTH_SHORT).show();
                WritableMap data = Arguments.createMap();
                data.putString("country",countryCodeValue);
                data.putString("phone",incomingNumber);
                TelephonyTask.sendEvent(TelephonyTask.getReactContext(),"disconnect",data);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
