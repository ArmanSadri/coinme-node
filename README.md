# coinme-slack  [![npm version](https://badge.fury.io/js/coinme-slack.svg)](https://badge.fury.io/js/coinme-slack) [![Travis Build Status](https://travis-ci.org/coinme/coinme-node.svg?branch=master)](https://travis-ci.org/coinme/coinme-node)

* https://esdoc.org/config.html#full-config
* https://api.slack.com/incoming-webhooks
* https://api.slack.com/docs/attachments
* https://github.com/request/request
* https://www.npmjs.com/package/request-promise
* https://quickleft.com/blog/creating-and-publishing-a-node-js-module/
* https://github.com/yeoman/generator-node
* https://github.com/sohamkamani/generator-nm-es6#readme
* https://docs.npmjs.com/cli/link
* http://jamesknelson.com/the-complete-guide-to-es6-with-babel-6/
* https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.viewc4c8f
* https://github.com/corybill/Preconditions
* http://www.2ality.com/2015/02/es6-classes-final.html
* https://babeljs.io/docs/learn-es2015/
* http://www.2ality.com/2015/07/es6-module-exports.html
* http://www.2ality.com/2015/12/babel6-helpersstandard-library.html

## If you don't want to use anything fancy

```javascript

var builder = new NotificationBuilder({
    url: 'https://hooks.slack.com/services/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',
    
    payload: {
        'username': 'Say my name again, mother fucker',
        'text': 'this is text',
        'attachments': [{
            'fallback': 'ReferenceError - UI is not defined: https://honeybadger.io/path/to/event/',
            'text': '<https://honeybadger.io/path/to/event/|ReferenceError> - UI is not defined',
            'fields': [{
                'title': 'Project',
                'value': 'Awesome Project',
                'short': true
            }, {
                'title': 'Environment',
                'value': 'production',
                'short': true
            }],
            'color': '#F35A00'
        }]
    }
});
```

## If you want to be a bit fancy

```javascript

var builder = new NotificationBuilder({
    url: 'https://hooks.slack.com/services/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'
});

{
    var attachment = builder.attachment()
            .text('This is validated text, it will throw an Error if not a string')
            .color('red');
            
    {
        // Your first field
        attachment.field()
            .title('Project')
            .value('Awesome Project')
            .short()
            
        // Your second field
        attachment.field()
            .title('Project')
            .value('Awesome Project')
            .short()
    }
}

```

## NotificationService

```javascript

/**
 * 
 * @param {String} eventName
 * @param {NotificationTemplate|Object} template
 */
NotificationService.register('EVENT_NAME', {

    /**
     * The name of the template. Useful for debugging.
     *
     * @type {String} 
     * @required
     */
    name: 'InlineTemplate', 

    /**
     * @type {Object}
     * @optional
     */
    payload: {
        username: 'InlineTemplate'
    }
});

/**
 * @param {String} eventName 
 * @param {Object|undefined} data
 * @return undefined
 */
NotificationService.notify('EVENT_NAME', {
    text: 'text'
});
```

## Install

```
$ npm install --save coinme-slack
```

## License

MIT © [msmyers](https://github.com/msmyers)

---

## CoinmeWalletClient requires signatures

### How to make your certificates

For more information, check out [https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2]

#### Define the server certificate (We are our own Certificate Authority)

You would use this certificate inside *coinme-wallet*

```

wget https://raw.githubusercontent.com/anders94/https-authorized-clients/master/keys/ca.cnf

openssl req -new -x509 -days 9999 -config ca.cnf -keyout ca-key.pem -out ca-crt.pem

openssl genrsa -out server-key.pem 4096

wget https://raw.githubusercontent.com/anders94/https-authorized-clients/master/keys/server.cnf

openssl req -new -config server.cnf -key server-key.pem -out server-csr.pem

openssl x509 -req -extfile server.cnf -days 999 -passin "pass:password" -in server-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out server-crt.pem

```

#### Define the client certificate (signed by our Certificate Authority) 

You would use this certificate inside *coinme-node*

```
openssl genrsa -out client1-key.pem 4096

wget https://raw.githubusercontent.com/anders94/https-authorized-clients/master/keys/client1.cnf

openssl req -new -config client1.cnf -key client1-key.pem -out client1-csr.pem

openssl x509 -req -extfile client1.cnf -days 999 -passin "pass:password" -in client1-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out client1-crt.pem


```