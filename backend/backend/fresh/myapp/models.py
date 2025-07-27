from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = (
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15, unique=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    aadhar_number = models.CharField(max_length=12, blank=True, null=True)
    aadhar_card_image = models.ImageField(upload_to='aadhar_cards/', blank=True, null=True)
    trade_license_number = models.CharField(max_length=50, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )


class SupplierProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=255)
    gst_number = models.CharField(max_length=20, blank=True)
    documents_uploaded = models.BooleanField(default=False)

class VendorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    shop_name = models.CharField(max_length=255)
    daily_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True, db_index=True)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    discount = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    active = models.BooleanField()

    def __str__(self):
        return self.code
    

class Product(models.Model):
    CATEGORY_CHOICES = (
        ('spices', 'Spices'),
        ('oils', 'Oils'),
        ('flours', 'Flours'),
        ('vegetables', 'Vegetables'),
        ('grains', 'Grains'),
    )
    
    FRESHNESS_CHOICES = (
        ('Very Fresh', 'Very Fresh'),
        ('Fresh', 'Fresh'),
        ('Good', 'Good'),
    )
    
    supplier = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'seller'})
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, default="per kg")  # per kg, per liter, etc.
    available_quantity = models.FloatField()
    in_stock = models.BooleanField(default=True)
    freshness = models.CharField(max_length=20, choices=FRESHNESS_CHOICES, default='Fresh')
    image = models.URLField(blank=True, null=True)  # URL to product image
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_ratings = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'buyer'})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_total(self):
        return sum(item.get_total() for item in self.items.all())

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def get_total(self):
        return self.product.price * self.quantity

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled')
    )
    
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'buyer'})
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders_received', limit_choices_to={'role': 'seller'})
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    order_date = models.DateTimeField(auto_now_add=True)
    delivery_eta = models.DateTimeField(null=True, blank=True)
    delivery_address = models.TextField(blank=True)

    def __str__(self):
        return f"Order {self.id} by {self.buyer.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.FloatField()
    price_at_order_time = models.DecimalField(max_digits=10, decimal_places=2)

class Rating(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'buyer'}, related_name='ratings_given')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'seller'}, related_name='ratings_received')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_ratings')
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    stars = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])  # 1 to 5
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update product rating
        product_ratings = Rating.objects.filter(product=self.product)
        avg_rating = product_ratings.aggregate(models.Avg('stars'))['stars__avg']
        self.product.rating = round(avg_rating, 2) if avg_rating else 0.00
        self.product.total_ratings = product_ratings.count()
        self.product.save()


class AdminVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    approved = models.BooleanField(default=False)
    rejection_reason = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='verifications_done')
    reviewed_at = models.DateTimeField(default=timezone.now)
