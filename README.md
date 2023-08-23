# Тестовое задание fullstack

Проект развёрнут по адресу: https://io.org.ru/roads/

Из ограничений к сайту Leaflet, как к первоисточнику документации, была использована библиотека OpenLayers.

Несжатую версию [main.js](https://github.com/bravebug/agms_fullstack/blob/main/main.js) (OpenLayers) вложил в корень проекта

django и OpenLayers использованы последних версий.

Т.к. django orm не поддерживает работу с моделями без PRIMARY KEY пришлось их добавить при копировании таблиц:

	CREATE TABLE "roads" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "road_code" integer, "name" text, "length_km" numeric, "geomtype" text, "coordinates" text);
	INSERT INTO  "roads" ("road_code", "name", "length_km", "geomtype", "coordinates")
	SELECT "road_code", "name", "length_km", "geomtype", "coordinates"
	FROM "tbl_roads";

	CREATE TABLE "azs" ("id" INTEGER PRIMARY KEY 	AUTOINCREMENT, "road_code" integer, "geomtype" text, "coordinates" text);
	INSERT INTO  "azs" ("road_code", "geomtype", "coordinates")
	SELECT "road_code", "geomtype", "coordinates"
	FROM "tbl_azs";