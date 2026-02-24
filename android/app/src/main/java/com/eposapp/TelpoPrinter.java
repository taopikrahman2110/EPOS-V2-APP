package com.eposapp;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import java.util.Objects;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Locale;
import java.text.SimpleDateFormat;

import androidx.annotation.NonNull;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.telpo.tps550.api.TelpoException;
import com.telpo.tps550.api.printer.UsbThermalPrinter;
import com.telpo.tps550.api.util.StringUtil;
import com.telpo.tps550.api.util.SystemUtil;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Hashtable;


public class TelpoPrinter extends ReactContextBaseJavaModule {

    // public TelpoSdk telpoSdk = null;
    // public MyTelpoHandler telpoHandler = null;
    private Context context = null;
    private ReactContext reactContext = null;
    public TelpoPrinter myself = this;

    private final int NOPAPER = 3;
    private final int LOWBATTERY = 4;
    private final int OVERHEAT = 12;
    private String Result;
    private boolean LowBattery = false;
    UsbThermalPrinter usbThermalPrinter;

    TelpoPrinter(ReactApplicationContext context){
        super(context);
        this.context = context.getApplicationContext();
        this.reactContext = getReactApplicationContext();
        usbThermalPrinter = new UsbThermalPrinter(this.context); 
    }

    @Override
    public String getName(){
        return "TelpoPrinter";
    }

    @ReactMethod
    public void createModule() {
        Log.d("TelpoPrinter", "Create event ");

    }

    @ReactMethod
    public void initializePrinter() {
       try {
            usbThermalPrinter.start(1);
        } catch (TelpoException e) {
            e.printStackTrace();
        }
    }

