import { NextResponse } from 'next/server';
import connectMongo from '../../../../../lib/mongodb';
import User from '@/models/User';
import { canCreateCommittees, canCreateEvents } from '@/lib/eventAuth';

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'User Email is required' },
                { status: 400 }
            );
        }

        await connectMongo();

        const user = await User.findOne({email: id});

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user,
            canCreateEvents: await canCreateEvents(user),
            canCreateCommittees: await canCreateCommittees(user),
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching User:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
