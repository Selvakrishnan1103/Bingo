from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics
from .models import Bingogame
from .serializer import BingoSerializer


class RegisterView(generics.CreateAPIView):
    queryset = Bingogame.objects.all()
    serializer_class = BingoSerializer


    @api_view(['POST'])
    def register(request):
        serializer = BingoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User Registered Successfully"}, status=201)
        return Response(serializer.errors, status=400)


class LoginView(generics.GenericAPIView):
    serializer_class = BingoSerializer

    def post(self, request):
        email = request.data.get("Gmail")
        password = request.data.get("password")

        user = Bingogame.authenticate(email=email, password=password)

        if user:
            return Response({"message": "Login Success", "user_id": user.id})
        return Response({"message": "Invalid Credentials"}, status=400)


# Create your views here.
