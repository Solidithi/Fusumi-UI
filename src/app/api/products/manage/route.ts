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

// Helper function to write businesses data
function writeBusinessesData(data: any) {
  fs.writeFileSync(BUSINESSES_FILE_PATH, JSON.stringify(data, null, 2));
}

// POST: Add a new product
export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    // Validate required fields
    if (!productData.productName || !productData.price || !productData.businessId) {
      return NextResponse.json(
        { error: 'Missing required fields: productName, price, businessId' },
        { status: 400 }
      );
    }
    
    // Read existing data from both files
    const productsData = readProductsData();
    const businessesData = readBusinessesData();
    
    // Check if business exists
    const businessExists = businessesData.businesses.some((b: any) => b.id === productData.businessId);
    if (!businessExists) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }
    
    // Create new product
    const newProduct = {
      id: `p${Date.now()}`,
      productName: productData.productName,
      productType: productData.productType || 'PRODUCT',
      price: parseFloat(productData.price),
      unitOfMeasure: productData.unitOfMeasure || 'per unit',
      description: productData.description || '',
      images: productData.images || [],
      startDate: productData.startDate || new Date().toISOString(),
      endDate: productData.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      businessId: productData.businessId,
      category: productData.category || 'General',
      rating: productData.rating || 4.0,
      reviews: productData.reviews || 0,
      sales: productData.sales || 0,
      type: productData.type || 'goods',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to products array
    productsData.products.push(newProduct);
    
    // Write updated data
    writeProductsData(productsData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product added successfully',
      product: newProduct 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing product
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Read existing data
    const productsData = readProductsData();
    
    // Find and update product
    const productIndex = productsData.products.findIndex((p: any) => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Update product
    productsData.products[productIndex] = {
      ...productsData.products[productIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Write updated data
    writeProductsData(productsData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      product: productsData.products[productIndex] 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Read existing data
    const productsData = readProductsData();
    
    // Find and remove product
    const productIndex = productsData.products.findIndex((p: any) => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Remove product
    const removedProduct = productsData.products.splice(productIndex, 1)[0];
    
    // Also remove related reviews
    productsData.reviews = productsData.reviews.filter((r: any) => r.productId !== id);
    
    // Write updated data
    writeProductsData(productsData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully',
      product: removedProduct 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
