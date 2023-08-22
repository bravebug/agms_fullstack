from django.db import models


class TblRoads(models.Model):
    id = models.IntegerField(primary_key=True)
    road_code = models.IntegerField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    length_km = models.FloatField(blank=True, null=True)
    geomtype = models.TextField(blank=True, null=True)
    coordinates = models.JSONField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roads'


class TblAzs(models.Model):
    id = models.IntegerField(primary_key=True)
    road_code = models.IntegerField(blank=True, null=True)
    geomtype = models.TextField(blank=True, null=True)
    coordinates = models.JSONField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'azs'