    private int parseProductQty(Object value) {
        if (value instanceof Integer) {
            return (int) value;
        } else if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                return 0; // Return a default value if parsing fails
            }
        }
        return 0; // Return a default value if the type is unexpected
    }

    @ReactMethod
    public void printData(ReadableMap data) {
        try {

            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
            SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());

            String formattedDate = dateFormat.format(new Date());
            String formattedTime = timeFormat.format(new Date());

            String orderId = data.getString("orderId");
            String invoiceId = data.getString("invoiceId");
            String outletName = data.getString("outletName");
            String metode = data.getString("metodePembayaran");
            String tableName = data.getString("tableName");
            String kasir = data.getString("kasir");
            double dpp = data.getDouble("dpp");
            double tarifPB1 = data.getDouble("tarifPB1");
            double total = data.getDouble("total");
            double amount = data.getDouble("amount");
            double kembali = amount - total;
    
            DecimalFormat decimalFormatter = new DecimalFormat("#,##0.00");
            NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("id", "ID"));
            currencyFormatter.setMaximumFractionDigits(0); // To remove decimal comma
            currencyFormatter.setMinimumFractionDigits(0);
            
            String formattedDpp = currencyFormatter.format(dpp);
            String formattedTarifPB1 = currencyFormatter.format(tarifPB1);
            String formattedTotal = currencyFormatter.format(total);
            String formattedAmount = currencyFormatter.format(amount);
            String formattedKembali = currencyFormatter.format(kembali);

           

            usbThermalPrinter.reset();
            usbThermalPrinter.setMonoSpace(true);
            usbThermalPrinter.setGray(7);
            usbThermalPrinter.setAlgin(UsbThermalPrinter.ALGIN_MIDDLE);
            // Bitmap bitmap1= BitmapFactory.decodeResource(ActivityPrinter.this.getResources(),R.mipmap.telpoe);
            // Bitmap bitmap2 = ThumbnailUtils.extractThumbnail(bitmap1, 244, 116);
            // usbThermalPrinter.printLogo(bitmap2,true);
            usbThermalPrinter.setTextSize(30);
            usbThermalPrinter.addString(outletName+"\n");
            usbThermalPrinter.setAlgin(UsbThermalPrinter.ALGIN_LEFT);
            usbThermalPrinter.setTextSize(24);

            int i = usbThermalPrinter.measureText(formattedDate + formattedTime);
            int i1 = usbThermalPrinter.measureText(" ");
            int SpaceNumber=(384-i)/i1;
            String spaceString = "";
            for (int j=0;j<SpaceNumber;j++){
                spaceString+=" ";
            }
            usbThermalPrinter.addString(formattedDate + spaceString +formattedTime);

             i = usbThermalPrinter.measureText("TABLE:" + tableName);
             i1 = usbThermalPrinter.measureText(" ");
             SpaceNumber=(384-i)/i1;
             spaceString = "";
            for (int j=0;j<SpaceNumber;j++){
                spaceString+=" ";
            }

            usbThermalPrinter.addString("TABLE:"+spaceString+ tableName);

            i = usbThermalPrinter.measureText("NO INV:" + invoiceId);
            i1 = usbThermalPrinter.measureText(" ");
            SpaceNumber=(384-i)/i1;
            spaceString = "";
            for (int j=0;j<SpaceNumber;j++){
                spaceString+=" ";
            }
            usbThermalPrinter.addString("NO INV:" + spaceString +invoiceId);

            usbThermalPrinter.addString("--------------------------------");
            usbThermalPrinter.addString("No  Product             Qty   Price    Total");
            usbThermalPrinter.addString("--------------------------------");

            ReadableArray cartItems = data.getArray("cartItem");
            if (cartItems != null) {
                for (int k = 0; k < cartItems.size(); k++) {
                    ReadableMap cartItem = cartItems.getMap(k);
                    
                    // String productName = cartItem.getString("productName");

                    String productName = cartItem.getString("productName");
                    if (productName == null || productName.isEmpty() || productName.equals("N/A")) {
                        productName = "N/A";
                    }

                    // Object productQtyValue = cartItem.getString("productQty");
                    // int productQty = parseProductQty(productQtyValue);

                    Object productQtyValue = cartItem.getString("productQty");
                    int productQty = 0; // Default value
                    if (productQtyValue instanceof Number) {
                        productQty = ((Number) productQtyValue).intValue();
                    } else if (productQtyValue instanceof String) {
                        try {
                            productQty = Integer.parseInt((String) productQtyValue);
                        } catch (NumberFormatException e) {
                            e.printStackTrace();
                        }
                    }


                    // int productQty = cartItem.getInt("productQty");
                    //double productPrice = Double.parseDouble(cartItem.getString("productPrice")); // Convert to double

                    String productPriceString = cartItem.getString("productPrice");
                    double productPrice;

                    if (productPriceString != null) {
                        if (productPriceString.contains(".")) {
                            // The value contains a decimal point, so it's a string representation of a double
                            productPrice = Double.parseDouble(productPriceString);
                        } else {
                            // The value does not contain a decimal point, so it's a string representation of an integer
                            productPrice = Integer.parseInt(productPriceString);
                        }
                    } else {
                        // Default value if productPrice is not available
                        productPrice = 0.0;
                    }
                    
                    
                    
                    // Calculate the total price for the item
                    double totalPrice = productQty * productPrice;
                    String formattedTotalPrice = currencyFormatter.format(totalPrice);
                    String formattedPrice = currencyFormatter.format(productPrice);

                    // Add the data to the printer
                    // Format the row according to your needs
                    String row = String.format("%-4d %-20s %-5d %-8s %s",
                                            k + 1, productName, productQty, formattedPrice, formattedTotalPrice);
                    usbThermalPrinter.addString(row);
                }
            }


            usbThermalPrinter.addString("--------------------------------");

            i = usbThermalPrinter.measureText("DPP:" + formattedDpp);
            i1 = usbThermalPrinter.measureText(" ");
            SpaceNumber=(384-i)/i1;
            spaceString = "";
            for (int j=0;j<SpaceNumber;j++){
                spaceString+=" ";
            }
            usbThermalPrinter.addString("DPP:" + spaceString +formattedDpp);

            i = usbThermalPrinter.measureText("PB1:" + formattedTarifPB1);
            i1 = usbThermalPrinter.measureText(" ");
            SpaceNumber=(384-i)/i1;
            spaceString = "";
            for (int j=0;j<SpaceNumber;j++){
                spaceString+=" ";
            }
            usbThermalPrinter.addString("PB1:" + spaceString +formattedTarifPB1);

            i = usbThermalPrinter.measureText("Total:" + formattedTotal);
            i1 = usbThermalPrinter.measureText(" ");
            SpaceNumber=(384-i)/i1;
            spaceString = "";
            for (int j=0;j<SpaceNumber;j++){
                spaceString+=" ";
            }
            usbThermalPrinter.addString("Total:" + spaceString +formattedTotal);

            i = usbThermalPrinter.measureText(metode+":" + formattedAmount);
            i1 = usbThermalPrinter.measureText(" ");
            SpaceNumber=(384-i)/i1;
            spaceString = "";
            for (int j=0;j<SpaceNumber;j++){
                spaceString+=" ";
            }
            usbThermalPrinter.addString(metode+":" + spaceString +formattedAmount);

            i = usbThermalPrinter.measureText("Kembali:" + formattedKembali);
            i1 = usbThermalPrinter.measureText(" ");
            SpaceNumber=(384-i)/i1;
            spaceString = "";
            for (int j=0;j<SpaceNumber;j++){
                spaceString+=" ";
            }
            usbThermalPrinter.addString("Kembali:" + spaceString +formattedKembali);

            i = usbThermalPrinter.measureText("Kasir:" + kasir);
            i1 = usbThermalPrinter.measureText(" ");
            SpaceNumber=(384-i)/i1;
            spaceString = "";
            for (int j=0;j<SpaceNumber;j++){
                spaceString+=" ";
            }
            usbThermalPrinter.addString("Kasir:" + spaceString +kasir);

            usbThermalPrinter.printString();
            usbThermalPrinter.walkPaper(10);
        } catch (Exception e) {
            Log.d("printData", e.getMessage());
            e.printStackTrace();
            Result = e.toString();
            if (Result.equals("com.telpo.tps550.api.printer.NoPaperException")) {
                // handler.sendMessage(handler.obtainMessage(NOPAPER, 1, 0, null));
            } else if (Result.equals("com.telpo.tps550.api.printer.OverHeatException")) {
                // handler.sendMessage(handler.obtainMessage(OVERHEAT, 1, 0, null));
            }

        }
    }

}