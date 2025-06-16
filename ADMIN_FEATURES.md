# Spectacles E-commerce Admin Dashboard

## 🎯 Overview
A fully functional admin dashboard for an e-commerce spectacles store with real MongoDB database integration, complete settings management, and comprehensive shopping functionality.

## ✅ Completed Features

### 🔧 **Admin Settings System**
Navigate to `/admin/settings` to access the complete settings dashboard with 7 comprehensive sections:

#### **1. General Settings**
- Store name, logo, and branding
- Contact information (email, phone, address)
- Currency selection (USD, EUR, GBP, KSh, NGN)
- Timezone configuration
- File upload support for store logo

#### **2. Tax & Shipping Settings**
- Configurable tax rates
- Default and express shipping costs
- Free shipping threshold settings
- Real-time calculation updates

#### **3. Payment Methods**
- Toggle support for multiple payment gateways:
  - Stripe integration
  - PayPal support
  - M-Pesa mobile payments
  - Bank transfer options

#### **4. Notifications**
- Email notification preferences
- SMS notification settings
- Webhook URL configuration
- Slack integration setup
- Marketing email controls

#### **5. Appearance & Branding**
- Theme color customization (primary, secondary, accent)
- Layout preferences (header/footer styles)
- Product grid column configuration
- Homepage section toggles
- Custom CSS injection
- File uploads for branding assets

#### **6. SEO Configuration**
- Meta tags (title, description, keywords)
- Social media settings (Open Graph, Twitter Cards)
- Analytics integration (Google Analytics, GTM, Facebook Pixel)
- Structured data markup
- XML sitemap generation
- Robots.txt management

#### **7. Advanced Settings**
- Performance optimization (caching, image compression)
- Security settings (rate limiting, CORS, SSL)
- Backup and restore functionality
- Maintenance mode controls
- API configuration
- Logging preferences

### 🗄️ **Database Integration**
- **MongoDB Models**: Cart, Wishlist, Settings, Products, Orders, Users
- **Real-time Persistence**: All data saved to MongoDB with proper schemas
- **Virtual Fields**: Automatic calculation of cart totals, tax, shipping
- **Data Validation**: Mongoose schemas with validation rules

### 🛒 **Shopping Experience**
- **Cart System**: Add/remove items, update quantities, persistent storage
- **Wishlist**: Save favorite products, sync across sessions
- **Guest Support**: Local storage fallback for non-authenticated users
- **Real-time Updates**: Toast notifications and loading states

### 📊 **Orders Management**
Navigate to `/admin/orders` for comprehensive order management:
- Order listing with search and filter capabilities
- Status updates (pending, processing, shipped, delivered, cancelled)
- Customer information display
- Order details and item breakdown
- Bulk operations and export functionality

### 🎨 **User Interface**
- **Modern Design**: Professional admin interface with Shadcn/UI components
- **Responsive Layout**: Works on desktop and mobile devices
- **Loading States**: Proper loading indicators throughout
- **Error Handling**: Comprehensive error messages and recovery
- **Form Validation**: Real-time validation with user feedback

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- npm or pnpm package manager

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env.local file
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Seed the database with products:
   ```bash
   node seedProducts.js
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the application:
   - **Frontend**: http://localhost:3000
   - **Admin Dashboard**: http://localhost:3000/admin
   - **Settings**: http://localhost:3000/admin/settings

## 📱 **Navigation Guide**

### Admin Access
1. Go to `/admin/login` to access admin panel
2. Use admin credentials to log in
3. Navigate through the dashboard sections:
   - **Overview**: Key metrics and statistics
   - **Products**: Product management (existing)
   - **Orders**: Order management with search/filter
   - **Users**: User management (existing)
   - **Settings**: Complete store configuration

### Settings Configuration
1. Click on "Settings" in the admin sidebar
2. Use the tabbed interface to configure different sections
3. All changes are saved to MongoDB in real-time
4. Use file upload for logos and branding assets

### Shopping Features
1. Browse products on the main site
2. Add items to cart or wishlist
3. View cart with calculated totals
4. Proceed to checkout (integration ready)

## 🔧 **Technical Architecture**

### Backend
- **Framework**: Next.js 14 with App Router
- **Database**: MongoDB with Mongoose ODM
- **API Routes**: RESTful endpoints for all operations
- **File Upload**: Support for image uploads via FormData

### Frontend
- **UI Library**: Shadcn/UI components
- **Styling**: Tailwind CSS
- **State Management**: React hooks with local storage fallback
- **Forms**: React Hook Form with validation
- **Notifications**: Sonner for toast messages

### Database Models
- **Settings**: Nested configuration structure
- **Cart**: User-specific with virtual calculations
- **Wishlist**: Product favorites with references
- **Products**: Complete product information
- **Orders**: Order tracking and management
- **Users**: Authentication and role management

## 🔐 **Security Features**
- Admin authentication and authorization
- Rate limiting configuration
- CORS policy management
- Input validation and sanitization
- Secure file upload handling

## 📈 **Performance Optimizations**
- Caching configuration
- Image optimization settings
- Lazy loading support
- Database query optimization
- Virtual fields for calculations

## 🛠️ **Customization**
The settings system allows complete customization of:
- Store appearance and branding
- Business logic (taxes, shipping)
- Payment gateway integrations
- SEO and marketing settings
- Performance and security options

## 📝 **API Endpoints**

### Settings API
- `GET /api/settings` - Retrieve all settings
- `PUT /api/settings` - Update settings
- `POST /api/settings` - File upload for assets

### Cart API
- `GET /api/cart?userId=ID` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart` - Remove cart item

### Wishlist API
- `GET /api/wishlist?userId=ID` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist` - Remove from wishlist

## 🎯 **Production Ready**
The application includes:
- Environment configuration
- Error boundaries and handling
- Loading states and user feedback
- Database connection management
- File upload and storage
- Backup and maintenance modes

## 📞 **Support**
All features are fully functional and integrated with the database. The admin dashboard provides comprehensive control over the e-commerce store with professional-grade settings management.
