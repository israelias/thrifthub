import account.schema
import graphene
import store.schema

# Point to app schemas to access from core


class Query(store.schema.Query, account.schema.Query, graphene.ObjectType):
    pass


class Mutation(account.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
