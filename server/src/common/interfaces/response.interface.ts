export interface SuccessResponse<T> {
	statusCode: number;
	message: string;
	data: T;
}

export interface ErrorResponse {
	statusCode: number;
	message: string;
	error: string | null;
}
