from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Role, Category, Transaction, Budget, Forecast, UserProfile
from .serializers import (
    RoleSerializer, CategorySerializer, TransactionSerializer,
    BudgetSerializer, ForecastSerializer, UserProfileSerializer
)

# role viewset allowed for admin user only
class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAdminUser]

#category viewset
# no permission needed
# can be searched by name and description
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

# budget viewset
class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]        # filters
    search_fields = ['category__name', 'start_date','end_date']             # search budget by category, by start and end date
    ordering_fields = ['category__name','start_date','end_date', 'amount']  # order budgets by start date,end date, amount
    ordering = ['start_date']                                               # Default ordering by budget starting date
    permission_classes = [IsAuthenticatedOrReadOnly]                        

# budget viewset
class TransactionsViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]        #filters
    search_fields = ['category__name', 'note', 'client']           # search transactions by category, by note and name
    ordering_fields = ['date', 'amount', 'type', 'completed']      # order transactions by date, amount,type(income,expense),complete status
    filterset_fields = ['type', 'completed', 'category__name']     # filter transactions by type(income,expense),complete status,category
    permission_classes = [IsAuthenticatedOrReadOnly]                        

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])                         # return summary of last month's transactions (income, expense)
    def summary(self, request):
        today = timezone.now().date()
        last_month = today - timedelta(days=30)
        
        transactions = self.get_queryset().filter(date__gte=last_month)           # last month Transaction
        completed_transactions = transactions.filter(completed=True)             # Completed (Income, Expense)
        pending_transactions = transactions.filter(completed=False)              # Incomplete (Receivable , Payable)                 
        
        income = completed_transactions.filter(type='income').aggregate(total=Sum('amount'))
        expenses = completed_transactions.filter(type='expense').aggregate(total=Sum('amount'))
        pending_income = pending_transactions.filter(type='income').aggregate(total=Sum('amount'))
        pending_expenses = pending_transactions.filter(type='expense').aggregate(total=Sum('amount'))
        
        return Response({
            'completed': {
                'total_income': income['total'] or 0,
                'total_expenses': expenses['total'] or 0,
                'net_amount': (income['total'] or 0) - (expenses['total'] or 0)
            },
            'pending': {
                'total_income': pending_income['total'] or 0,
                'total_expenses': pending_expenses['total'] or 0,
                'net_amount': (pending_income['total'] or 0) - (pending_expenses['total'] or 0)
            }
        })   

class ForecastViewSet(viewsets.ModelViewSet):
    queryset = Forecast.objects.all()
    serializer_class = ForecastSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]         #filters
    search_fields = ['forecast_date', 'opening_balance', 'closing_balance']  # search forecasts by date,balance (opening, closing)
    ordering_fields = ['forecast_date','opening_balance', 'closing_balance', 'cash_in', 'cash_out'] # order transactions by balance and cash
    filterset_fields = ['forecast_date']                                        #  filter class
    search_fields = ['cash_in','cash_out']                                      # Fields to search
    ordering_fields = ['forecast_date', 'opening_balance','closing_balance']    # Fields to order by
    ordering = ['forecast_date']
    permission_classes = [IsAuthenticatedOrReadOnly]                        
    
class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)