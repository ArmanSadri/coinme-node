import NotificationTemplate from '~/slack/NotificationTemplate';
import Logger from 'winston';

class UserNotificationTemplate extends NotificationTemplate {

    /**
     *
     * @param {NotificationBuilder} builder
     * @param {User} user
     */
    applyTemplate(builder, user) {
        let id = user.id;
        let firstName = user.firstName;
        let lastName = user.lastName;
        let address = user.address;

        builder
            .username('UserNotificationTemplate')
            .text('text for Builder')
            .attachment()
            .title(`User - ${id}`)
            .text('User')
            .field()
            .text('text')
            .addKeyValuePair('id', 'asdf')
            .addKeyValuePair('name', `${firstName} ${lastName}`)
            .addKeyValuePair('address', `${address}`)
        ;
    }
}

export default UserNotificationTemplate;