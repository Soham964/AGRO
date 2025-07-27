from rest_framework import serializers
from .models import User, SupplierProfile, VendorProfile, Coupon, Product, Cart, CartItem, Order, OrderItem, Rating, AdminVerification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'location', 'is_verified', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'confirm_password', 'first_name', 'last_name', 
            'role', 'phone', 'location', 'address', 'aadhar_number', 'aadhar_card_image', 
            'trade_license_number'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user

class SupplierProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = SupplierProfile
        fields = '__all__'

class VendorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = VendorProfile
        fields = '__all__'

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.username', read_only=True)
    supplier_business = serializers.CharField(source='supplier.supplierprofile.business_name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'category', 'price', 'unit', 
            'available_quantity', 'in_stock', 'freshness', 'image', 
            'rating', 'total_ratings', 'supplier', 'supplier_name', 
            'supplier_business', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'rating', 'total_ratings', 'created_at', 'updated_at']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total', 'added_at']
        read_only_fields = ['id', 'added_at']

    def get_total(self, obj):
        return obj.get_total()

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total', 'item_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_total(self, obj):
        return obj.get_total()

    def get_item_count(self, obj):
        return obj.items.count()

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price_at_order_time', 'total']
        read_only_fields = ['id', 'price_at_order_time']

    def get_total(self, obj):
        return obj.quantity * obj.price_at_order_time

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'buyer_name', 'seller', 'seller_name', 
            'total_amount', 'status', 'order_date', 'delivery_eta', 
            'delivery_address', 'items'
        ]
        read_only_fields = ['id', 'order_date']

class RatingSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = Rating
        fields = [
            'id', 'buyer', 'buyer_name', 'seller', 'seller_name', 
            'product', 'product_name', 'order', 'stars', 'feedback', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class AdminVerificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.username', read_only=True)
    
    class Meta:
        model = AdminVerification
        fields = [
            'id', 'user', 'approved', 'rejection_reason', 
            'reviewed_by', 'reviewed_by_name', 'reviewed_at'
        ]
        read_only_fields = ['id', 'reviewed_at']
