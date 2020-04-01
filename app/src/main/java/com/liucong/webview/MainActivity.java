package com.liucong.webview;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends Activity {

    private static String TAG = "liucong";
    private WebView webview;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webview = findViewById(R.id.webview);
        webview.getSettings().setJavaScriptEnabled(true);
        webview.clearCache(true);
        webview.getSettings().setAppCacheEnabled(false);
        webview.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
        //WebviewSettingProxy.setProxyKKPlus(webview, "10.250.210.152", 8888, "android.app.Application");
        //WebviewSettingProxy.setProxyKKPlus(webview, "192.168.1.102", 8888, "android.app.Application");
        webview.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // TODO Auto-generated method stub
                Log.d(TAG, "shouldOverrideUrlLoading: " + url);
                //view.loadUrl(url);
                return false;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                //Log.e("url", "url=" + url);
                //for bh3
                if (false && url.equals("https://bh3.mihoyo.com/gl/_nuxt/71aed5e15513f19b272c.js")) {//not hang
                    try {
                        Log.d(TAG, "shouldInterceptRequest: replace " + url);
                        return new WebResourceResponse("text/javascript", "utf-8", getBaseContext().getAssets().open("71aed5e15513f19b272c_es5.js"));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } else if (false && url.equals("https://bh3.mihoyo.com/gl/_nuxt/a2db2248c04b3971067d.js")) {//for more strategy
                    try {
                        Log.d(TAG, "shouldInterceptRequest: replace " + url);
                        return new WebResourceResponse("application/x-javascript", "utf-8", getBaseContext().getAssets().open("e2bb04626ca3a86c319023f7210ea4b3_81f4d4cb849c62739c7d6a1fe47cd49e"));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                // for mumu browser home page
                else if (false && url.equals("https://yixiu.game.163.com/F4D89668CAB384A1/js/app/index.js")) {
                    try {
                        Log.d(TAG, "shouldInterceptRequest: replace " + url);
                        return new WebResourceResponse("text/javascript", "utf-8", getBaseContext().getAssets().open("F4D89668CAB384A1_js_app_index_es5.js"));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                // for mhxy3d
                else if (false && url.equals("https://xy3d.res.netease.com/pc/zt/20190923143020/js/common/common_d4e8b6d.js")) {
                    try {
                        Log.d(TAG, "shouldInterceptRequest: replace " + url);
                        return new WebResourceResponse("text/javascript", "utf-8", getBaseContext().getAssets().open("e890b7ebd20e999f410953b7c6be45a2_d4e8b6d6e3ac51c710135a629831281d"));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } else if (url.equals("https://xy3d.res.netease.com/pc/zt/20190923143020/css/index_84c564f.css")) {
                    try {
                        Log.d(TAG, "shouldInterceptRequest: replace " + url);
                        return new WebResourceResponse("text/css", "utf-8", getBaseContext().getAssets().open("9674f2c09bff2f6f6a52369ab7b33410_84c564f661513dc3915b15317c46fe01"));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }else if (url.equals("https://xy3d.res.netease.com/pc/zt/20190923143020/pkg/mobilenew_86caa75.js")) {
                    try {
                        Log.d(TAG, "shouldInterceptRequest: replace " + url);
                        return new WebResourceResponse("text/javascript", "utf-8", getBaseContext().getAssets().open("mobilenew_86caa75.js"));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                /*
                if(url.contains("new_file.js")){//加载指定.js时 引导服务端加载本地Assets/www文件夹下的cordova.js
                    try {
                        return new WebResourceResponse("application/x-javascript","utf-8",getBaseContext().getAssets().open("js/new_file.js"));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                else if (url.contains("style.css")){
                    try {
                        return new WebResourceResponse("text/css","utf-8",getBaseContext().getAssets().open("css/style.css"));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }*/
                return super.shouldInterceptRequest(view, url);

            }
        });
    }

    public void button(View view) {
        Log.d(TAG, "button: start load....");
        //webview.loadUrl("file:////android_asset/index.html");
        //webview.loadUrl("https://www.baidu.com/");
        //webview.loadUrl("https://bh3.mihoyo.com/gl/character/detail/70?fullscreen=1&sign_type=2&authkey_ver=1&auth_appid=gl0429&authkey=A%2Fu%2FqMzOo25h4uxjT6HNUucRJoBB4j61HQ7EhExwRvL8bASgS3iC9JePgF0nKcQbzFbG899qJ99d%2F5z9s1H%2BO3tYaxC0fYrk1ZsRu0yV8xONrsxwnAg2JpRph5oIVcZJIpAoTMh1ku2GcNQnJzs4gjW7GeTcMyg2B9YI%2FKDObNYzXwHUTJAoD0QDYRzQXz3b3wIH5k3SqRIDatIMrMWsnsa625Ox1D1he5CM2jjaPbP5Qfj9Q3OwantlwnN6E2WiEvufiAmWPPSEIeS2nvqU7SwShqAUrnhYqt4nAyBwY%2Bpl0pLJrcmQDs8duWhPMZePSCMvBcoDuamhPsnpLRj7LynL11qhDqqcnJE%2FbKI%2B1JM7Ko6vCpbmu5axENJQEm2Cr7kPx%2BluiFucVwvWEwA5IdssKiAztTTAWzNllH3QVm13XmZ1dwgnB1E0sAGCEaeEObO7G5CjAU3Zh6QuUsJ10sfXkTP2focqJN5KIB4ZMrvH3os51sDhpZ2dMxRNH0e7mV%2F128f2dOXenfNJrQnsRuQQFenGVblzyqQLkxn4Axd%2Bo7ujjdQNEEwBmAwWeuONoQvyBA1m2OqeW3RJvtW%2BrKX9V3iORbMwvPNternWBJr0IoBiL3MQhDHIrXYIdb%2BczmjFKIobKQPBZEcGYgiUK2kD8AbWX3VMNQG21bjtsGs%3D&lang=zh-CN");
        //webview.loadUrl("http://mumu.163.com/mhome.html");
        //webview.loadUrl("https://xy3d.163.com/client/?platform=andnie&channel=&url=//xy3d.163.com/client/update_android/20200325/32081_871189.html");
        webview.loadUrl("https://xy3d.163.com/client/mobile/new.html?platform=andnie");
        Log.d(TAG, "button: end load....");
    }
}
