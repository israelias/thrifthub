import graphene
import graphql_jwt

# from django.contrib.auth.models import User
from .models import User
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "email")


class Query(graphene.ObjectType):
    user_details = graphene.Field(UserType)
    # user_details = graphene.List(UserType)

    def resolve_user_details(root, info, **kwargs) -> User:
        """
        The resolve_user_details function is a resolver function that returns the user details of the currently logged in user.
        It takes three arguments: root, info, and **kwargs. The root argument is required by all resolve functions and contains data about the query itself;
        the info argument contains information about the execution state of a query (e.g., which field is being resolved);
        and kwargs are any additional keyword arguments passed to GraphQL’s execute method.

        Args:
            root: Represent the root of the graphql
            info: Get access to the context of the request
            **kwargs: Accept any additional arguments that may be passed to the field

        Returns:
            The user object for the logged in user
        """
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return User.objects.get(username=user)


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
