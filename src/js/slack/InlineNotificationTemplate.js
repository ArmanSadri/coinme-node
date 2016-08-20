import NotificationTemplate from './NotificationTemplate';

class InlineNotificationTemplate extends NotificationTemplate {

    /**
     *
     * @param {NotificationBuilder} builder
     * @param {*|Object} data
     * @return {NotificationBuilder}
     */
    applyTemplate(builder, data) {
        return builder.mergeIntoPayload(data);
    }

}

export default InlineNotificationTemplate;