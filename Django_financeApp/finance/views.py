from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db import models
from django.db.models import Q, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Role, Category, Transaction, Budget, Forecast, UserProfile
from .serializers import (
    RoleSerializer, CategorySerializer, TransactionSerializer,TransactionCategoryUserSerializer,BudgetCategorySerializer,
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
    
    def get_serializer_class(self):
        # Use more detailed info for read actions (list and retrieve)
        if self.action in ['list', 'retrieve']:
            return BudgetCategorySerializer
         # use id only for write actions (create, update, etc.)
        return BudgetSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    # returns percentage of budget used from amount planned
    @action(detail=True, methods=['get'])
    def progress(self, request, pk=None):
        budget = self.get_object()
        actual_expenses = Transaction.objects.filter(
            user=request.user,
            category=budget.category,
            type='expense',
            date__range=[budget.start_date, budget.end_date]
        ).aggregate(total=Sum('amount'))

        total_spent = actual_expenses['total'] or 0
        return Response({
            'budget_amount': budget.amount,
            'amount_spent': total_spent,
            'amount_remaining': budget.amount - total_spent,
            'percentage_used': (total_spent / budget.amount) * 100 if budget.amount > 0 else 0
        })                        

# Transaction viewset
class TransactionsViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]        #filters
    search_fields = ['category__name', 'note', 'client']           # search transactions by category, by note and name
    ordering_fields = ['date', 'amount', 'type', 'completed']      # order transactions by date, amount,type(income,expense),complete status
    filterset_fields = ['type', 'completed', 'category__name']     # filter transactions by type(income,expense),complete status,category
    permission_classes = [IsAuthenticatedOrReadOnly]                        

    def get_serializer_class(self):
    # for read actions (list and retrieve)
        if self.action in ['list', 'retrieve']:
            return TransactionCategoryUserSerializer
        # use id only for write actions (create, update, etc.)
        return TransactionSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        today = timezone.now().date()
        last_month = today - timedelta(days=30)
        
        transactions = self.get_queryset().filter(date__gte=last_month)
        completed_transactions = transactions.filter(completed=True)
        pending_transactions = transactions.filter(completed=False)
        
        income = completed_transactions.filter(type='income').aggregate(total=Sum('amount')) 
        expenses = completed_transactions.filter(type='expense').aggregate(total=Sum('amount')) 
        pending_income = pending_transactions.filter(type='income').aggregate(total=Sum('amount'))
        pending_expenses = pending_transactions.filter(type='expense').aggregate(total=Sum('amount'))
        avg_monthly_expense = expenses['total'] or 0  # Since we're considering a 30-day window
        net_amount = (income['total'] or 0) - (expenses['total'] or 0)
        burn_rate = net_amount / avg_monthly_expense if avg_monthly_expense > 0 else 1
        return Response({
            'completed': {
                'total_income': income['total'] or 0,
                'total_expenses': expenses['total'] or 0,
                'net_amount': (income['total'] or 0) - (expenses['total'] or 0),
                'burn_rate': burn_rate or 0
            },
            'pending': {
                'total_income': pending_income['total'] or 0,
                'total_expenses': pending_expenses['total'] or 0,
                'net_amount': (pending_income['total'] or 0) - (pending_expenses['total'] or 0)
            }
        })  

# forecast viewset
class ForecastViewSet(viewsets.ModelViewSet):
    queryset = Forecast.objects.all()
    serializer_class = ForecastSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]         #filters
    search_fields = ['start_date', 'opening_balance', 'closing_balance']  # search forecasts by date,balance (opening, closing)
    ordering_fields = ['start_date','opening_balance', 'closing_balance', 'cash_in', 'cash_out'] # order transactions by balance and cash
    filterset_fields = ['start_date']                                        #  filter class
    search_fields = ['cash_in','cash_out']                                      # Fields to search
    ordering_fields = ['start_date', 'opening_balance','closing_balance']    # Fields to order by
    ordering = ['start_date']
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # returns 13weeks projection based past data
    @action(detail=False, methods=['get'])
    def summary13week(self, request):
        current_date = timezone.now().date()
        user = request.user

        # Calculate initial closing balance from completed transactions
        income_expense = Transaction.objects.filter(
            user=user,
            date__lte=current_date,
            completed=True
        ).aggregate(
            income=Coalesce(Sum('amount', filter=Q(type='income')), Value(0, output_field=models.DecimalField())),
            expense=Coalesce(Sum('amount', filter=Q(type='expense')), Value(0, output_field=models.DecimalField()))
        )
        initial_closing = income_expense['income'] - income_expense['expense']

        # Calculate weekly average expense
        thirty_days_ago = current_date - timedelta(days=30)
        avg_monthly_expense = Transaction.objects.filter(
            user=user,
            date__gte=thirty_days_ago,
            type='expense',
            completed=True
        ).aggregate(total=Coalesce(Sum('amount'), Value(0, output_field=models.DecimalField())))['total']
        weekly_avg_expense = (avg_monthly_expense / 30) * 7 if avg_monthly_expense else 0

        
        projection = []
        current_closing_balance = initial_closing

        for week_num in range(13):
            week_start = current_date + timedelta(weeks=week_num)
            week_end = week_start + timedelta(days=6)

            # Get pending transactions
            aggregates = Transaction.objects.filter(
                user=user,
                date__range=[week_start, week_end],
                completed=False
            ).aggregate(
                cash_in=Coalesce(Sum('amount', filter=Q(type='income')), Value(0, output_field=models.DecimalField())),
                cash_out_pending=Coalesce(Sum('amount', filter=Q(type='expense')), Value(0, output_field=models.DecimalField()))
            )

            cash_in = aggregates['cash_in']
            cash_out = aggregates['cash_out_pending'] + weekly_avg_expense
            net_cash = cash_in - cash_out
            opening = current_closing_balance
            closing = opening + net_cash

            projection.append({
                'week': week_num + 1,
                'opening_balance': float(opening),
                'cash_in': float(cash_in),
                'cash_out': float(cash_out),
                'closing_balance': float(closing),
                'week_start': week_start,
                'week_end': week_end,
            })

            current_closing_balance = closing


        return Response(projection)
# User Profile   
class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)