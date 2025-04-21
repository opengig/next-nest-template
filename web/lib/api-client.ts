import { apiUrl } from '@/config';
import axios, { AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from './auth';

type ApiResult<T> = {
	data?: T;
	error?: {
		message: string;
		status: number;
		details?: Record<string, unknown>;
	};
};

export class ApiClient {
	static async request<T>(config: AxiosRequestConfig): Promise<ApiResult<T>> {
		try {
			const isServer = typeof window === 'undefined';
			const session = isServer ? await getServerSession(authOptions) : await getSession();

			const headers: Record<string, string> = {};

			if (session?.user?.token && !config.url?.endsWith('/api/auth/google')) {
				headers.Authorization = `Bearer ${session.user.token}`;
			}

			if (!(config.data instanceof FormData)) {
				headers['Content-Type'] = 'application/json';
			}

			const client = axios.create({
				baseURL: apiUrl,
				headers,
			});
			const response: AxiosResponse<T> = await client.request(config);
			return { data: response.data };
		} catch (err) {
			const error = err as Error;
			console.error('API Client error:', {
				url: config.url,
				method: config.method,
				error: error.message,
				response: isAxiosError(err) ? err.response?.data : undefined
			});
			if (isAxiosError(err)) {
				if (err.response?.status === 422) {
					const message = Object.values(err.response?.data.data).join(', ');
					return {
						error: {
							message,
							details: err.response?.data.data,
							status: err.response?.status || 500,
						},
					};
				}
				return {
					error: {
						message: err.response?.data.message,
						details: err.response?.data.data,
						status: err.response?.status || 500,
					},
				};
			}
			return {
				error: {
					message: 'An unknown error occurred',
					status: 500,
				},
			};
		}
	}

	static async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResult<T>> {
		return this.request<T>({ method: 'GET', url, params });
	}

	static async post<T, D = unknown>(url: string, data?: D): Promise<ApiResult<T>> {
		return this.request<T>({ method: 'POST', url, data });
	}

	static async put<T, D = unknown>(url: string, data?: D): Promise<ApiResult<T>> {
		return this.request<T>({ method: 'PUT', url, data });
	}

	static async patch<T, D = unknown>(url: string, data?: D): Promise<ApiResult<T>> {
		return this.request<T>({ method: 'PATCH', url, data });
	}

	static async delete<T>(url: string): Promise<ApiResult<T>> {
		return this.request<T>({ method: 'DELETE', url });
	}
}