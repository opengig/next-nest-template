import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; //

// Update user profile (PUT request)
export async function PUT(
  req: Request,
  { params }: { params: { userId: any } }
) {
  try {
    const body = await req.json();

    const { name } = body;

    if (!name || !params.userId) {
      return NextResponse.json(
        { message: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    // Assume you're using Prisma or another ORM to update the user's profile in the DB
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: { name },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating profile", success: false },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { userId: any } }
) {
  try {
    if (!params.userId) {
      return NextResponse.json(
        { message: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    // Assume you're using Prisma or another ORM to delete the user from the DB
    await prisma.user.delete({
      where: { id: params.userId },
    });

    return NextResponse.json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting user", success: false },
      { status: 500 }
    );
  }
}
