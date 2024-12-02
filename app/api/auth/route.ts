import connect from "@/lib/data";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import vendor from "@/models/vendor";

const jwt = require('jsonwebtoken');

export async function login(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    await connect();
    const user = await User.findOne({ email }).populate('vendorId');
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        vendorId: user.vendorId?._id || null,
        vendorName: user.vendorId?.name || null
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const redirectUrl = user.role === 'vendor' ? 'http://localhost:3001' : null;

    return NextResponse.json({ 
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        vendorId: user.vendorId?._id || null
      },
      redirectUrl
    });
  } catch (error) {
    return NextResponse.json({ message: "Error logging in" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json();

  try {
    await connect();

    // First create the user as vendor
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: 'vendor' 
    });
    await newUser.save();

    // Then create their vendor profile
    const newVendor = new vendor({
      name: `${name}'s Store`,
      owner: newUser._id
    });
    await newVendor.save();

    // Update user with vendorId
    await User.findByIdAndUpdate(newUser._id, {
      vendorId: newVendor._id
    });

    const token = jwt.sign(
      { 
        id: newUser._id, 
        role: 'vendor',
        vendorId: newVendor._id,
        vendorName: newVendor.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ 
      message: "Vendor account created successfully",
      token,
      redirectUrl: 'http://localhost:3001'
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating vendor account:", error);
    return NextResponse.json({ message: "Error creating vendor account" }, { status: 500 });
  }
}


export async function GET(request: Request) {
  try {
    await connect();

    const users = await User.find();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}