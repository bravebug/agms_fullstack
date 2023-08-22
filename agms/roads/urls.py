from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="roads_main"),
    path("roads.json", views.get_roads, name="roads"),
    path("stations/<int:road_code>.json", views.get_gas_stations),
]
