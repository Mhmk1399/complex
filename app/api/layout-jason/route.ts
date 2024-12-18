import connect from "@/lib/data";
import { Layout } from '@/models/layout';
import { NextResponse } from 'next/server';

export async function GET() {
    await connect();
    if (!connect) {
        console.log("POST_ERROR", "Database connection failed");
        return new NextResponse("Database connection error", { status: 500 });
      }
  try {
    const layout = await Layout.findOne();
    
    // if (!layout) {
    //   // If no layout exists, you could return the default null.json data
    //   const defaultLayout = await import('@/public/template/null.json');
    //   return NextResponse.json(defaultLayout.default);
    // }

    return NextResponse.json(layout);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch layout data'+error },
      { status: 500 }
    );
  }
}
 
export async function POST(request: Request) {
    await connect();
    if (!connect) {
        console.log("POST_ERROR", "Database connection failed");
        return new NextResponse("Database connection error", { status: 500 });
    }
    
    try {
       
        
        const body = await request.json();
         
        const newLayout = new Layout(body);
        await newLayout.save();
        return NextResponse.json(newLayout);
        // const layoutToSave = {
        //     type: "layout",
        //     settings: body.layout?.settings || {},
        //     sections: {
        //         sectionHeader: body.layout?.sections?.sectionHeader || {},
        //         children: body.layout?.sections?.children || {},
        //         sectionFooter: body.layout?.sections?.sectionFooter || {}
        //     },
        //     order: ["section-header", "children", "section-footer"]
        // };

        
        // if (existingLayout) {
        //     const updatedLayout = await Layout.findOneAndUpdate(
        //         {},
        //         layoutToSave,
        //         { new: true }
        //     );
        //     return NextResponse.json(updatedLayout);
        // } else {
        //     const newLayout = new Layout(layoutToSave);
        //     await newLayout.save();
        //     return NextResponse.json(newLayout);
        // }
        
    } catch (error) {
        console.error("Error saving layout:", error);
        return NextResponse.json(
            { error: 'Failed to save layout', details: error },
            { status: 500 }
        );
    }
}


export async function DELETE(request: Request) {
    await connect();
    if (!connect) {
        console.log("POST_ERROR", "Database connection failed");
        return new NextResponse("Database connection error", { status: 500 });
    }

    try {
        const body = await request.json();
        const id = body.id;  
        const deletedLayout = await Layout.findOneAndDelete(id);
        if (!deletedLayout) {
            return NextResponse.json(
                { error: 'Layout not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(deletedLayout);
    }
    catch (error) {
        console.error("Error deleting layout:", error);
        return NextResponse.json(
            { error: 'Failed to delete layout' },
            { status: 500 }
        );
    }

}
        