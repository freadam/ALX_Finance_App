from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

# model category
class Category (models.Model):
    name = models.CharField(max_length=50,unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name
    
# model Role
# user roles
class Role (models.Model):
    name = models.CharField(max_length=50,unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

# model Budget
# max amount of money allowed to be spent within the start date and end date for a given category
class Budget (models.Model):
    user = models.ForeignKey(User,null=True,on_delete=models.SET_NULL)
    category = models.ForeignKey(Category,on_delete=models.CASCADE) # if category is deleted there is no reason for assigning budget for that category
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.category.name} Budget: {self.amount}'

# model Transaction
#amount of money transfered in and out for a given category on a given date
class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
        
    user = models.ForeignKey(User,null=True,on_delete=models.SET_NULL) # evenif the user is deleted the transaction is not deleted
    category = models.ForeignKey(Category,on_delete=models.PROTECT) #can delete categories without deleting transactions
    amount = models.DecimalField(max_digits=15,decimal_places=2,validators=[MinValueValidator(0)])
    type = models.CharField(max_length=7, choices=TRANSACTION_TYPES)
    date = models.DateField()
    client = models.CharField(max_length=50,null=True)
    note = models.TextField(null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Transaction : {self.amount} type:{self.type.title()} under category {self.category.name}'

# model forecast
# forecasted opening and closing balance for a given start and end date
class Forecast(models.Model):
    user = models.ForeignKey(User,null=True,on_delete=models.SET_NULL)  # evenif the user is deleted the forecast is not deleted
    opening_balance = models.DecimalField(max_digits=15,decimal_places=2)
    cash_in = models.DecimalField(max_digits=15,decimal_places=2)
    cash_out =models.DecimalField(max_digits=15,decimal_places=2)
    projected_expense = models.DecimalField(max_digits=15,decimal_places=2)
    closing_balance = models.DecimalField(max_digits=15,decimal_places=2)
    forecast_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'forecast for {self.forecast_date} - {self.opening_balance} to {self.closing_balance}'

# model UserProfile
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username} with role {self.role.name}'
