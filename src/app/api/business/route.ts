import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const BUSINESSES_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'businesses.json');

// GET: Read businesses data
export async function GET() {
  try {
    const fileContents = fs.readFileSync(BUSINESSES_FILE_PATH, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading businesses file:', error);
    return NextResponse.json(
      { error: 'Failed to read businesses data' },
      { status: 500 }
    );
  }
}

// POST: Write businesses data
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the data structure
    if (!data.businesses) {
      return NextResponse.json(
        { error: 'Invalid data structure - businesses array required' },
        { status: 400 }
      );
    }
    
    // Read existing businesses
    let existingData: { businesses: any[] } = { businesses: [] };
    try {
      const fileContents = fs.readFileSync(BUSINESSES_FILE_PATH, 'utf8');
      existingData = JSON.parse(fileContents);
    } catch (error) {
      // File doesn't exist or is empty, use default structure
      existingData = { businesses: [] };
    }
    
    // Append new businesses to existing ones
    existingData.businesses.push(...data.businesses);
    
    // Write to file
    fs.writeFileSync(BUSINESSES_FILE_PATH, JSON.stringify(existingData, null, 2));
    
    return NextResponse.json({ success: true, message: 'Businesses data saved successfully' });
  } catch (error) {
    console.error('Error writing businesses file:', error);
    return NextResponse.json(
      { error: 'Failed to save businesses data' },
      { status: 500 }
    );
  }
}

// PUT: Update specific business
export async function PUT(request: NextRequest) {
  try {
    const { type, data: updateData } = await request.json();
    
    // Read existing data
    const fileContents = fs.readFileSync(BUSINESSES_FILE_PATH, 'utf8');
    const existingData = JSON.parse(fileContents);
    
    // Update based on type
    switch (type) {
      case 'add-business':
        existingData.businesses.push(updateData);
        break;
      case 'update-business':
        const businessIndex = existingData.businesses.findIndex(
          (b: any) => b.id === updateData.id
        );
        if (businessIndex !== -1) {
          existingData.businesses[businessIndex] = { 
            ...existingData.businesses[businessIndex], 
            ...updateData,
            updatedAt: new Date().toISOString()
          };
        }
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid update type' },
          { status: 400 }
        );
    }
    
    // Write updated data
    fs.writeFileSync(BUSINESSES_FILE_PATH, JSON.stringify(existingData, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Business data updated successfully',
      data: existingData 
    });
  } catch (error) {
    console.error('Error updating businesses file:', error);
    return NextResponse.json(
      { error: 'Failed to update businesses data' },
      { status: 500 }
    );
  }
}
