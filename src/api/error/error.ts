export class CustomError extends Error {
  message: string;
  error: string;
  statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    error: string = 'Unknown Error',
  ) {
    super(message); // 부모 클래스인 Error의 message 속성 설정
    this.error = error;
    this.statusCode = statusCode;
    this.message = message;
    //
    // // 스택 트레이스 캡처 (개발 환경에서 디버깅에 유용)
    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, CustomError);
    // }
  }
}
