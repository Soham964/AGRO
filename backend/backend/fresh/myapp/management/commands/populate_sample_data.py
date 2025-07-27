from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from myapp.models import Product, User
from decimal import Decimal

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create sample users
        try:
            # Create a seller user
            seller, created = User.objects.get_or_create(
                username='farmer_john',
                defaults={
                    'email': 'john@example.com',
                    'first_name': 'John',
                    'last_name': 'Farmer',
                    'phone': '9876543210',
                    'role': 'seller',
                    'location': 'Mumbai, Maharashtra',
                    'is_verified': True
                }
            )
            if created:
                seller.set_password('password123')
                seller.save()
                self.stdout.write(f'Created seller: {seller.username}')

            # Create a buyer user
            buyer, created = User.objects.get_or_create(
                username='vendor_ram',
                defaults={
                    'email': 'ram@example.com',
                    'first_name': 'Ram',
                    'last_name': 'Vendor',
                    'phone': '9876543211',
                    'role': 'buyer',
                    'location': 'Delhi, NCR',
                    'is_verified': True
                }
            )
            if created:
                buyer.set_password('password123')
                buyer.save()
                self.stdout.write(f'Created buyer: {buyer.username}')

        except Exception as e:
            self.stdout.write(f'Error creating users: {e}')

        # Create sample products
        products_data = [
            {
                'name': 'Premium Red Chilli Powder',
                'description': 'High-quality red chilli powder perfect for street food. Made from hand-picked red chillies.',
                'category': 'spices',
                'price': Decimal('120.00'),
                'unit': 'per kg',
                'available_quantity': 50.0,
                'freshness': 'Very Fresh',
                'image': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                'rating': Decimal('4.8'),
                'total_ratings': 45
            },
            {
                'name': 'Pure Mustard Oil',
                'description': 'Cold-pressed mustard oil for authentic street food taste. Rich in flavor and aroma.',
                'category': 'oils',
                'price': Decimal('85.00'),
                'unit': 'per liter',
                'available_quantity': 100.0,
                'freshness': 'Fresh',
                'image': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                'rating': Decimal('4.6'),
                'total_ratings': 32
            },
            {
                'name': 'Whole Wheat Flour',
                'description': 'Freshly ground whole wheat flour for making rotis and breads. High in fiber.',
                'category': 'flours',
                'price': Decimal('45.00'),
                'unit': 'per kg',
                'available_quantity': 200.0,
                'freshness': 'Fresh',
                'image': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                'rating': Decimal('4.7'),
                'total_ratings': 28
            },
            {
                'name': 'Fresh Onions',
                'description': 'Premium quality onions perfect for street food. Sweet and flavorful.',
                'category': 'vegetables',
                'price': Decimal('35.00'),
                'unit': 'per kg',
                'available_quantity': 150.0,
                'freshness': 'Very Fresh',
                'image': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                'rating': Decimal('4.9'),
                'total_ratings': 67
            },
            {
                'name': 'Basmati Rice',
                'description': 'Premium long-grain basmati rice. Perfect for biryanis and pulao.',
                'category': 'grains',
                'price': Decimal('95.00'),
                'unit': 'per kg',
                'available_quantity': 80.0,
                'freshness': 'Good',
                'image': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                'rating': Decimal('4.5'),
                'total_ratings': 23
            },
            {
                'name': 'Garam Masala',
                'description': 'Traditional garam masala blend. Essential for authentic Indian street food.',
                'category': 'spices',
                'price': Decimal('180.00'),
                'unit': 'per kg',
                'available_quantity': 25.0,
                'freshness': 'Very Fresh',
                'image': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                'rating': Decimal('4.8'),
                'total_ratings': 41
            },
            {
                'name': 'Sesame Oil',
                'description': 'Pure sesame oil for authentic taste. Rich in antioxidants.',
                'category': 'oils',
                'price': Decimal('120.00'),
                'unit': 'per liter',
                'available_quantity': 60.0,
                'freshness': 'Fresh',
                'image': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                'rating': Decimal('4.4'),
                'total_ratings': 19
            },
            {
                'name': 'Fresh Tomatoes',
                'description': 'Ripe and juicy tomatoes perfect for chutneys and gravies.',
                'category': 'vegetables',
                'price': Decimal('40.00'),
                'unit': 'per kg',
                'available_quantity': 120.0,
                'freshness': 'Very Fresh',
                'image': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                'rating': Decimal('4.6'),
                'total_ratings': 34
            }
        ]

        for product_data in products_data:
            try:
                product, created = Product.objects.get_or_create(
                    name=product_data['name'],
                    supplier=seller,
                    defaults=product_data
                )
                if created:
                    self.stdout.write(f'Created product: {product.name}')
            except Exception as e:
                self.stdout.write(f'Error creating product {product_data["name"]}: {e}')

        self.stdout.write(
            self.style.SUCCESS('Successfully populated sample data!')
        )
        self.stdout.write('Sample users created:')
        self.stdout.write('- Seller: farmer_john (password: password123)')
        self.stdout.write('- Buyer: vendor_ram (password: password123)')
        self.stdout.write('Sample products created: 8 products') 