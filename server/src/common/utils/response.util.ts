import { ErrorResponse } from "../interfaces/response.interface";
import { SuccessResponse } from "../interfaces/response.interface";

export class ResponseUtil {
	static success<T>(
		data: T,
		message: string = "Success",
		statusCode: number = 200,
	): SuccessResponse<T> {
		return {
			statusCode,
			message,
			data,
		};
	}

	static error(
		message: string,
		statusCode: number = 400,
		error: string | null = null,
	): ErrorResponse {
		return {
			statusCode,
			message,
			error,
		};
	}
}
