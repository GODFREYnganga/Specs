export function logProductData(product: any) {
  console.group('Product Data Analysis');
  console.log('Product ID:', product._id);
  console.log('Product Name:', product.name);
  
  // Check basic product fields
  console.group('Basic Fields');
  console.log('price:', product.price);
  console.log('category:', product.category);
  console.log('image:', product.image);
  console.log('images array:', product.images);
  console.log('description:', product.description);
  console.log('product_description:', product.product_description);
  console.groupEnd();
  
  // Check technical information fields
  console.group('Technical Information');
  console.log('short_technical_information:', product.short_technical_information);
  console.log('short_technical_info:', product.short_technical_info);
  console.log('long_technical_information:', product.long_technical_information);
  console.log('long_technical_info:', product.long_technical_info);
  console.groupEnd();
  
  // Check data object structure
  console.group('Product Data Object');
  if (product.data) {
    console.log('data.Description:', product.data.Description);
    console.log('data.description:', product.data.description);
    console.log('data.product_description:', product.data.product_description);
    console.log('data.SHORT Technical Information:', product.data['SHORT Technical Information']);
    console.log('data.LONG Technical Information:', product.data['LONG Technical Information']);
    
    // Log all keys in the data object
    console.log('All data object keys:', Object.keys(product.data));
  } else {
    console.log('No data object found');
  }
  console.groupEnd();
  
  console.groupEnd();
  
  return product;
}
