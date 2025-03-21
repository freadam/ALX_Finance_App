from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .auth import CustomAuthToken, SignupView

router = DefaultRouter()
router.register(r'roles', views.RoleViewSet, basename='role')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'transactions', views.TransactionsViewSet, basename='transaction')
router.register(r'budgets', views.BudgetViewSet, basename='budget')
router.register(r'forecasts', views.ForecastViewSet, basename='forecast')
router.register(r'profiles', views.UserProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', CustomAuthToken.as_view(), name='auth_token'),
    path('auth/signup/', SignupView.as_view(), name='auth_signup'),
]
