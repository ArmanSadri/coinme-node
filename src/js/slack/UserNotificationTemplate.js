import NotificationTemplate from '~/slack/NotificationTemplate';

class UserNotificationTemplate extends NotificationTemplate {

    applyTemplate(builder, user) {
        let id = user.id;
        let firstName = user.firstName;
        let lastName = user.lastName;
        let address = user.address;

        builder
            .attachment()
            .title(`User - ${id}`)
            .field()
            .addKeyValuePair('id', 'asdf')
            .addKeyValuePair('name', `${firstName} ${lastName}`)
            .addKeyValuePair('address', `${address}`)
        ;
    }
}

export default UserNotificationTemplate;