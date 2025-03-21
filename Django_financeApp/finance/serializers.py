from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Role, Budget, Transaction, Forecast, UserProfile


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
        
    def validate(self, data):
        if len(data['name']) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters long.")
        return data

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['name']
        read_only_fields = ('id', 'created_at', 'updated_at')
        
    def validate(self, data):
        if len(data['name']) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters long.")
        return data
        
class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['user', 'category', 'amount', 'start_date','end_date']
        read_only_fields = ('id', 'created_at', 'updated_at')

    
class TransactionSerializer(serializers.Serializer):
    class Meta:
        model = Transaction
        fields = ['user', 'category', 'amount', 'type','date','client','note','completed']
        read_only_fields = ('id', 'created_at', 'updated_at')
        
    def validate_amount(self, data):
        if data['amount'] <=0:
            raise serializers.ValidationError('transaction amount must be greater than 0.')
        return data

class ForecastSerializer(serializers.Serializer):
    class Meta:
        model = Forecast
        fields = ['user', 'opening_balance', 'cash_in', 'cash_out','projected_income','projected_expense','closing_balance','forecast_date']
        read_only_fields = ('id', 'created_at', 'updated_at')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)
        
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    role = RoleSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')