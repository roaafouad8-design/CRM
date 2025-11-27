export class ApiResponse {
  static success(message: string, data?: unknown) {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string, error?: unknown) {
    return {
      success: false,
      message,
      // Only surface raw error details when explicitly provided (e.g. during development)
      error,
    };
  }
}
