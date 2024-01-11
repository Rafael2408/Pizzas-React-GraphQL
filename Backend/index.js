const { ApolloServer } = require('apollo-server')
const { fileLoader, mergeTypes,  } = require('merge-graphql-schemas')

const typeDefs = mergeTypes(fileLoader('./type-system/schema.graphql'))
const resolvers = require('./controllers/pizza.controller')

const whitelist = ['http://localhost:5173', 'https://studio.apollographql.com']; // Lista de orígenes permitidos

const server = new ApolloServer({
    typeDefs,
    resolvers,
    cors: {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        credentials: true
    }
})

server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server running in the URL: ${url}`)
})