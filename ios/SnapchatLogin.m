#import "SnapchatLogin.h"
#import <SCSDKLoginKit/SCSDKLoginKit.h>

@implementation SnapchatLogin

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(login, loginResolver
                 : (RCTPromiseResolveBlock)resolve rejecter
                 : (RCTPromiseRejectBlock)reject) {
  UIViewController *rootViewController =
  [UIApplication sharedApplication].delegate.window.rootViewController;
  
  [SCSDKLoginClient
   loginFromViewController:rootViewController
   completion:^(BOOL success, NSError *_Nullable error) {
    if (error) {
      resolve(@{
        @"result" : @(NO),
        @"error" : error.localizedDescription
              });
    } else {
      resolve(@{@"result" : @(YES)});
    }
  }];
}

RCT_REMAP_METHOD(isUserLoggedIn, isUserLoggedInResolver
                 : (RCTPromiseResolveBlock)resolve rejecter
                 : (RCTPromiseRejectBlock)reject) {
  
  resolve(@{@"result" : @([SCSDKLoginClient isUserLoggedIn])});
}

RCT_REMAP_METHOD(logout, logoutResolver
                 : (RCTPromiseResolveBlock)resolve rejecter
                 : (RCTPromiseRejectBlock)reject) {
  [SCSDKLoginClient clearToken];
  resolve(@{@"result" : @YES});
}

RCT_REMAP_METHOD(fetchUserData, fetchUserDataResolver
                 : (RCTPromiseResolveBlock)resolve rejecter
                 : (RCTPromiseRejectBlock)reject) {
  if ([SCSDKLoginClient isUserLoggedIn]) {
    NSString *graphQLQuery = @"{me{displayName, bitmoji{avatar}}}";
    NSDictionary *variables = @{@"page" : @"bitmoji"};
    
    [SCSDKLoginClient fetchUserDataWithQuery:graphQLQuery
                                   variables:variables
                                     success:^(NSDictionary *resources) {
      NSDictionary *data = resources[@"data"];
      NSDictionary *me = data[@"me"];
      NSString *displayName = me[@"displayName"];
      NSDictionary *bitmoji = me[@"bitmoji"];
      NSString *bitmojiAvatarUrl = bitmoji[@"avatar"];
      if (bitmojiAvatarUrl == (id)[NSNull null] ||
          bitmojiAvatarUrl.length == 0)
        bitmojiAvatarUrl = @"null";
      
      resolve(
              @{@"displayName" : displayName, @"bitmoji" : bitmojiAvatarUrl});
    }
                                     failure:^(NSError *error, BOOL isUserLoggedOut) {
      reject(@"error", @"error", error);
    }];
  } else {
    resolve([NSNull null]);
  }
}

RCT_REMAP_METHOD(getExternalId, getExternalIdResolver
                 : (RCTPromiseResolveBlock)resolve rejecter
                 : (RCTPromiseRejectBlock)reject) {
  NSString *graphQLQuery = @"{me{externalId}}";
  
  [SCSDKLoginClient fetchUserDataWithQuery:graphQLQuery
                                 variables:nil
                                   success:^(NSDictionary *resources) {
    NSDictionary *data = resources[@"data"];
    NSDictionary *me = data[@"me"];
    NSString *externalId = me[@"externalId"];
    
    resolve(@{@"externalId" : externalId});
  }
                                   failure:^(NSError *error, BOOL isUserLoggedOut) {
    reject(@"error", @"error", error);
  }];
}

RCT_REMAP_METHOD(getAccessToken, resolver
                 : (RCTPromiseResolveBlock)resolve rejecter
                 : (RCTPromiseRejectBlock)reject) {
  [SCSDKLoginClient refreshAccessTokenWithCompletion:^(NSString * _Nullable accessToken,
                                                       NSError * _Nullable error) {
    if (accessToken) {
      resolve(@{@"accessToken" : accessToken});
    } else {
      resolve(@{@"accessToken" : [NSNull null], @"error" : error});
    }
  }];
}

@end
