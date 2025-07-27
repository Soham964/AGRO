@echo off
echo 🚀 Setting up Farmer Connect - Raw Materials Marketplace
echo ==================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Backend Setup
echo.
echo 🔧 Setting up Backend...
cd backend\backend\fresh

REM Create virtual environment
echo Creating virtual environment...
python -m venv myenv

REM Activate virtual environment
echo Activating virtual environment...
call myenv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file
echo Creating environment file...
(
echo DATABASE_URL=postgresql://postgres:password@localhost:5432/farmer_connect
echo SECRET_KEY=django-insecure-c^arqx7^0j^5*i1xl$*nkg(gb)ri+od7^ij7ye%=r*5^7^5ahp
echo DEBUG=True
) > .env

REM Run migrations
echo Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Create superuser
echo Creating superuser...
echo from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin123') | python manage.py shell

REM Populate sample data
echo Populating sample data...
python manage.py populate_sample_data

echo ✅ Backend setup completed!

REM Frontend Setup
echo.
echo 🔧 Setting up Frontend...
cd ..\..\..\Frontend\AGRO

REM Install dependencies
echo Installing Node.js dependencies...
npm install

echo ✅ Frontend setup completed!

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Start the backend server:
echo    cd backend\backend\fresh
echo    myenv\Scripts\activate
echo    python manage.py runserver
echo.
echo 2. Start the frontend server:
echo    cd Frontend\AGRO
echo    npm run dev
echo.
echo 3. Access the application:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:8000/api/
echo    Admin Panel: http://localhost:8000/admin/
echo.
echo 4. Test credentials:
echo    Admin: admin / admin123
echo    Buyer: test_buyer / password123
echo.
echo Happy coding! 🚀
pause 