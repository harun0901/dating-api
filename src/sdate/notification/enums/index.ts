export enum NotificationType {
  Visit = 'visit',
  Like = 'like',
  Favorite = 'favorite',
  Message = 'message',
}

export enum NotificationDescription {
  Visit = 'visited your profile.',
  Like = 'like you',
  Favorite = 'favorite you',
  Message = 'sent a message to you',
}

export enum NotificationState {
  NotSeen = 0,
  Seen = 1,
}
