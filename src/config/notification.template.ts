export class NotificationTemplates {
  static review({ isUpdate, tutor_id, rating }: any) {
    return {
      title: isUpdate ? "Review Updated" : "New Review ",
      message: isUpdate
        ? "A student updated their review"
        : "You received a new review",
      type: "REVIEW",
      extra_data: { tutor_id, rating },
    };
  }
}
