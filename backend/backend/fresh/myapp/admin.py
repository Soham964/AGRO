from django.contrib import admin
from .models import User, SupplierProfile, VendorProfile, Product, Cart, CartItem, Order, OrderItem, Rating, Coupon, AdminVerification

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'location', 'is_verified', 'date_joined']
    list_filter = ['role', 'is_verified', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']

@admin.register(SupplierProfile)
class SupplierProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'business_name', 'gst_number', 'documents_uploaded']
    list_filter = ['documents_uploaded']
    search_fields = ['business_name', 'user__username']

@admin.register(VendorProfile)
class VendorProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'shop_name', 'daily_budget']
    search_fields = ['shop_name', 'user__username']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'supplier', 'category', 'price', 'unit', 'available_quantity', 'in_stock', 'freshness', 'rating']
    list_filter = ['category', 'freshness', 'in_stock', 'created_at']
    search_fields = ['name', 'description', 'supplier__username']
    readonly_fields = ['rating', 'total_ratings', 'created_at', 'updated_at']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'item_count', 'total', 'created_at']
    readonly_fields = ['created_at', 'updated_at']

    def item_count(self, obj):
        return obj.items.count()
    item_count.short_description = 'Items'

    def total(self, obj):
        return obj.get_total()
    total.short_description = 'Total'

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'quantity', 'total']
    readonly_fields = ['added_at']

    def total(self, obj):
        return obj.get_total()
    total.short_description = 'Total'

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'buyer', 'seller', 'total_amount', 'status', 'order_date']
    list_filter = ['status', 'order_date']
    search_fields = ['buyer__username', 'seller__username']
    readonly_fields = ['order_date']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'price_at_order_time', 'total']
    readonly_fields = ['price_at_order_time']

    def total(self, obj):
        return obj.quantity * obj.price_at_order_time
    total.short_description = 'Total'

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ['buyer', 'seller', 'product', 'stars', 'created_at']
    list_filter = ['stars', 'created_at']
    search_fields = ['buyer__username', 'seller__username', 'product__name']
    readonly_fields = ['created_at']

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount', 'valid_from', 'valid_to', 'active']
    list_filter = ['active', 'valid_from', 'valid_to']
    search_fields = ['code']

@admin.register(AdminVerification)
class AdminVerificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'approved', 'reviewed_by', 'reviewed_at']
    list_filter = ['approved', 'reviewed_at']
    search_fields = ['user__username', 'reviewed_by__username']
    readonly_fields = ['reviewed_at']
