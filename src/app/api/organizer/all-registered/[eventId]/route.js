import connectMongo from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function GET(req, { params }) {
    console.log("Params:", params); // Debug: Log the params object
    try {
      await connectMongo();
      const { eventId } = params;
  
      if (!eventId) {
        return new Response(JSON.stringify({ success: false, error: 'Event ID is required' }), { status: 400 });
      }
  
      const registration = await Registration.find({ eventId }).sort({ createdAt: -1 });
      return new Response(JSON.stringify({ success: true, registration }), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
  }