// src/api/organizer/auth/logout/route.js
export const POST = async (req) => {
    try {
  
      if (req.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
      }
  
      const cookieOptions = {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 0, // Immediately expire the cookie
        sameSite: 'strict',
        path: '/', // The path scope of the cookie
      };
  
      return new Response(JSON.stringify({ success: true, message: 'Logged out successfully' }), {
        status: 200,
        headers: {
          'Set-Cookie': `organizerToken=; ${cookieOptions.httpOnly ? "HttpOnly;" : ""} Max-Age=${cookieOptions.maxAge}; Path=${cookieOptions.path}; ${cookieOptions.secure ? 'Secure;' : ''} SameSite=${cookieOptions.sameSite};`,
        },
      });
  
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
    }
  };
  