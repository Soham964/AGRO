#!/bin/bash

echo "🚀 Setting up Farmer Connect - Raw Materials Marketplace"
echo "=================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Backend Setup
echo ""
echo "🔧 Setting up Backend..."
cd backend/backend/fresh

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv myenv

# Activate virtual environment
echo "Activating virtual environment..."
source myenv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file
echo "Creating environment file..."
cat > .env << EOF
DATABASE_URL=postgresql://postgres:password@localhost:5432/farmer_connect
SECRET_KEY=django-insecure-c^arqx7^0j^5*i1xl\$*nkg(gb)ri+od7^ij7ye%=r*5^7^5ahp
DEBUG=True
EOF

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo "Creating superuser..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin123')" | python manage.py shell

# Populate sample data
echo "Populating sample data..."
python manage.py populate_sample_data

echo "✅ Backend setup completed!"

# Frontend Setup
echo ""
echo "🔧 Setting up Frontend..."
cd ../../../Frontend/AGRO

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup completed!"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend server:"
echo "   cd backend/backend/fresh"
echo "   source myenv/bin/activate  # On Windows: myenv\\Scripts\\activate"
echo "   python manage.py runserver"
echo ""
echo "2. Start the frontend server:"
echo "   cd Frontend/AGRO"
echo "   npm run dev"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8000/api/"
echo "   Admin Panel: http://localhost:8000/admin/"
echo ""
echo "4. Test credentials:"
echo "   Admin: admin / admin123"
echo "   Buyer: test_buyer / password123"
echo ""
echo "Happy coding! 🚀" 