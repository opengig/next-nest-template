import { envConfig } from '@/config';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.token) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const chatId = params.id;

    // Forward the request to the NestJS backend
    const response = await fetch(`${envConfig.apiUrl}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    // Return the streaming response from the backend
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat API route:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
