from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'supplier-profiles', views.SupplierProfileViewSet)
router.register(r'vendor-profiles', views.VendorProfileViewSet)
router.register(r'coupons', views.CouponViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'carts', views.CartViewSet, basename='cart')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'order-items', views.OrderItemViewSet)
router.register(r'ratings', views.RatingViewSet)
router.register(r'admin-verifications', views.AdminVerificationViewSet)
router.register(r'otp', views.OTPViewSet, basename='otp')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/token/', obtain_auth_token, name='api_token_auth'),
] 