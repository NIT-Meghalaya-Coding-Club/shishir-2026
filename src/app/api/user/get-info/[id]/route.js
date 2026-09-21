import { NextResponse } from 'next/server';
import connectMongo from '../../../../../lib/mongodb';
import User from '@/models/User';
import Event from '@/models/Event';
import Committee from '@/models/Committee';
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

        const canCreateEvts = await canCreateEvents(user);
        const canCreateComm = await canCreateCommittees(user);

        const normalizedEmail = user.email.toLowerCase();

        const [isEventStaff, isCommitteeStaff] = await Promise.all([
            canCreateEvts
                ? true
                : Event.exists({
                    $or: [
                        { "eventHeads.email": user.email },
                        { "coordinators.email": user.email },
                    ],
                }),
            canCreateComm
                ? true
                : Committee.exists({
                    $or: [
                        { "committeeHeads.email": normalizedEmail },
                        { "coordinators.email": normalizedEmail },
                    ],
                }),
        ]);

        return NextResponse.json({
            user,
            canCreateEvents: canCreateEvts,
            canCreateCommittees: canCreateComm,
            hasEventAccess: Boolean(isEventStaff),
            hasCommitteeAccess: Boolean(isCommitteeStaff),
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching User:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
