from django.shortcuts import render
from django.http import JsonResponse
from .models import TblAzs, TblRoads


def get_roads(request):
    features = []
    for road in TblRoads.objects.all():
        feature = {
            "type": "Feature",
            "properties": {
                "road_code": road.road_code,
                "name": road.name,
                "length_km": road.length_km,
            },
            "geometry": {
                "coordinates": road.coordinates,
                "type": road.geomtype,
            },
        }
        features.append(feature)
    data = {
        "type": "FeatureCollection",
        "features": features,
    }
    response = JsonResponse(
        data
    )
    return response


def get_gas_stations(request, road_code):
    if road_code:
        features = []
        for azs in TblAzs.objects.filter(road_code=road_code):
            feature = {
                "type": "Feature",
                "properties": {
                    "parent_road_code": azs.road_code,
                    "name": "АЗС",
                },
                "geometry": {
                    "coordinates": azs.coordinates,
                    "type": azs.geomtype,
                },
            }
            features.append(feature)
    data = {
        "type": "FeatureCollection",
        "features": features,
    }
    response = JsonResponse(
        data
    )
    return response


def index(request):
    return render(request, "roads/index.html")
