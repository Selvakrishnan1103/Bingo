from django.contrib import admin
from .models import Bingogame

class Bingo(admin.ModelAdmin):
    list_display = ('Name', 'Gmail', 'password')

admin.site.register(Bingogame, Bingo)

