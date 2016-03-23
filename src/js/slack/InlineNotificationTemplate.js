import NotificationTemplate from '~/slack/NotificationTemplate';

class InlineNotificationTemplate extends NotificationTemplate {

    applyTemplate(builder, data) {
        builder.mergeIntoPayload(data);
    }

}

export default InlineNotificationTemplate;