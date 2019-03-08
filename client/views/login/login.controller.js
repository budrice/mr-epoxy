(function () {

    'use strict';

    angular.module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', 'AppService', 'msgbox', '$location', '$window'];
    function LoginController($scope, AppService, msgbox, $location, $window) {

        $scope.model = {};
        $scope.login_obj = {};
        $scope.login_obj = loginStageOne();
        let member = {}; // object to save input values

        $scope.getProcess = () => {
            
            let process = $scope.login_obj.process;
            let inValid = /\s/;
            let value = $scope.model.input;
            let k = inValid.test(value);

            if ($scope.login_form.input.$valid && !k) {
                if (process == 'login') {
                    login();
                }
                else {
                    register();
                }
            }
            else {
                $scope.login_obj.message = 'error: INCORRECT FORMAT for ' + $scope.login_obj.input.name + '.';
            }

        };

        function login() {
            let stage = $scope.login_obj.stage;
            let username = $scope.model.input;
            if (stage === 1) {
                userSearch('username', username).then((result) => {
                    if (result.data.length > 0) {
                        if(result.data[0].verify === 0) {
                            $scope.model.username = username;
                            setTimeout(() => {
                                $scope.login_obj.message = 'Please verify your email address by responding to the link sent to your email.';
                                $scope.$apply();
                            }, 0);
                        }
                        else {
                            $scope.model.username = username;
                            member.username = username;
                            member.id = result.data[0].id;
                            setTimeout(() => {
                                $scope.login_obj = loginStageTwo();
                                $scope.model.input = undefined;
                                $scope.$apply();
                            }, 0);
                        }

                    }
                    else {
                        setTimeout(() => {
                            $scope.login_obj.message = 'Username not found, switching to registration process.';
                            $scope.$apply();
                        }, 0);
                        setTimeout(() => {
                            $scope.login_obj = registerStageOne();
                            $scope.model.input = undefined;
                            $scope.$apply();
                        }, 3200);
                    }
                }, (error) => {
                    console.log(error);
                });
            }
            else {
                member.password = $scope.model.input;
                AppService.Login(member).then((result) => {
                    if (result.data) {
                        if (result.data.error) {
                            msgbox.warning(result.data.error.message);
                        }
                        else {
                            $location.path('/home/');
                        }
                        $scope.$apply();
                    }
                }, (error) => {
                    console.log(error);
                });
            }
        }

        function register() {
            let stage = $scope.login_obj.stage;
            if (stage === 1) {
                userSearch('email', $scope.model.input).then((result) => {
                    if (result.data.length > 0) {
                        
                        setTimeout(() => {
                            $scope.login_obj.message = "Email address already attached to a username. Try logging in with username.";
                            $scope.$apply();
                        }, 0);
                        setTimeout(() => {
                            $scope.login_obj = loginStageOne();
                            $scope.model.input = undefined;
                            $scope.$apply();
                        }, 3500);
                    }
                    else {
                        setTimeout(() => {
                            member.email = $scope.model.input;
                            $scope.model.input = undefined;
                            $scope.login_obj = registerStageTwo();
                            $scope.$apply();
                        }, 0);
                        
                    }
                }, (error) => {
                    console.log(error);
                });
            }
            else if (stage === 2) {
                userSearch('username', $scope.model.input).then((result) => {
                    if (result.data.length > 0) {
                        setTimeout(() => {
                            $scope.login_obj.message = "Username already attached to an email address. Select a different username.";
                            $scope.$apply();
                        }, 0);
                        setTimeout(() => {
                            $scope.login_obj = registerStageTwo();;
                            $scope.model.input = undefined;
                            $scope.$apply();
                        }, 3500);
                    }
                    else {
                        setTimeout(() => {
                            member.username = $scope.model.input;
                            $scope.model.username = $scope.model.input;// hidden for validation rule
                            $scope.login_obj = registerStageThree();
                            $scope.model.input = undefined;
                            $scope.$apply();
                        }, 0);
                        
                    }
                }, (error) => {
                    console.log(error);
                });
            }
            else if (stage === 3) {
                if ($scope.login_obj) {
                    setTimeout(() => {
                        member.password = $scope.model.input;
                        $scope.login_obj = registerStageFour();
                        $scope.model.input = undefined;
                        $scope.$apply();
                    }, 0);

                }
            }
            else if (stage === 4) {
                if ($scope.login_obj) {
                    member.password2 = $scope.model.input;
                }
                if (member.password == member.password2) {
                    AppService.Register(member).then(() => {
                        setTimeout(() => {
                            $scope.login_obj.message = "Registration succeeded.\nYou are able to log in.";
                            $scope.$apply();
                        }, 0);
                        setTimeout(() => {
                            $scope.login_obj = loginStageOne();
                            $scope.model.input = undefined;
                            $scope.$apply();
                        }, 3500);
                    }, (error) => {
                        setTimeout(() => {
                            $scope.login_obj.message = "Registration failed.\nYou are unable to log in.\nRefresh and try again.";
                            $scope.$apply();
                        }, 0);
                        setTimeout(() => {
                            $scope.login_obj = registerStageOne();
                            $scope.model.input = undefined;
                            $scope.$apply();
                        }, 3500);
                    });
                }
                else {
                    setTimeout(() => {
                        $scope.login_obj.message = "Passwords did not match. Try typing the passwords again.";
                        $scope.$apply();
                    }, 0);
                    setTimeout(() => {
                        $scope.login_obj = registerStageThree();;
                        $scope.model.input = undefined;
                        $scope.$apply();
                    }, 3500);
                }
            }
        }

        $scope.startRegistration = () => {
            setTimeout(() => {
                $scope.login_obj = registerStageOne();
                $scope.$apply();
            }, 0);
            
        };

        function userSearch(arg_key, arg_value) {
            return new Promise((resolve,reject) => {
                AppService.UserSearch(arg_key, arg_value).then((result) => {
                    resolve(result);
                }, (error) => {
                    reject(error);
                });
            });
        }

        function loginStageOne() {
            return {
                process: 'login',
                stage: 1,
                message: 'Enter your username or email address.',
                input: {
                    type: 'text',
                    name: 'username',
                    placeholder: 'username or email address',
                    autocomplete: 'username',
                    pattern: null,
                    show: true,
                    disabled: false
                },
                button: {
                    text: 'next',
                    show: true,
                    disabled: false
                },
                register: {
                    text: 'register',
                    show: true,
                    disabled: false
                },
                forgot: {
                    text: 'forgot login',
                    show: true,
                    disabled: false
                }
            };
        }
        function loginStageTwo() {
            return {
                process: 'login',
                stage: 2,
                message: 'Enter your password.',
                input: {
                    type: 'password',
                    name: 'password',
                    placeholder: 'password',
                    autocomplete: 'current-password',
                    show: true,
                    disabled: false
                },
                button: {
                    text: 'next',
                    show: true,
                    disabled: false
                },
                register: {
                    text: 'register',
                    show: false,
                    disabled: true
                },
                forgot: {
                    text: 'forgot login',
                    show: true,
                    disabled: false
                }
            };
        }

        function registerStageOne() {
            return {
                process: 'register',
                stage: 1,
                message: 'Register your email address.',
                input: {
                    type: 'email',
                    name: 'email',
                    placeholder: 'email',
                    autocomplete: '',
                    pattern: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
                    show: true,
                    disabled: false
                },
                button: {
                    text: 'next',
                    show: true,
                    disabled: false
                },
                register: {
                    text: 'register',
                    show: false,
                    disabled: true
                },
                forgot: {
                    text: 'forgot login',
                    show: false,
                    disabled: true,
                    class: 'vanish'
                }
            };
        }
        function registerStageTwo() {
            return {
                process: 'register',
                stage: 2,
                message: 'Enter a username.',
                input: {
                    type: 'text',
                    name: 'username',
                    placeholder: 'username',
                    autocomplete: 'username',
                    pattern: null,
                    show: true,
                    disabled: false
                },
                button: {
                    text: 'next',
                    show: true,
                    disabled: false
                },
                register: {
                    text: 'register',
                    show: false,
                    disabled: true
                },
                forgot: {
                    text: 'forgot login',
                    show: false,
                    disabled: true
                }
            };
        }
        function registerStageThree() {
            return {
                process: 'register',
                stage: 3,
                message: 'Enter a password.',
                input: {
                    type: 'password',
                    name: 'password',
                    placeholder: 'password',
                    autocomplete: 'new-password',
                    pattern: null,
                    show: true,
                    disabled: false
                },
                button: {
                    text: 'next',
                    show: true,
                    disabled: false
                },
                register: {
                    text: 'register',
                    show: false,
                    disabled: true
                },
                forgot: {
                    text: 'forgot login',
                    show: false,
                    disabled: true
                }
            };
        }
        function registerStageFour() {
            return {
                process: 'register',
                stage: 4,
                message: 'Enter the password again.',
                input: {
                    type: 'password',
                    name: 'password',
                    placeholder: 'password',
                    autocomplete: 'new-password',
                    pattern: null,
                    show: true,
                    disabled: false
                },
                button: {
                    text: 'enter',
                    show: true,
                    disabled: false
                },
                register: {
                    text: 'register',
                    show: false,
                    disabled: true
                },
                forgot: {
                    text: 'forgot login',
                    show: false,
                    disabled: true
                }
            };
        }

        $scope.forgot = () => {
            msgbox.warning('Contact Admin mrepoxyweb@gmail.com');
        }

        $('#app_dynamic_login_input').keypress((event) => {
            let process = $scope.login_obj.process;
            if (event.which === 13 && process == 'login') {
                login();
            }
            else if (event.which === 13 && process == 'register') {
                register();
            }
        });

    }
})();