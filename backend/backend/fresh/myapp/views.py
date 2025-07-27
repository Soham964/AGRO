from django.shortcuts import render
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db.models import Q
from .models import User, SupplierProfile, VendorProfile, Coupon, Product, Cart, CartItem, Order, OrderItem, Rating, AdminVerification
from .serializers import (
    UserSerializer, UserRegistrationSerializer, SupplierProfileSerializer, VendorProfileSerializer, 
    CouponSerializer, ProductSerializer, CartSerializer, CartItemSerializer, OrderSerializer, 
    OrderItemSerializer, RatingSerializer, AdminVerificationSerializer
)

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class SupplierProfileViewSet(viewsets.ModelViewSet):
    queryset = SupplierProfile.objects.all()
    serializer_class = SupplierProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class VendorProfileViewSet(viewsets.ModelViewSet):
    queryset = VendorProfile.objects.all()
    serializer_class = VendorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category']
    ordering_fields = ['price', 'rating', 'created_at']

    @action(detail=False, methods=['get'])
    def categories(self, request):
        categories = Product.CATEGORY_CHOICES
        return Response([{'value': cat[0], 'label': cat[1]} for cat in categories])

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        category = request.query_params.get('category', '')
        sort_by = request.query_params.get('sort', 'name')
        
        queryset = self.queryset
        
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) | 
                Q(description__icontains=query) |
                Q(category__icontains=query)
            )
        
        if category and category != 'all':
            queryset = queryset.filter(category=category)
        
        # Apply sorting
        if sort_by == 'price-low':
            queryset = queryset.order_by('price')
        elif sort_by == 'price-high':
            queryset = queryset.order_by('-price')
        elif sort_by == 'rating':
            queryset = queryset.order_by('-rating')
        elif sort_by == 'freshness':
            freshness_order = {'Very Fresh': 3, 'Fresh': 2, 'Good': 1}
            queryset = sorted(queryset, key=lambda x: freshness_order.get(x.freshness, 0), reverse=True)
        else:
            queryset = queryset.order_by('name')
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, 
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['put'])
    def update_item(self, request):
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if quantity <= 0:
            cart_item.delete()
        else:
            cart_item.quantity = quantity
            cart_item.save()
        
        cart = Cart.objects.get(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        item_id = request.query_params.get('item_id')
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
            cart_item.delete()
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        cart = Cart.objects.get(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def clear_cart(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'buyer':
            return Order.objects.filter(buyer=user)
        elif user.role == 'seller':
            return Order.objects.filter(seller=user)
        return Order.objects.none()

    @action(detail=False, methods=['post'])
    def create_from_cart(self, request):
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Group items by seller
        seller_items = {}
        for item in cart.items.all():
            seller = item.product.supplier
            if seller not in seller_items:
                seller_items[seller] = []
            seller_items[seller].append(item)
        
        orders = []
        for seller, items in seller_items.items():
            total_amount = sum(item.get_total() for item in items)
            
            order = Order.objects.create(
                buyer=request.user,
                seller=seller,
                total_amount=total_amount,
                delivery_address=request.data.get('delivery_address', '')
            )
            
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price_at_order_time=item.product.price
                )
            
            orders.append(order)
        
        # Clear cart
        cart.items.all().delete()
        
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

class AdminVerificationViewSet(viewsets.ModelViewSet):
    queryset = AdminVerification.objects.all()
    serializer_class = AdminVerificationSerializer
    permission_classes = [permissions.IsAuthenticated]
