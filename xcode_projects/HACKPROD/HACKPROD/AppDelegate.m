//
//  AppDelegate.m
//  HACKPROD
//
//  Created by HACKNAME.
//  Copyright (c) 2013 HACKORG. All rights reserved.
//

#import "AppDelegate.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Override point for customization after application launch.
    
    [Parse setApplicationId:@"HACKAPPID" clientKey:@"HACKKEY"];
    [PFAnalytics trackAppOpenedWithLaunchOptions:launchOptions];
    
    [PFFacebookUtils initializeFacebook];
    
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

- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
    return [PFFacebookUtils handleOpenURL:url];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    return [PFFacebookUtils handleOpenURL:url];
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
