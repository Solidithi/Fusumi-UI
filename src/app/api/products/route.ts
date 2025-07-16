import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'products.json');
const BUSINESSES_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'businesses.json');

// GET: Read combined data from both files
export async function GET() {
  try {
    const productsFileContents = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
    const businessesFileContents = fs.readFileSync(BUSINESSES_FILE_PATH, 'utf8');
    
    const productsData = JSON.parse(productsFileContents);
    const businessesData = JSON.parse(businessesFileContents);
    
    // Combine data from both files
    const combinedData = {
      businesses: businessesData.businesses,
      products: productsData.products,
      services: productsData.services,
      reviews: productsData.reviews
    };
    
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Error reading data files:', error);
    return NextResponse.json(
      { error: 'Failed to read data' },
      { status: 500 }
    );
  }
}

// POST: Write data to appropriate files
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the data structure
    if (!data.businesses || !data.products || !data.services || !data.reviews) {
      return NextResponse.json(
        { error: 'Invalid data structure' },
        { status: 400 }
      );
    }
    
    // Separate data into appropriate files
    const businessesData = { businesses: data.businesses };
    const productsData = { 
      products: data.products,
      services: data.services,
      reviews: data.reviews
    };
    
    // Write to both files
    fs.writeFileSync(BUSINESSES_FILE_PATH, JSON.stringify(businessesData, null, 2));
    fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(productsData, null, 2));
    
    return NextResponse.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error writing data files:', error);
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    );
  }
}

// PUT: Update specific parts of the data
export async function PUT(request: NextRequest) {
  try {
    const { type, data: updateData } = await request.json();
    
    // Read existing data from both files
    const productsFileContents = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
    const businessesFileContents = fs.readFileSync(BUSINESSES_FILE_PATH, 'utf8');
    
    const existingProductsData = JSON.parse(productsFileContents);
    const existingBusinessesData = JSON.parse(businessesFileContents);
    
    // Update based on type
    switch (type) {
      case 'add-review':
        existingProductsData.reviews.push(updateData);
        fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(existingProductsData, null, 2));
        break;
      case 'add-product':
        existingProductsData.products.push(updateData);
        fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(existingProductsData, null, 2));
        break;
      case 'add-service':
        existingProductsData.services.push(updateData);
        fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(existingProductsData, null, 2));
        break;
      case 'add-business':
        existingBusinessesData.businesses.push(updateData);
        fs.writeFileSync(BUSINESSES_FILE_PATH, JSON.stringify(existingBusinessesData, null, 2));
        break;
      case 'update-product':
        const productIndex = existingProductsData.products.findIndex(
          (p: any) => p.id === updateData.id
        );
        if (productIndex !== -1) {
          existingProductsData.products[productIndex] = { 
            ...existingProductsData.products[productIndex], 
            ...updateData 
          };
        }
        fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(existingProductsData, null, 2));
        break;
      case 'update-business':
        const businessIndex = existingBusinessesData.businesses.findIndex(
          (b: any) => b.id === updateData.id
        );
        if (businessIndex !== -1) {
          existingBusinessesData.businesses[businessIndex] = { 
            ...existingBusinessesData.businesses[businessIndex], 
            ...updateData 
          };
        }
        fs.writeFileSync(BUSINESSES_FILE_PATH, JSON.stringify(existingBusinessesData, null, 2));
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid update type' },
          { status: 400 }
        );
    }
    
    // Return combined data
    const combinedData = {
      businesses: existingBusinessesData.businesses,
      products: existingProductsData.products,
      services: existingProductsData.services,
      reviews: existingProductsData.reviews
    };
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data updated successfully',
      data: combinedData 
    });
  } catch (error) {
    console.error('Error updating data files:', error);
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 }
    );
  }
}
