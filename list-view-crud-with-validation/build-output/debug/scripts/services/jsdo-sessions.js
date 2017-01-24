(function(angular) {

    angular
        .module('list-view-crud-with-validation')
        .service('jsdoSessions', ['$q', '$http', function($q, $http) {

            function SessionProvider() {
                this.sessions = {};
                this.dataProviders = null;
            }

            SessionProvider.prototype = {
                _getProviders: function() {
                    return $q(function(resolve, reject) {
                        if (this.dataProviders) {
                            resolve(this.dataProviders);
                        } else {
                            $http.get('data-providers.json')
                               .then(function(res) {
                                   this.dataProviders = res.data;
                                   resolve(this.dataProviders);
                               }.bind(this), function(res) {
                                   reject({ message: res.data });
                               });
                        }
                    }.bind(this));
                },

                getProvider: function(providerName) {
                    return this._getProviders().then(function(providers) { return providers[providerName]; });
                },

                getSession: function(provider, credentials) {
                    return $q(function(resolve, reject) {
                        progress.data.getSession({
                            name: provider.name,
                            authenticationModel: provider.authenticationModel,
                            serviceURI: provider.serviceURI,
                            catalogURI: provider.catalogUris,
                            username: credentials ? credentials.username : '',
                            password: credentials ? credentials.password : ''
                        })
                       .done(function(jsdosession) {
                           resolve(jsdosession);
                       })
                       .fail(function(result, details) {
                            var message = 'General Error';

                            function tryGetMessage(errorObject) {
                                if (errorObject) {
                                    message = errorObject.message;
                                }
                            }

                            switch (result) {
                                case progress.data.Session.AUTHENTICATION_FAILURE:
                                   message = 'Wrong Username or Password';
                                   break;
                               case progress.data.Session.GENERAL_FAILURE:
                                    if (details instanceof Array) {
                                        tryGetMessage(details[0].errorObject);
                                    } else {
                                        tryGetMessage(details.errorObject);
                                    }
                                    break
                            }

                            reject({ message: message });
                       });
                    });
                },

                login: function(provider, credentials) {
                    var sessionCreated = function(session) {
                        return this.sessions[provider.name] = session;
                    }.bind(this);

                    return this.getSession(provider, credentials).then(sessionCreated);
                },

                logout: function() {
                    return $q(function(resolve, reject) {
                        var promises = [];

                        var wrapInResolvedPromise = function(promise) {
                            return $q(function(resolve, reject) {
                                promise.then(function() { resolve(); }).fail(function(err) { resolve(err); });
                            });
                        }

                        for (var key in this.sessions) {
                            var session = this.sessions[key];

                            if (session.loginResult === 1) {
                                promises.push(wrapInResolvedPromise(session.logout()));
                            }
                        }

                        $q.all(promises).then(function(errors) {
                            this.sessions = {};
                            progress.data.ServicesManager._services = [];
                            progress.data.ServicesManager._resources = [];
                            progress.data.ServicesManager._data = [];
                            progress.data.ServicesManager._sessions = [];

                            resolve();
                        }.bind(this));
                    }.bind(this));
                }
            };

            return new SessionProvider();
        }]);

})(angular);
