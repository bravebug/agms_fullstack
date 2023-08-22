from django.urls import include, path
from . import views

urlpatterns = [
    path("", views.total_redirect_from_main, name="roads"),
    path("roads/", include("roads.urls")),
]
