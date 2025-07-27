from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from myapp.models import User, Product, SupplierProfile
from decimal import Decimal

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create sample sellers
        sellers_data = [
            {
                'username': 'mumbai_spice',
                'email': 'mumbai@spice.com',
                'password': 'password123',
                'first_name': 'Mumbai',
                'last_name': 'Spice Co.',
                'role': 'seller',
                'phone': '9876543210',
                'location': 'Mumbai',
                'business_name': 'Mumbai Spice Co.'
            },
            {
                'username': 'golden_oil',
                'email': 'golden@oil.com',
                'password': 'password123',
                'first_name': 'Golden',
                'last_name': 'Oil Mills',
                'role': 'seller',
                'phone': '9876543211',
                'location': 'Delhi',
                'business_name': 'Golden Oil Mills'
            },
            {
                'username': 'flour_king',
                'email': 'flour@king.com',
                'password': 'password123',
                'first_name': 'Flour',
                'last_name': 'King Mills',
                'role': 'seller',
                'phone': '9876543212',
                'location': 'Punjab',
                'business_name': 'Flour King Mills'
            },
            {
                'username': 'nashik_farmers',
                'email': 'nashik@farmers.com',
                'password': 'password123',
                'first_name': 'Nashik',
                'last_name': 'Farmers',
                'role': 'seller',
                'phone': '9876543213',
                'location': 'Maharashtra',
                'business_name': 'Nashik Farmers'
            },
            {
                'username': 'spice_garden',
                'email': 'spice@garden.com',
                'password': 'password123',
                'first_name': 'Spice',
                'last_name': 'Garden',
                'role': 'seller',
                'phone': '9876543214',
                'location': 'Karnataka',
                'business_name': 'Spice Garden'
            },
            {
                'username': 'rice_valley',
                'email': 'rice@valley.com',
                'password': 'password123',
                'first_name': 'Rice',
                'last_name': 'Valley',
                'role': 'seller',
                'phone': '9876543215',
                'location': 'Haryana',
                'business_name': 'Rice Valley'
            },
            {
                'username': 'chili_express',
                'email': 'chili@express.com',
                'password': 'password123',
                'first_name': 'Chili',
                'last_name': 'Express',
                'role': 'seller',
                'phone': '9876543216',
                'location': 'Andhra Pradesh',
                'business_name': 'Chili Express'
            },
            {
                'username': 'punjab_potato',
                'email': 'punjab@potato.com',
                'password': 'password123',
                'first_name': 'Punjab',
                'last_name': 'Potato Farm',
                'role': 'seller',
                'phone': '9876543217',
                'location': 'Punjab',
                'business_name': 'Punjab Potato Farm'
            }
        ]

        sellers = []
        for seller_data in sellers_data:
            user, created = User.objects.get_or_create(
                username=seller_data['username'],
                defaults={
                    'email': seller_data['email'],
                    'password': make_password(seller_data['password']),
                    'first_name': seller_data['first_name'],
                    'last_name': seller_data['last_name'],
                    'role': seller_data['role'],
                    'phone': seller_data['phone'],
                    'location': seller_data['location'],
                    'is_verified': True
                }
            )
            if created:
                SupplierProfile.objects.create(
                    user=user,
                    business_name=seller_data['business_name'],
                    gst_number=f"GST{seller_data['phone'][-10:]}",
                    documents_uploaded=True
                )
            sellers.append(user)

        # Create sample products
        products_data = [
            {
                'name': 'Garam Masala Powder',
                'description': 'Premium quality garam masala for authentic street food taste',
                'category': 'spices',
                'price': Decimal('320.00'),
                'unit': 'per kg',
                'available_quantity': 100.0,
                'freshness': 'Very Fresh',
                'rating': Decimal('4.8'),
                'total_ratings': 45,
                'supplier': sellers[0]
            },
            {
                'name': 'Refined Sunflower Oil',
                'description': 'High quality refined oil perfect for deep frying',
                'category': 'oils',
                'price': Decimal('180.00'),
                'unit': 'per liter',
                'available_quantity': 200.0,
                'freshness': 'Fresh',
                'rating': Decimal('4.6'),
                'total_ratings': 32,
                'supplier': sellers[1]
            },
            {
                'name': 'All Purpose Flour (Maida)',
                'description': 'Fine quality maida for making bhature, samosa, and breads',
                'category': 'flours',
                'price': Decimal('35.00'),
                'unit': 'per kg',
                'available_quantity': 500.0,
                'freshness': 'Fresh',
                'rating': Decimal('4.9'),
                'total_ratings': 67,
                'supplier': sellers[2]
            },
            {
                'name': 'Fresh Onions',
                'description': 'Fresh red onions essential for street food preparation',
                'category': 'vegetables',
                'price': Decimal('25.00'),
                'unit': 'per kg',
                'available_quantity': 300.0,
                'freshness': 'Very Fresh',
                'rating': Decimal('4.7'),
                'total_ratings': 28,
                'supplier': sellers[3]
            },
            {
                'name': 'Turmeric Powder',
                'description': 'Pure turmeric powder for color and flavor',
                'category': 'spices',
                'price': Decimal('280.00'),
                'unit': 'per kg',
                'available_quantity': 150.0,
                'freshness': 'Very Fresh',
                'rating': Decimal('4.5'),
                'total_ratings': 23,
                'supplier': sellers[4]
            },
            {
                'name': 'Basmati Rice',
                'description': 'Quality basmati rice for biryani and pulao stalls',
                'category': 'grains',
                'price': Decimal('85.00'),
                'unit': 'per kg',
                'available_quantity': 400.0,
                'freshness': 'Good',
                'rating': Decimal('4.4'),
                'total_ratings': 19,
                'supplier': sellers[5]
            },
            {
                'name': 'Red Chili Powder',
                'description': 'Authentic red chili powder with perfect heat level',
                'category': 'spices',
                'price': Decimal('250.00'),
                'unit': 'per kg',
                'available_quantity': 120.0,
                'freshness': 'Very Fresh',
                'rating': Decimal('4.7'),
                'total_ratings': 41,
                'supplier': sellers[6]
            },
            {
                'name': 'Fresh Potatoes',
                'description': 'Fresh potatoes for aloo tikki, samosa filling, and more',
                'category': 'vegetables',
                'price': Decimal('20.00'),
                'unit': 'per kg',
                'available_quantity': 600.0,
                'freshness': 'Fresh',
                'rating': Decimal('4.3'),
                'total_ratings': 15,
                'supplier': sellers[7]
            }
        ]

        for product_data in products_data:
            Product.objects.get_or_create(
                name=product_data['name'],
                supplier=product_data['supplier'],
                defaults=product_data
            )

        # Create sample buyer
        buyer, created = User.objects.get_or_create(
            username='test_buyer',
            defaults={
                'email': 'buyer@test.com',
                'password': make_password('password123'),
                'first_name': 'Test',
                'last_name': 'Buyer',
                'role': 'buyer',
                'phone': '9876543200',
                'location': 'Mumbai',
                'is_verified': True
            }
        )

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )
        self.stdout.write(f'Created {len(sellers)} sellers')
        self.stdout.write(f'Created {len(products_data)} products')
        self.stdout.write('Created 1 test buyer (username: test_buyer, password: password123)') 