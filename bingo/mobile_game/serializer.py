from rest_framework import serializers
from .models import Bingogame

class BingoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bingogame
        fields = ['id', 'Name', 'Gmail', 'password']
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        user = Bingogame(
            Name=validated_data['Name'],
            Gmail=validated_data['Gmail']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
