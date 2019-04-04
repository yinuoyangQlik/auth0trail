

                    document.addEventListener('DOMContentLoaded', function () {
                    
                        let queryParams = (new URL(document.location)).searchParams;
                        let action = queryParams.get('action');
    
    
                        switch (action) {
                            case 'signup':
                            console.log(action);
                            allowSignUp = true;
                            allowLogin = false;
                            allowForgotPassword = false;
                            handleSignUp (configAuth0);
                            break;
                            
                            default:
                            allowSignUp = false;
                            allowLogin = true;
                            allowForgotPassword = false;
                            //loginElements.forEach ( (ele) => ele.classList.remove ('hidden') )
                            //signupElements.forEach ( (ele) => ele.classList.add ('hidden') )
                            //configAuth0 ();
                        }
                        })
    
                        handleSignUp = (cb) => {
    
                                let accessToken = parseParms (document.location.hash).access_token;
                                var data = null;
    
                                var xhr = new XMLHttpRequest();
                                xhr.withCredentials = true;
    
                                xhr.addEventListener("readystatechange", function () {
                                    if (this.readyState === 4) {
                                    try {
                                        email = JSON.parse(this.responseText).email;
                                    } catch (e) {}
                                    if (cb) cb ();
                                    }
                                });
    
                            xhr.open("GET", `${location.protocol}//${location.host}/userinfo`);
                            xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
                            xhr.setRequestHeader("Cache-Control", "no-cache");
    
                            xhr.send();
    
                            
                        }
    
                        configAuth0 = () => {
                            // Decode utf8 characters properly
                            var config = JSON.parse(decodeURIComponent(escape(window.atob('@@config@@'))));
                            config.extraParams = config.extraParams || {};
                            var connection = config.connection;
                            var prompt = config.prompt;
                            var languageDictionary;
                            var language;
    
                            if (config.dict && config.dict.signin && config.dict.signin.title) {
                            languageDictionary = { title: config.dict.signin.title };
                            }
                            language = getLocale ();
                            var loginHint = config.extraParams.login_hint;
                            var colors = config.colors || {};
    
                            // Available Lock configuration options: https://auth0.com/docs/libraries/lock/v11/configuration
                            var lock = new Auth0Lock(config.clientID, config.auth0Domain, {
                            auth: {
                                redirectUrl: config.callbackURL,
                                responseType: (config.internalOptions || {}).response_type ||
                                (config.callbackOnLocationHash ? 'token' : 'code'),
                                params: config.internalOptions
                            },
                            additionalSignUpFields: [{
                                name: "confirmPassword",
                                placeholder: "Confirm Password",
                                type: "password",
                                
                                // The following properties are optional
                                validator: function( confirmPassword ) { 
                                    var password = "";
                                    if(document.getElementsByClassName('auth0-lock-input')[0]){
                                        password = document.getElementsByClassName('auth0-lock-input')[0].value
                                    }
                                    
                                    
                                    return confirmPassword;
                                                    
                                }
                            
                            }],
                            /* additional configuration needed for custom domains
                            configurationBaseUrl: config.clientConfigurationBaseUrl,
                            overrides: {
                                __tenant: config.auth0Tenant,
                                __token_issuer: 'YOUR_CUSTOM_DOMAIN'
                            }, */
                            assetsUrl:  config.assetsUrl,
                            allowedConnections: connection ? [connection] : null,
                            rememberLastLogin: !prompt,
                            language: language,
                            languageDictionary: languageDictionary,
                            theme: {
                                //logo:            'YOUR LOGO HERE',
                                primaryColor:    colors.primary ? colors.primary : 'green'
                            },
                            prefill: email ? { email: email } : (loginHint ? { email: loginHint, username: loginHint } : null),
                            closable: false,
                            defaultADUsernameFromEmailPrefix: false,
                            // uncomment if you want small buttons for social providers
                            // socialButtonStyle: 'small'
                            container: 'lock-container',
                            allowSignUp: allowSignUp,
                            allowForgotPassword: allowForgotPassword,
                            allowLogin: allowLogin,
                            initialScreen: initialScreen ? initialScreen : 'signUp',
                            
                        });
    
                            if(colors.page_background) {
                            var css = '.auth0-lock.auth0-lock .auth0-lock-overlay { background: ' +
                                        colors.page_background +
                                        ' } .auth0-lock.auth0-lock .auth0-lock-content { padding: 20px 0px 20px 0px }';
                            var style = document.createElement('style');
    
                            style.appendChild(document.createTextNode(css));
    
                            document.body.appendChild(style);
                            }
    
                            lock.show();
                            
                            document.querySelector ('.auth0-lock-header').classList.add ('hidden')
                        
                    }
    
                    getLocale = () => {
                        
                        var supportedLang = 'en,sv,de,es,fr,it,ja,nl,pt,ru,zh,ko,pl,tr,zh-tw,pt-br';
                        var lang = (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
    
                        if(lang != null && lang != 'undefined' && lang != undefined ) {
                            lang = lang.match(/[a-zA-z\-]{2,10}/g) || [];
    
                            for(var i=0; i<lang.length; i++) {
                                if(lang[i].length > 2) {
                                    if(supportedLang.indexOf(lang[i].substring(0,5).toLowerCase()) > -1) {
                                        return lang[i].substring(0,5).toLowerCase();
                                        break;
                                    } else if(lang[i].substring(0,2).toLowerCase() == 'zh'){
                                        return getChineseLocale(lang[i].toLowerCase());
                                        break;
                                    }
                                }
                                if(supportedLang.indexOf(lang[i].substring(0,2).toLowerCase()) > -1) {
                                    return lang[i].substring(0,2).toLowerCase ();
                                    break;
                                } else{
                                    return 'en';
                                    break;
                                }
                            }
                        } else {
                            return 'en';
                        }
    
                    }
    
                    parseParms = (str) => {
                        str = str.replace(/^#?\/?/, '');
                        var pieces = str.split("&"), data = {}, i, parts;
                        // process each query pair
                        for (i = 0; i < pieces.length; i++) {
                            parts = pieces[i].split("=");
                            if (parts.length < 2) {
                                parts.push("");
                            }
                            data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
                        }
                        return data;
                    }
    
                
    
                