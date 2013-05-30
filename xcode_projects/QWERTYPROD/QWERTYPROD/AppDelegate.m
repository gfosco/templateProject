//
//  AppDelegate.m
//  QWERTYPROD
//
//  Created by QWERTYNAME.
//  Copyright (c) 2013 QWERTYORG. All rights reserved.
//

#import "AppDelegate.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

    // Initialize the Parse Framework
    [Parse setApplicationId:@"QWERTYAPPID" clientKey:@"QWERTYKEY"];

    /* ENABLE_ANALYTICS
    [PFAnalytics trackAppOpenedWithLaunchOptions:launchOptions];
    ENABLE_ANALYTICS */

    /* ENABLE_PUSH
    // Register for push notifications
    [application registerForRemoteNotificationTypes:
        UIRemoteNotificationTypeBadge |
        UIRemoteNotificationTypeAlert |
        UIRemoteNotificationTypeSound];
    ENABLE_PUSH */
    
    /* ENABLE_TESTOBJ
    PFObject *testObj = [PFObject objectWithClassName:@"Test"];
    [testObj setObject:@"Hello there" forKey:@"Greetings"];
    [testObj saveInBackground];
    ENABLE_TESTOBJ */

    return YES;
}

/* ENABLE_PUSH
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    // Store the deviceToken in the current Installation and save it to Parse.
    PFInstallation *currentInstallation = [PFInstallation currentInstallation];
    [currentInstallation setDeviceTokenFromData:deviceToken];
    [currentInstallation saveInBackground];
}
 
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    [PFPush handlePush:userInfo];
}
ENABLE_PUSH */



@end
