from django.contrib import admin
from django.urls import path, include
from core.views import health, migration_status

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health, name='health'),
    path('api/migration-status/', migration_status, name='migration-status'),
    path('api/', include('core.urls')),
]
