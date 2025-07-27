# Farmer Connect - Raw Materials Marketplace

A full-stack e-commerce platform connecting street food vendors with raw material suppliers. Built with Django REST Framework backend and React TypeScript frontend.

## Features

### Frontend Features
- **Product Catalog**: Browse raw materials by category (spices, oils, flours, vegetables, grains)
- **Search & Filter**: Advanced search with category filtering and sorting options
- **Shopping Cart**: Add, update, and remove items from cart
- **User Authentication**: Buyer and seller registration/login
- **Responsive Design**: Modern UI with mobile-first approach
- **Real-time Updates**: Dynamic data from backend API

### Backend Features
- **RESTful API**: Complete API for all frontend operations
- **User Management**: Role-based authentication (buyer/seller/admin)
- **Product Management**: CRUD operations for products with categories
- **Cart System**: Persistent shopping cart functionality
- **Order Management**: Order creation and tracking
- **Rating System**: Product and seller ratings
- **Admin Panel**: Django admin interface for data management

## Tech Stack

### Backend
- **Django 5.2.4**: Web framework
- **Django REST Framework**: API framework
- **PostgreSQL**: Database
- **Django CORS Headers**: Cross-origin resource sharing
- **Python 3.11+**: Programming language

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Shadcn/ui**: Component library
- **React Router**: Navigation
- **React Query**: Data fetching
- **Vite**: Build tool

## Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- PostgreSQL database
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd farmer-connect
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend/backend/fresh
```

#### Create and activate virtual environment
```bash
# Windows
python -m venv myenv
myenv\Scripts\activate

# macOS/Linux
python3 -m venv myenv
source myenv/bin/activate
```

#### Install dependencies
```bash
pip install -r requirements.txt
```

#### Set up environment variables
Create a `.env` file in the `backend/backend/fresh` directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/farmer_connect
SECRET_KEY=your-secret-key-here
DEBUG=True
```

#### Run database migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create superuser (optional)
```bash
python manage.py createsuperuser
```

#### Populate sample data
```bash
python manage.py populate_sample_data
```

#### Start the development server
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/`

### 3. Frontend Setup

#### Navigate to frontend directory
```bash
cd Frontend/AGRO
```

#### Install dependencies
```bash
npm install
# or
yarn install
# or
bun install
```

#### Start the development server
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/auth/token/` - Get authentication token

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `GET /api/products/categories/` - Get product categories
- `GET /api/products/search/` - Search products

### Cart
- `GET /api/carts/my_cart/` - Get user's cart
- `POST /api/carts/add_item/` - Add item to cart
- `PUT /api/carts/update_item/` - Update cart item quantity
- `DELETE /api/carts/remove_item/` - Remove item from cart
- `DELETE /api/carts/clear_cart/` - Clear cart

### Orders
- `GET /api/orders/` - List user's orders
- `POST /api/orders/create_from_cart/` - Create order from cart
- `GET /api/orders/{id}/` - Get order details

## Sample Data

The management command creates the following sample data:

### Sellers
- Mumbai Spice Co. (spices)
- Golden Oil Mills (oils)
- Flour King Mills (flours)
- Nashik Farmers (vegetables)
- Spice Garden (spices)
- Rice Valley (grains)
- Chili Express (spices)
- Punjab Potato Farm (vegetables)

### Products
- Garam Masala Powder (₹320/kg)
- Refined Sunflower Oil (₹180/liter)
- All Purpose Flour (₹35/kg)
- Fresh Onions (₹25/kg)
- Turmeric Powder (₹280/kg)
- Basmati Rice (₹85/kg)
- Red Chili Powder (₹250/kg)
- Fresh Potatoes (₹20/kg)

### Test User
- Username: `test_buyer`
- Password: `password123`

## Database Schema

### Core Models
- **User**: Custom user model with role-based authentication
- **Product**: Products with categories, pricing, and availability
- **Cart/CartItem**: Shopping cart functionality
- **Order/OrderItem**: Order management
- **Rating**: Product and seller ratings
- **SupplierProfile/VendorProfile**: Extended user profiles

## Development

### Backend Development
- API endpoints are in `myapp/views.py`
- Models are in `myapp/models.py`
- Serializers are in `myapp/serializers.py`
- URLs are configured in `myapp/urls.py`

### Frontend Development
- Components are in `src/components/`
- Pages are in `src/pages/`
- API service is in `src/services/api.ts`
- Types are defined in the API service file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team. 