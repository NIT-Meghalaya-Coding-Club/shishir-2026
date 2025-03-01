import connectMongo from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function GET(req){
    try {
        
        await connectMongo();
        
        const url = new URL(req.url);
        const eventCode = url.pathname.split('/').pop();

        if (!eventCode) {
            return new Response(JSON.stringify({ success: false, error: 'Event code is required' }), { status: 400 });
        }

        const registration = await Registration.find({ eventCode }).sort({ createdAt: -1 });

        return new Response(JSON.stringify({ success: true, registration }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}
