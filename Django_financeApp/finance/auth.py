from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers, status, generics
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': ['Passwords do not match.']
            })
        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({
                'password': list(e.messages)
            })
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        try:
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password']
            )
            return user
        except Exception as e:
            raise serializers.ValidationError({
                'error': ['Failed to create user. Please try again.']
            })

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        try:
            serializer = self.serializer_class(data=request.data,
                                             context={'request': request})
            if not serializer.is_valid():
                return Response({
                    'error': 'Invalid credentials.',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            
            response_data = {
                'token': token.key,
                'user': UserSerializer(user).data
            }
            
            return Response(response_data)
            
        except Exception as e:
            return Response({
                'error': 'Authentication failed.',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = SignupSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'error': 'Invalid registration data.',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            
            response_data = {
                'token': token.key,
                'user': UserSerializer(user).data,
                'message': 'Registration successful.'
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except serializers.ValidationError as e:
            return Response({
                'error': 'Validation failed.',
                'details': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'error': 'Registration failed.',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
