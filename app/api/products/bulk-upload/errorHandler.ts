import { NextResponse } from "next/server";

export function handleApiError(error: any) {
  console.error("API Error:", error);
  
  // Check if this is a validation error from MongoDB/Mongoose
  if (error.name === 'ValidationError') {
    const validationErrors: any[] = [];
    
    // Extract specific field errors
    for (const field in error.errors) {
      validationErrors.push({
        field: field,
        message: error.errors[field].message,
        value: error.errors[field].value
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "Product validation failed. Please check your data.", 
      validationErrors: validationErrors
    }, { status: 400 });
  }
  
  return NextResponse.json({ 
    success: false, 
    error: error.message || "An error occurred processing your request",
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  }, { status: 500 });
}
