from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class Bingogame(models.Model):
    Name = models.CharField(max_length=100)
    Gmail = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    @classmethod
    def authenticate(cls, email, password):
        try:
            user = cls.objects.get(Gmail=email)
        except cls.DoesNotExist:
            return None
        
        if user.check_password(password):
            return user
        return None



