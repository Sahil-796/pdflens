import { deleteUser } from '@/db/user';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

const deleteAccountSchema = z.object({
    confirmText: z.string().refine(
        (text) => text.trim().toLowerCase() === "delete my account",
        { message: "Confirmation text must be 'delete my account'" }
    ),
});

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' }, 
                { status: 401 }
            );
        }

        // Validate request body
        const body = await req.json();
        const parsed = deleteAccountSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: 'Invalid request',
                    message: parsed.error.message || 'Invalid confirmation text'
                },
                { status: 400 }
            );
        }

        // Delete user and their session
        await deleteUser(session.user.id);
        await auth.api.signOut({ headers: req.headers }); // Sign out the user

        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to delete account',
                message: error.message 
            },
            { status: 500 }
        );
    }
}