package com.idealilyy;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  private static final int READ_PERMISSION_CODE = 100;
  private static final int CALL_PERMISSION_CODE = 101;

  @Override
  protected String getMainComponentName() {
    return "idealily";
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    this.checkPermission(Manifest.permission.READ_CALL_LOG,
            CALL_PERMISSION_CODE);
    this.checkPermission(Manifest.permission.READ_PHONE_STATE,
            READ_PERMISSION_CODE);

  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    if (requestCode == READ_PERMISSION_CODE) {
      if (grantResults.length > 0
              && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        //   Toast.makeText(MainActivity.this,
        //           "Read Phone Permission Granted",
        //           Toast.LENGTH_SHORT)
        //           .show();

      }
      else {
        //   Toast.makeText(MainActivity.this,
        //           "Read Phone Permission Denied",
        //           Toast.LENGTH_SHORT)
        //           .show();
      }
    }
    else if (requestCode == CALL_PERMISSION_CODE) {
      if (grantResults.length > 0
              && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        //   Toast.makeText(MainActivity.this,
        //           "Call Permission Granted",
        //           Toast.LENGTH_SHORT)
        //           .show();
      }
      else {
        //   Toast.makeText(MainActivity.this,
        //           "Call Permission Denied",
        //           Toast.LENGTH_SHORT)
        //           .show();
      }
    }
  }

  // Function to check and request permission.
  public void checkPermission(String permission, int requestCode)
  {
    if (ContextCompat.checkSelfPermission(MainActivity.this, permission)
            == PackageManager.PERMISSION_DENIED) {

      // Requesting the permission
      ActivityCompat.requestPermissions(MainActivity.this,
              new String[] { permission },
              requestCode);
    }
    else {
      //   Toast.makeText(MainActivity.this,
      //           "Permission already granted",
      //           Toast.LENGTH_SHORT)
      //           .show();
    }
  }
}
