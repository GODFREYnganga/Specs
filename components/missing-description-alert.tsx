"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface MissingDescriptionAlertProps {
  product: any;
}

const MissingDescriptionAlert: React.FC<MissingDescriptionAlertProps> = ({ product }) => {
  // Only show in development environment
  if (process.env.NODE_ENV === 'production') return null;
  
  const hasDescription = Boolean(
    product.product_description ||
    product.description ||
    (product.data && (product.data.Description || product.data.description || product.data.product_description))
  );
  
  const hasShortTechnical = Boolean(
    product.short_technical_info ||
    product.short_technical_information ||
    (product.data && product.data['SHORT Technical Information'])
  );
  
  const hasLongTechnical = Boolean(
    product.long_technical_info ||
    product.long_technical_information ||
    (product.data && product.data['LONG Technical Information'])
  );
  
  const hasAllData = hasDescription && hasShortTechnical && hasLongTechnical;
  
  // Don't show if all descriptions are present
  if (hasAllData) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-300 p-4 rounded-md mb-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
        <div>
          <h4 className="font-medium text-amber-800">Developer Note: Missing Product Information</h4>
          <p className="text-amber-700 text-sm mt-1">
            This product is missing some description data. This message only appears in development mode.
          </p>
          <div className="mt-2 space-y-1 text-xs text-amber-700">
            {!hasDescription && (
              <p>• Main description is missing</p>
            )}
            {!hasShortTechnical && (
              <p>• Short technical information is missing</p>
            )}
            {!hasLongTechnical && (
              <p>• Detailed technical information is missing</p>
            )}
          </div>
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-amber-100 border-amber-300 hover:bg-amber-200"
              onClick={() => {
                console.group("Product Data Debug");
                console.log("Product:", product);
                console.log("Description fields:", {
                  product_description: product.product_description,
                  description: product.description,
                  data_Description: product.data?.Description,
                  data_description: product.data?.description,
                  data_product_description: product.data?.product_description,
                  short_technical_info: product.short_technical_info,
                  short_technical_information: product.short_technical_information,
                  data_SHORT: product.data?.['SHORT Technical Information'],
                  long_technical_info: product.long_technical_info,
                  long_technical_information: product.long_technical_information,
                  data_LONG: product.data?.['LONG Technical Information'],
                });
                console.groupEnd();
              }}
            >
              Debug in Console
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissingDescriptionAlert;
