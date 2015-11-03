// Ionic Starter App
 
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova'])
 
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
 
app.controller('NotificationController', function($scope, $cordovaLocalNotification, $cordovaPush, $cordovaToast, $ionicPlatform) {
     
    $ionicPlatform.ready(function () {
         
        $scope.scheduleSingleNotification = function () {
          $cordovaLocalNotification.schedule({
            id: 1,
            title: 'Warning',
            text: 'Youre so sexy!',
            data: {
              customProperty: 'custom value'
            }
          }).then(function (result) {
            console.log('Notification 1 triggered');
          });
        };
         
        $scope.scheduleDelayedNotification = function () {
          var now = new Date().getTime();
          var _10SecondsFromNow = new Date(now + 10 * 1000);
 
          $cordovaLocalNotification.schedule({
            id: 2,
            title: 'Warning',
            text: 'Im so late',
            at: _10SecondsFromNow
          }).then(function (result) {
            console.log('Notification 2 triggered');
          });
        };
 
        $scope.scheduleEveryMinuteNotification = function () {
          $cordovaLocalNotification.schedule({
            id: 3,
            title: 'Warning',
            text: 'Dont fall asleep',
            every: 'minute'
          }).then(function (result) {
            console.log('Notification 3 triggered');
          });
        };      
         
        $scope.updateSingleNotification = function () {
          $cordovaLocalNotification.update({
            id: 2,
            title: 'Warning Update',
            text: 'This is updated text!'
          }).then(function (result) {
            console.log('Notification 1 Updated');
          });
        };  
 
        $scope.cancelSingleNotification = function () {
          $cordovaLocalNotification.cancel(3).then(function (result) {
            console.log('Notification 3 Canceled');
          });
        };
		
		//test method for setting the ui
		$scope.setText = function (){
			alert("SetText");
			$scope.testText="this is a test";
		};
		
		//push notification
		
		$scope.register = function () {
			var config = null;

			if (ionic.Platform.isAndroid()) {
				config = {
					"senderID": "AIzaSyB2YEaWFr0vTYjhjCzx0Ns39hE9Is5Z7n8" // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/434205989073
				};
			}
			else if (ionic.Platform.isIOS()) {
				config = {
					"badge": "true",
					"sound": "true",
					"alert": "true"
				}
			}

			$cordovaPush.register(config).then(function (result) {
				console.log("Register success " + result);

				$cordovaToast.showShortCenter('Registered for push notifications');
				//$scope.registerDisabled=true;
				// ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
				if (ionic.Platform.isIOS()) {
					$scope.regId = result;
					storeDeviceToken("ios");
				}
			}, function (err) {
				console.log("Register error " + err)
			});
		};
		
		// Notification Received
		$scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
			console.log(JSON.stringify([notification]));
			if (ionic.Platform.isAndroid()) {
				handleAndroid(notification);
			}
			else if (ionic.Platform.isIOS()) {
				handleIOS(notification);
				$scope.$apply(function () {
					$scope.notifications.push(JSON.stringify(notification.alert));
				})
			}
		});		
		
		// Android Notification Received Handler
		function handleAndroid(notification) {
			// ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
			//             via the console fields as shown.
			console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);
			if (notification.event == "registered") {
				$scope.regId = notification.regid;
				//storeDeviceToken("android");
			}
			else if (notification.event == "message") {
				$cordovaDialogs.alert(notification.message, "Push Notification Received");
				$cordovaDialogs.alert(notification.message, JSON.stringify(notification));
			}
			else if (notification.event == "error")
				$cordovaDialogs.alert(notification.msg, "Push notification error event");
			else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
		};
		
    });
});
