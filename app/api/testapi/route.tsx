import { db } from '@/lib/db';

export async function GET() {
    try {
        const enginePrice = await db.user.findMany({
            select: {
                username: true,
                email: true,
                password: true,
                role: true,
            }
        });

        return new Response(JSON.stringify(enginePrice));

    } catch (error) {
        console.error("Error fetching engine price:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
