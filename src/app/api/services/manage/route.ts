import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'products.json');
const BUSINESSES_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'businesses.json');

// Helper function to read products data
function readProductsData() {
  const fileContents = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
  return JSON.parse(fileContents);
}

// Helper function to read businesses data
function readBusinessesData() {
  const fileContents = fs.readFileSync(BUSINESSES_FILE_PATH, 'utf8');
  return JSON.parse(fileContents);
}

// Helper function to write products data
function writeProductsData(data: any) {
  fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(data, null, 2));
}

// POST: Add a new service
export async function POST(request: NextRequest) {
  try {
    const serviceData = await request.json();
    
    // Validate required fields
    if (!serviceData.name || !serviceData.price || !serviceData.businessId || !serviceData.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, businessId, category' },
        { status: 400 }
      );
    }
    
    // Read existing data from both files
    const productsData = readProductsData();
    const businessesData = readBusinessesData();
    
    // Check if business exists
    const businessExists = businessesData.businesses.some((b: any) => b.id === serviceData.businessId);
    if (!businessExists) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }
    
    // Create new service
    const newService = {
      id: `s${Date.now()}`,
      name: serviceData.name,
      description: serviceData.description || '',
      category: serviceData.category,
      price: parseFloat(serviceData.price),
      imageUrl: serviceData.imageUrl || '',
      startDate: serviceData.startDate || new Date().toISOString(),
      endDate: serviceData.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      attachments: serviceData.attachments || [],
      businessId: serviceData.businessId,
      features: serviceData.features || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to services array
    productsData.services.push(newService);
    
    // Write updated data
    writeProductsData(productsData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Service added successfully',
      service: newService 
    });
  } catch (error) {
    console.error('Error adding service:', error);
    return NextResponse.json(
      { error: 'Failed to add service' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing service
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }
    
    // Read existing data
    const productsData = readProductsData();
    
    // Find and update service
    const serviceIndex = productsData.services.findIndex((s: any) => s.id === id);
    if (serviceIndex === -1) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Update service
    productsData.services[serviceIndex] = {
      ...productsData.services[serviceIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Write updated data
    writeProductsData(productsData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Service updated successfully',
      service: productsData.services[serviceIndex] 
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a service
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }
    
    // Read existing data
    const productsData = readProductsData();
    
    // Find and remove service
    const serviceIndex = productsData.services.findIndex((s: any) => s.id === id);
    if (serviceIndex === -1) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Remove service
    const removedService = productsData.services.splice(serviceIndex, 1)[0];
    
    // Write updated data
    writeProductsData(productsData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Service deleted successfully',
      service: removedService 
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
