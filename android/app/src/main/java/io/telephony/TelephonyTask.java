package io.telephony;
import android.content.BroadcastReceiver;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
//import com.android.content.BroadcastReceiver;

public  class TelephonyTask extends ReactContextBaseJavaModule {
    private static Boolean isOn = false;
    private static ReactApplicationContext reactApplicationContext;
    public TelephonyTask(ReactApplicationContext reactContext) {

        super(reactContext);
        reactApplicationContext = reactContext;
    }


    public static ReactApplicationContext getReactContext() {
        return reactApplicationContext;
    }

    @ReactMethod
    public void getStatus(
        Callback successCallback) {
        successCallback.invoke(null, isOn);

    }

    @ReactMethod
    public void turnOn() {
        isOn = true;
        System.out.println("Bulb is turn ON");
    }
    @ReactMethod
    public void turnOff() {
        isOn = false;
        System.out.println("Bulb is turn OFF");
    }

    @Override
    public String getName() {
        return "TelephonyTask";
    }
    public static void sendEvent(ReactApplicationContext reactContext,String event,WritableMap data) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(event, data);
    }

}