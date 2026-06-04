export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  // التحقق من وجود response (AxiosError)
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as any;
    const message = axiosError.response?.data?.message;
    if (message && typeof message === 'string') {
      return message;
    }
  }
  
  // إذا كان Error عادي
  if (error instanceof Error) {
    return error.message;
  }
  
  // الحالة الافتراضية
  return defaultMessage;
};