from rest_framework import serializers
from decimal import Decimal
from django.contrib.auth.models import User
from .models import Category, Role, Budget, Transaction, Forecast, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)
        
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
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
        
    def validate(self, data):
        if len(data['name']) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters long.")
        return data
        
class BudgetCategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    class Meta:
        model = Budget
        fields = ['id','user', 'category', 'amount', 'start_date','end_date']
        read_only_fields = ('id', 'created_at', 'updated_at')

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['user', 'category', 'amount', 'start_date','end_date']
        read_only_fields = ('id', 'created_at', 'updated_at')

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
        
    def validate_amount(self, value):
        if not isinstance(value, Decimal):
            raise serializers.ValidationError("Amount must be a decimal number.")
        
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        
        return value
   
class TransactionCategoryUserSerializer(serializers.ModelSerializer):
    category = CategorySerializer() #nested serializer
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
        


    
class ForecastSerializer(serializers.Serializer):
    user = UserSerializer(read_only=True)  # nested serializer
    class Meta:
        model = Forecast
        fields = ['user', 'opening_balance', 'cash_in', 'cash_out','closing_balance','start_date','end_date']
        read_only_fields = ('id', 'created_at', 'updated_at')

      
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    role = RoleSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')