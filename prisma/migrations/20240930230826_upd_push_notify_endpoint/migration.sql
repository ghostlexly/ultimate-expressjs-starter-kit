-- DropIndex
DROP INDEX `PushNotificationSubscription_endpoint_key` ON `PushNotificationSubscription`;

-- AlterTable
ALTER TABLE `PushNotificationSubscription` MODIFY `endpoint` LONGTEXT NOT NULL;
