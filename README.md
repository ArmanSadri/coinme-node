# coinme-slack  [![npm version](https://badge.fury.io/js/coinme-slack.svg)](https://badge.fury.io/js/coinme-slack)

https://api.slack.com/incoming-webhooks
https://api.slack.com/docs/attachments
https://github.com/request/request
https://www.npmjs.com/package/request-promise
https://quickleft.com/blog/creating-and-publishing-a-node-js-module/


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

## Install

```
$ npm install --save coinme-slack
```

## License

MIT © [msmyers](https://github.com/msmyers)
