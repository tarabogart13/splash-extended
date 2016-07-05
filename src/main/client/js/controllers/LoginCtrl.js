'use strict';

angular.module('logicline.controllers')
    .controller('LoginCtrl', [
        '$rootScope',
        '$scope',
        '$window',
        'localStorageService',
        'appAuthenticationService',
        'appAuthorizationService',
        function($rootScope, $scope, $window, localStorageService, appAuthenticationService, appAuthorizationService) {
            var captcha = {
                publicKey: '6LciewUTAAAAACjcP9xWUXYeuPi4REa6KpohnPMN',
                isStarted: false,
                lockPeriodMin: 15,
                totatlAttempt: 1,
                loginAttempt: 1,
                maxAttempt: 3,
                response: null,
                token: null
            };

            // Redirect to dashboard if user is authorized
            if (appAuthorizationService.isAuthorized()) {
                $scope.$state.go('dashboard');
                return;
            }

            // check if the user is locked
            if (localStorageService.get('locker') && isStillActive(localStorageService.get('locker'))) {
                $scope.isLocked = true;
                return;
            }

            if (localStorageService.get('captcha') && isStillActive(localStorageService.get('captcha'))) {
                captcha.totatlAttempt = 3;
                startTheCaptchaIfNeeded();
            }

            // clear storage
            localStorageService.remove('locker');
            localStorageService.remove('captcha');

            $scope.performLogin = function(isValid, credentials) {
                resetParams();

                if (isValid && captcha.loginAttempt > captcha.maxAttempt) {
                    localStorageService.add('locker', new Date().getTime());
                    $scope.isLocked = true;
                    return;
                }
                setCaptchaData();

                if (!isValid || (captcha.isStarted && !captcha.response)) {
                    $scope.isEmptyCredentials = true;
                    return;
                }
                startTheCaptchaIfNeeded();

                appAuthenticationService.login(getCredentials(credentials)).then(function(User) {
                    // reset existing flags
                    delete $scope.isLoginInvalid;
                    delete $scope.isLoginForbidden;
                    delete $scope.isInternalError;
                    delete $scope.isConfigInvalid;
                    
                    if (!User.isError) {
                        $rootScope.userIdFk = User.userId;
                        if (!User.isCSCUser) {
                            $scope.$state.go('dashboard');
                        } else {
                            $scope.$state.go('customer_search');
                        }
                        return;
                    } else {
                        switch (User.status) {
                            case 401:
                                $scope.isLoginInvalid = true;
                                processIncorrectAttempts();
                                break;
                            case 403:
                                $scope.isLoginForbidden = true;
                                processIncorrectAttempts();
                                break;
                            case 500:
                                $scope.isInternalError = true;
                                break;
                            case 503:
                                $scope.isConfigInvalid = true;
                                break;
                        }
                        resetCredentials(credentials);
                    }
                });
            };

            function resetParams() {
                $scope.isLoginInvalid = false;
                $scope.isEmptyCredentials = false;
                $scope.isLocked = false;
            };

            function resetCredentials(credentials) {
                credentials.password = null;
                credentials.recaptcha_challenge_field = null;
                credentials.recaptcha_response_field = null;
            };

            function setCaptchaData() {
                captcha.token = $window.Recaptcha.get_challenge();
                captcha.response = $window.Recaptcha.get_response();
            };

            function getCredentials(credentials) {
                if (captcha.response) {
                    credentials.recaptcha_challenge_field = captcha.token;
                    credentials.recaptcha_response_field = captcha.response;
                }
                return credentials;
            };

            function startTheCaptchaIfNeeded() {
                if (!captcha.isStarted && captcha.totatlAttempt === captcha.maxAttempt) {
                    $window.Recaptcha.create(captcha.publicKey, 'recaptcha_block', {
                        theme: 'light',
                        callback: function() {
                            captcha.isStarted = true;
                            localStorageService.add('captcha', new Date().getTime());
                        }
                    });
                }
            };

            function processIncorrectAttempts() {
                captcha.totatlAttempt++;

                if (captcha.isStarted) {
                    $window.Recaptcha.reload();
                    captcha.response = null;
                    captcha.loginAttempt++;

                    lockIfTheLoginBlocked();
                }
            };

            function lockIfTheLoginBlocked() {
                if (captcha.loginAttempt > captcha.maxAttempt) {
                    localStorageService.add('locker', new Date().getTime());
                    $scope.isLocked = true;
                    $window.Recaptcha.destroy();
                }
            };

            function isStillActive(data) {
                return parseInt(data, 10) + captcha.lockPeriodMin * 60 * 1000 > new Date().getTime();
            };
        }
    ]);
