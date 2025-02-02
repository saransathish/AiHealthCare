from django.urls import path
from .views import UserRegistrationView, CustomTokenObtainPairView , UserDetailsView ,gather

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('user/', UserDetailsView.as_view(), name='user-details'),
    path('user/gather/', gather, name='gather'),

] 