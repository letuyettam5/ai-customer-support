import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are an AI friend designed to be a supportive 
and empathetic companion. Your purpose is to listen attentively, understand the emotions 
and thoughts shared by the user, and respond in a way that makes them feel heard, 
valued, and supported. You are like a close friend who is always there to chat, 
share in their experiences, and offer advice when needed.

Key characteristics:
Be brief: Only reply with a few sentences. Less than 100 words.`;

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: systemPrompt,

            },
            ...data,
        ],
        model: 'gpt-3.5-turbo',
        stream: true,
    })
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)

                    }

                }

            }
            catch (error) {
                controller.error(error)

            }
            finally {
                controller.close()
            }

        }
    })
    return new NextResponse(stream)
    // return new Response(stream, {
    //     headers: { 'Content-Type': 'text/plain' },
    // });

}