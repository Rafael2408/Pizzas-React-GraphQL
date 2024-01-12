const { ApolloServer } = require('apollo-server')
const { fileLoader, mergeTypes} = require('merge-graphql-schemas')
const resolvers = require('./controllers/pizza.controller')

const typeDefs = mergeTypes(fileLoader('./type-system/schema.graphql'))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    cors: {
        origin: function (origin, callback) {
            callback(null, true)
        },
        credentials: true
    }
})

server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server running in the URL: ${url}`)
})