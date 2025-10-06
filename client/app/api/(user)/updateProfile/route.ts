import { updateUser } from '@/db/user';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

// Simplified schema - we'll get the ID from the session
const UpdateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

export async function POST(req: NextRequest) {
    try {
        // First check authentication
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Then validate request body
        const body = await req.json();
        const parsed = UpdateUserSchema.safeParse(body);
        
        if (!parsed.success) {
            return NextResponse.json(
                { 
                    error: 'Invalid request', 
                    issues: parsed.error.flatten().fieldErrors 
                },
                { status: 400 }
            );
        }

        // Update user with session ID and provided name
        const updatedUser = await updateUser(session.user.id, parsed.data.name);

        return NextResponse.json({ 
            success: true,
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' }, 
            { status: 500 }
        );
    }
}