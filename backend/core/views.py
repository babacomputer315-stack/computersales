from django.http import JsonResponse
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    return JsonResponse({'status':'ok','service':'computersales-django-api','timestamp':timezone.now().isoformat()})

@api_view(['GET'])
@permission_classes([AllowAny])
def migration_status(request):
    return JsonResponse({
      'status':'migration-in-progress',
      'note':'Health endpoint is implemented. Business API parity is not yet complete; do not connect this API to production traffic.',
      'source_api_prefixes':['/api/admin','/api/auth','/api/user','/list','/torob'],
    })
