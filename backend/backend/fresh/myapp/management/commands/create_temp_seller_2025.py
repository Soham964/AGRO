from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from myapp.models import User, SupplierProfile

class Command(BaseCommand):
    help = 'Create a new temporary seller account for frontend testing.'

    def handle(self, *args, **options):
        username = 'tempseller2025'
        password = 'tempdemo2025'
        email = 'tempseller2025@example.com'
        first_name = 'Temp'
        last_name = 'Seller2025'
        role = 'seller'
        phone = '8888888888'
        location = 'DemoCity'
        business_name = 'Temporary Seller 2025'

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'password': make_password(password),
                'first_name': first_name,
                'last_name': last_name,
                'role': role,
                'phone': phone,
                'location': location,
                'is_verified': True
            }
        )
        if created:
            SupplierProfile.objects.create(
                user=user,
                business_name=business_name,
                gst_number='GSTTEMP2025',
                documents_uploaded=True
            )
            self.stdout.write(self.style.SUCCESS(f"Temporary seller '{username}' created with password '{password}'"))
        else:
            self.stdout.write(self.style.WARNING(f"Seller '{username}' already exists."))
