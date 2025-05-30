export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Destructure request data
  const { messages, data } = await req.json();

  const initialMessages = messages.slice(0, -1); 
  const currentMessage = messages[messages.length - 1]; 

  // Build message content for FastAPI
  const requestPayload: any = {
    messages: [
      ...initialMessages,
      currentMessage
    ]
  };

  // Add images if they exist
  if (data?.images && data.images.length > 0) {
    requestPayload.images = data.images;
  }

  try {
    const response = await fetch('http://localhost:8080/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      throw new Error(`FastAPI request failed: ${response.status}`);
    }

    // Return the response as a stream
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('Error calling FastAPI:', error);
    return new Response('Error communicating with FastAPI', { status: 500 });
  }
}
