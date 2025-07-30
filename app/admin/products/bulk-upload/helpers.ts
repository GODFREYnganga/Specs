/**
 * Helper function to safely handle API responses
 * Handles both JSON and non-JSON responses (like HTML error pages)
 */
export async function handleApiResponse(response: Response) {
  if (!response.ok) {
    // Try to parse as JSON first
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    } else {
      // If not JSON, get text and create a more helpful error
      const errorText = await response.text();
      // Truncate long error messages and provide status code
      const errorSummary = errorText.length > 100 
        ? `${errorText.substring(0, 100)}...` 
        : errorText;
      throw new Error(`Server error (${response.status}): ${errorSummary}`);
    }
  }
  
  return response.json();
}
