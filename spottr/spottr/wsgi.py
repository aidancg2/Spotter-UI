"""WSGI config for Spottr project."""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'spottr.settings')
application = get_wsgi_application()
