//<---------- Using PostgreSQL ---------->

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   const { email, password } = await req.json();

//   const existingUser = await prisma.user.findUnique({ where: { email } });

//   if (existingUser) {
//     return NextResponse.json({ error: "User already exists" }, { status: 400 });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await prisma.user.create({
//     data: {
//       email,
//       password: hashedPassword,
//     },
//   });

//   return NextResponse.json(user, { status: 201 });
// }



//<---------- Using MongoDB ---------->
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectMongo from '@/lib/mongodb'

import { NextResponse } from 'next/server';

export async function POST(req) {

  connectMongo();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
