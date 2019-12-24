+++
title = "From REST to GraphQL"
date = 2015-10-09T00:00:00Z
slug = "/from-rest-to-graphql-b4e95e94c26b"
category = "Tech"
tags = ["JavaScript", "GraphQL", "React"]
description = "Exploring the transition from REST APIs to GraphQL at Playlist..."
+++

![](/images/from-rest-to-graphql-1.jpg)

**Disclaimer:** GraphQL is still new and best practices are still emerging. This post describes some of my journey with implementing a GraphQL backend service, so it is a snapshot of what I've learned so far, presented in the hopes that it will be useful to others. Also, some of the specific real-world implementation details internal to Playlist have been paraphrased / simplified / anonymized for obvious reasons.

This post assumes a basic familiarity with GraphQL.

> See also: [https://code.fb.com/core-data/graphql-a-data-query-language/](https://code.fb.com/core-data/graphql-a-data-query-language/)

---

## REST

At Playlist, we have a Rails / REST-based API that powers the app. When it was created initially, we used Github's V3 API as an inspiration and generally modeled our API structure after theirs.

Need track information?

```
GET /tracks/ID
```

Need to fetch a playlist?

```
GET /playlists/ID
```

Need a playlist's tracks?

```
GET /playlists/ID/tracks
```

It had the benefit of simplicity - endpoints are intuitively named and can be browsed easily. Initially we even implemented URL properties on all objects so the API was browsable just by clicking (this was eventually removed in favor of smaller response payloads). Documentation described what was returned by each endpoint so our mobile team could easily integrate.

### Bloat and Slowdowns

However, as time passed, payloads got larger as requirements grew. As an example, here is a simplistic playlist object response:

```json
{
  "created_at": "2015-08-30T00:50:25.000+00:00",
  "id": "e66637db-13f9-4056-abef-f731f8b1a3c7",
  "like_count": 3,
  "liked_count": 3,
  "name": "Excuse me while I kiss these frets",
  "owner": {
    "avatar_url": "https://secure.gravatar.com/avatar/4ede0ad35bb796ea8f78861acc4372ca?s=300",
    "bio": null,
    "id": "b06e671a-b169-45e6-a645-74c31abca910",
    "login": "playlistrock",
    "name": "Playlist Rock",
    "site_admin": false
  },
  "published": false,
  "saved_count": 3,
  "track_count": 50,
  "updated_at": "2015-09-30T06:11:49.000+00:00"
}
```

It contains all the basic information about the playlist, but (almost) none of the associated objects. As a client, you would be expected to call other endpoints like `/playlist/ID/tracks` to fetch sub-resources.

As more associations were added, more data kept getting stuffed into the playlist response. Specifically, because we used Rails and ActionView partials, more data was added to the `_playlist.json.jbuilder` partial as lists of playlists needed more and more data.

Mobile requirements would state something like "we need to show the first three tags for each user playlist when displaying a user's profile," so rather than call `/users/USERNAME/playlists`, then have to make an HTTP request to `/playlists/ID/tags` once for each returned playlist, the tags got added to the playlist partial.

```json
{
  "created_at": "2015-08-30T00:50:25.000+00:00",
  "genres": [],
  "id": "e66637db-13f9-4056-abef-f731f8b1a3c7",
  "like_count": 3,
  "liked_count": 3,
  "name": "Excuse me while I kiss these frets",
  "owner": {
    "avatar_url": "https://secure.gravatar.com/avatar/4ede0ad35bb796ea8f78861acc4372ca?s=300",
    "bio": null,
    "id": "b06e671a-b169-45e6-a645-74c31abca910",
    "login": "playlistrock",
    "name": "Playlist Rock",
    "site_admin": false
  },
  "published": false,
  "saved_count": 3,
  "tags": [
    {
      "name": "Jimi Hendrix"
    },
    {
      "name": "Jimmy Page"
    },
    {
      "name": "Eric Clapton"
    },
    {
      "name": "Slash"
    },
    {
      "name": "Stevie Ray Vaughan"
    }
  ],
  "track_count": 50,
  "updated_at": "2015-09-30T06:11:49.000+00:00"
}
```

Eventually, we got to something like the following for a `/playlists/ID` response:

```json
{
  "collaborators": [],
  "created_at": "2015-08-30T00:50:25.000+00:00",
  "genres": [],
  "id": "e66637db-13f9-4056-abef-f731f8b1a3c7",
  "like_count": 3,
  "liked": true,
  "liked_count": 3,
  "name": "Excuse me while I kiss these frets",
  "owner": {
    "avatar_url": "https://secure.gravatar.com/avatar/4ede0ad35bb796ea8f78861acc4372ca?s=300",
    "bio": null,
    "id": "b06e671a-b169-45e6-a645-74c31abca910",
    "login": "playlistrock",
    "name": "Playlist Rock",
    "site_admin": false
  },
  "published": false,
  "saved": true,
  "saved_count": 3,
  "tags": [
    {
      "name": "Jimi Hendrix"
    },
    {
      "name": "Jimmy Page"
    },
    {
      "name": "Eric Clapton"
    },
    {
      "name": "Slash"
    },
    {
      "name": "Stevie Ray Vaughan"
    }
  ],
  "track_count": 50,
  "tracks": [
    {
      "album": {
        "id": "8d8223c6-284c-4aac-92bd-b31debca3237",
        "title": "Toys In The Attic"
      },
      "artists": [
        {
          "id": "6c29ff27-ad20-4448-9961-f6617e393539",
          "name": "Aerosmith"
        }
      ],
      "explicit": false,
      "have_liked": false,
      "id": "a1f9f37a-2a15-407d-82f8-e742ab5e3b81",
      "title": "Walk This Way"
    },
    {
      "album": {
        "id": "21a9f63b-a38f-40f1-aaf1-8b7ed3ad1a92",
        "title": "Audioslave"
      },
      "artists": [
        {
          "id": "7d600588-d073-41e9-a4f7-434501b16c45",
          "name": "Audioslave"
        }
      ],
      "explicit": false,
      "have_liked": false,
      "id": "4cc1fc43-61e8-49a7-be42-9d7ad35c1284",
      "title": "Like A Stone"
    }
  ],
  "updated_at": "2015-09-30T06:11:49.000+00:00"
}
```

Here we're embedding tracks and even a subset of their associations, with enough data to cover all the _possible_ places an individual playlist could appear. And this data was returned for every place the playlist appeared.

This was a conscious design decision to augment responses rather than add more endpoints - we could have done something like `/playlists/ID/forProfile`, `/playlists/ID/forNotifications`, etc.

![](/images/from-rest-to-graphql-2.jpg)

There is something to be said for the simplicity that provides. To add a field to a track, for example, you locate the `_track.json.jbuilder` partial and add the additional field. However as views grew, performance quickly became an issue in two distinct ways.

**First,** response payloads were large, to the point that the mobile app sometimes struggled with the amount of effort it took to parse, deserialize, and store the JSON. Response times were longer, caches were larger, and every change to a small partial expanded to a much larger change all over the app.

**Second,** query performance took a hit as more and more data (especially relationships) were fetched for each request. In development with caching disabled, a single request for a playlist can request upwards of 170 database queries to pull all the relevant information.

In production, we made heavy use of Rails "Russian Doll" style caching, so for a fully cached playlist there is only one database query involved. Still, on that first load it had to execute those 170 queries to build the full response (usually fewer thanks to Russian doll caching and shared sub-resources).

> See also: [https://edgeguides.rubyonrails.org/caching_with_rails.html#russian-doll-caching](https://edgeguides.rubyonrails.org/caching_with_rails.html#russian-doll-caching)

What pushed us over the edge was the `have_liked` field above. This was a boolean field indicating whether or not the currently authenticated user had liked the track. Product requirements stated that this field had to be accessible on the playlist detail view, and thus had to be included in the playlist response for each track.

This broke the Russian doll caching.

The `_track.json.jbuilder` partial became a combination of a cached portion containing "static" information about the tracks and an uncached portion containing the call to `current_user.have_liked?(track)`. Subsequently, `_playlist.json.jbuilder` and every view that referenced the track partial transformed similarly to contain a cached portion and an uncached portion.

Worse still, for a playlist request with 50 tracks, 50 calls to `have_liked?` were executed (N+1 query bug).

We had several different possible solutions, including separate sub-resource view files for separate endpoints, custom query cache management to reduce the number of additional queries, etc. However, we wanted a solution that addressed both issues and allowed for greater control.

---

## GraphQL

Enter GraphQL. Using GraphQL to power our backend, we were able to provide the mobile client exactly what it needed for each request, with no additional bloat, and were able to optimize the database and cache layer to do everything in an extremely performant way.

Before getting into some of the specific details, here are a few common questions / misconceptions I often encountered or experienced myself while learning about GraphQL:

### Common Questions / Misconceptions

#### GraphQL sounds like graph. Does my data need to be a "graph" or do I need a "graph" database? Does it work with relational databases?

No, you do not need a graph database, it works just fine with whatever database you have.

While IMO you can think about almost any "relational" database in terms of a "graph" - something like:

```
user --- OWNS --- playlist
  |                   |
LIKES              CONTAINS
  |                   |
  v                   |
track <---------------┘
```

GraphQL describes and fetches data like a tree:

```
user
┖-OWNS-> playlist
         ┖-CONTAINS-> track
                      ┖-LIKED_BY-> users
```

You can use a graph database, a relational database, an in-memory array, a key-value store, whatever. At Playlist, we use Neo4j as a "primary" database, operating in full graph mode, and Redis, acting as a cache layer utilizing various different data structures including hashes, key-value pairs, and sets. Redis essentially represents the data in Neo as key-value stores by ID and ZSETs for associations by type, closely mirroring Facebook's TAO model:

> See also: [https://www.facebook.com/notes/facebook-engineering/tao-the-power-of-the-graph/10151525983993920](https://www.facebook.com/notes/facebook-engineering/tao-the-power-of-the-graph/10151525983993920)

This allows us to have an authoritative data source in Neo with the full power of Cypher queries but the performance of an in-memory key-value store for 90% of all queries.

#### GraphQL sounds like "query language" which sounds like I'm exposing the ability to query my database on the client. This sounds dangerous. What about malicious clients?

No, you're not exposing your database queries to the client any more than you were with your REST API. Okay, maybe a bit.

GraphQL is more or less a DSL on top of your own backend data fetching logic. It does not connect directly to a database. In fact, the schema you expose over GraphQL will likely not mirror your database exactly. It provides a way to describe a request for structured data, but it is then up to your backend to fulfill that request.

One concern is that GraphQL supports "nested" fetching, so should a malicious client request a particular recursive nested relationship an arbitrary but large number of times (like user.followers.followers...), there could be a potential performance hit on the backend. See the final section for a few ideas on how to mitigate this risk.

#### So, GraphQL doesn't provide unauthenticated access to my database?

No. Authentication is most likely handled outside of GraphQL entirely and your backend is still responsible for handling data fetching / authorization in a secure way, just like how you were doing before with REST.

For our new GraphQL backend, we perform authentication outside of GraphQL entirely, passing it as a request header and having the server authenticate the request and then pass the authentication context down to the GraphQL data resolvers.

At Playlist, we would eventually like to make our GraphQL backend "transport-agnostic", so we could grab data over HTTP like normal or request data via a non-HTTP wire protocol. It would even be cool to implement some kind of live streaming updates for real-time data changes over something like MQTT. As such, we've considered embedding authentication information, either authentication tokens or username/password pairs, in the GraphQL requests themselves, but as of yet we have not fully explored those paths.

#### What about security?

Again, this is completely up to your backend and it not a primary concern of GraphQL. We will see an authenticated resolver below (the function that fetches and returns data). There seem to be two predominant approaches to handling a client attempting to access something they are not authorized to view.

**First,** return null for the requested field. This seems to work well in cases where there is no real harm in asking for a particular set of data and no real harm in denying it.

A good example would be asking for the email of a user where the backend only provides the user's email to that user themselves. If I request my own user object with the email field included, I'll get my email. If I request another user object, the email will be null, and I can code my application to be okay with that null.

**Second,** return an actual error. This seems to work best if the client asking for the data needs to know why it was not provided the requested data so that it can take action on that information.

A good example would be attempting to access an object that requires authentication, but no authentication was provided.

"404s" are usually returned as nulls. As per convention (like on Github's API), unauthorized objects are sometimes returned as null as well, like in the case of asking for a user's profile when that user has blocked the currently authenticated user. A null mimics a 404 and does not leak the fact that the hidden user exists.

#### The Github repositories are confusing! Which one is really GraphQL?

[facebook/graphql](https://github.com/facebook/graphql) is the specification for the GraphQL language and its implementation - it is not tied to any specific language / backend. It's great to read to fully understand the language, especially if you're into those things or learn best by digging into concepts and theories.

[graphql/graphql-js](https://github.com/graphql/graphql-js) is a reference implementation of that specification provided by Facebook, written in JS/Node. This is the place to start if you'd like to use GraphQL with a Node-based backend or just want to play around. To the best of my knowledge, this is the most complete implementation of the specification, being more or less the official reference implementation. Read the README.

[graphql/express-graphql](https://github.com/graphql/express-graphql) is a middleware for Express.js to easily create a GraphQL server with Express. I'd highly recommend reading the entire source code as it's not terribly long, is quite easy to understand, and lends itself to explaining how to use graphql-js, even if you don't end up using express-graphql directly.

[graphql/graphql-relay-js](https://github.com/graphql/graphql-relay-js) is a set of helpers to implement Relay-compatible IDs and "connections" (one to many associations, or array fields) - it is not required to use GraphQL, however we have found that being Relay-compatible has benefited us even though we're not using Relay, with ID handling, pagination, etc. For more information on the Relay GraphQL specification, see the [Relay docs](https://facebook.github.io/relay/docs/graphql-relay-specification.html#content).

[graphql/graphiql](https://github.com/graphql/graphiql) is a web-based IDE for GraphQL. This thing is freaking awesome. GraphQL provides schema introspection, and GraphiQL provides autocomplete and syntax validation using those introspection capabilities. You can download this project directly, embed it in your app, or my favorite, download it as a standalone app in an Electon-based wrapper at [skevy/graphiql-app](https://github.com/skevy/graphiql-app).

[facebook/dataloader](https://github.com/facebook/dataloader) is a utility module that has revolutionized data fetching in our Playlist backend. Its foundation is extremely simple - it collects the arguments of calls to load() while in the current frame of execution (an event loop tick) and then uses your custom provided logic to batch-fetch data based on the collected arguments. More on how we use DataLoader below.

[graphql/swapi-graphql](https://github.com/graphql/swapi-graphql) is an example project exposing the existing SWAPI as a GraphQL server. It utilizes graphql-js, express-graphql, GraphiQL, and DataLoader.

[chentsulin/awesome-graphql](https://github.com/chentsulin/awesome-graphql) is an awesome collection of links to GraphQL resources, projects, posts, and more. Check it out!

#### What is Relay? Do I need Relay too?

[Relay](https://github.com/facebook/relay) is a framework for connecting GraphQL and React in an intelligent way. You absolutely do not need Relay to take advantage of GraphQL, though if you're using React, check it out - it may be useful in your app.

Relay requires a few special conventions in your GraphQL query design to support its operation, and at Playlist we've decided to be Relay-compatible, even though we do not use Relay itself. This has provided a consistent API for fetching by ID and representing and paginating collections of associations. The Relay documentation has more information.

#### Is GraphQL only for React?

Nope. You can use it anyplace you used HTTP/REST previously.

### Playlists and Tracks in GraphQL

Let's delve into how we can solve the performance issues from the above playlist endpoint with GraphQL. We want to only return the data that is needed, and optimize our database queries so that we can avoid the N+1 bug.

Our GraphQL query will look like the following:

```graphql
query FetchPlaylist {
  playlist(id: "e66637db-13f9-4056-abef-f731f8b1a3c7") {
    id
    name

    tracks {
      id
      title

      viewerHasLiked
    }
  }
}
```

Which then returns exactly the data requested, in the structure defined by the GraphQL query:

```json
{
  "playlist": {
    "id": "e66637db-13f9-4056-abef-f731f8b1a3c7",
    "name": "Excuse me while I kiss these frets",
    "tracks": [
      {
        "id": "a1f9f37a-2a15-407d-82f8-e742ab5e3b81",
        "title": "Walk This Way",
        "viewerHasLiked": true
      },
      {
        "id": "4cc1fc43-61e8-49a7-be42-9d7ad35c1284",
        "title": "Like A Stone",
        "viewerHasLiked": false
      }
    ]
  }
}
```

For simplicity, the playlist ID was embedded in the query, though in practice we'd be passing the ID as a typed parameter rather than embedding it inside the query. See the GraphQL docs for more info.

We assume that authentication has taken place outside of GraphQL and the authentication state has been provided in the rootValue object of the GraphQL call so that our resolvers can access. See the docs for graphql-js and express-graphql for more information about rootValue, and see below for it in action.

First, we have to define a root query object, which is the entry point for the query. The root query object should have a field called `playlist`, since that's what we're providing in the query above:

```javascript
import {GraphQLObjectType, GraphQLNonNull, GraphQLString} from 'graphql'

import playlistType from './playlistType'

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root query object',
  fields: () => ({
    playlist: {
      type: playlistType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (
        _,
        {id},
        {
          rootValue: {
            ctx: {backend},
          },
        },
      ) => backend.getModel('Playlist').load(id),
    },
  }),
})
```

Note that we're using ES6 syntax here. We use babel with stage set to 0 to take advantage of all the latest and greatest ES7 stuff.

We define a field that returns a playlist type (a GraphQL type definition that we define in another file and import here), set up a single argument named `id` of type non-null string, and then most importantly we define a function to "resolve" the object.

The first argument to resolve is the current object itself (since we're at the root level, we ignore this argument). The second argument is the args passed to the GraphQL call, so we extract out the `id` field. The third argument provides us access to the GraphQL context, so we extract out our backend instance that we passed down from the `rootValue` elsewhere in the app and use it to fetch a playlist by ID.

It's that simple! We load the playlist from the database, return a JS object, and we're done at this level.

Next, let's define the playlist schema type:

```javascript
import {GraphQLString, GraphQLArray, GraphQLObjectType} from 'graphql'

import trackType from './trackType'

export default new GraphQLObjectType({
  name: 'Playlist',
  description: 'A Playlist',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: it => it.uuid,
    },

    name: {type: GraphQLString},

    tracks: {
      type: new GraphQLArray(trackType),
      resolve: it => it.tracks(),
    },
  }),
})
```

So, here we define a new object type for Playlist. Since our root query resolver returned the playlist model instance, the first argument to our resolve functions at this level (named `it`) is that instance. So, for the `id` field, we are resolving by calling `it.uuid` thus exposing the `uuid` model field under the name `id`. Remember that your GraphQL schema does not need to mirror your database schema.

For the `name` field, we do not provide a resolver, because the default for a field named `x` is `model.x`.

For `tracks`, we call `it.tracks()` on the model to load tracks from the database.

**Note:** there is a resolve function for every field, but this does not mean that an individual database query is required to fetch each field. You can fetch as much or as little on `root.playlist`, so each of the sub field resolvers can return something already fetched by their parent or issue further queries as necessary.

Finally, let's define the GraphQL object type for a track:

```javascript
import {GraphQLString, GraphQLBoolean, GraphQLObjectType} from 'graphql'

// a comment

export default new GraphQLObjectType({
  name: 'Track',
  description: 'A Track',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: it => it.uuid,
    },

    title: {type: GraphQLString},

    viewerHasLiked: {
      type: GraphQLBoolean,
      resolve: (
        it,
        _,
        {
          rootValue: {
            ctx: {auth},
          },
        },
      ) => (auth.isAuthenticated ? it.userHasLiked(auth.user) : null),
    },
  }),
})
```

Similar to before, we define the `id` and `title` fields as simple resolvers. We also add a field `viewerHasLiked` and check authentication. If the user has not been authenticated, we return `null`. Otherwise we call `track.userHasLiked()` with the currently authenticated user. Again, the `auth` object is coming from our app outside of GraphQL in an Express middleware.

Given that `Playlist.load()` loads a playlist, `playlist.tracks()` loads the array of tracks for that playlist from the database, and `track.userHasLiked()` queries the database for the existence of an association between a user and a track, then our GraphQL query will resolve correctly and we have essentially duplicated the functionality of the REST API, once we get the other fields defined, omitted here for brevity.

This solves one of our two issues with our REST API: clients can now request only the data they need, beneficial for mobile app performance in a variety of different ways. But we still have the problem of N+1 queries - if we request `viewerHasLiked` for all 50 tracks of this playlist, we will get 50 queries. We solved this using a quite ingenious little npm module from Facebook called DataLoader.

### DataLoader FTW

![](/images/from-rest-to-graphql-3.jpg)

[DataLoader](https://github.com/facebook/dataloader) provides an API that consolidates any calls to `load()` in a frame of execution (event loop tick) and then batch-loads data based on the collection of calls. Additionally, it caches results by key, so subsequent calls to `load()` with the same arguments return cached directly.

So, if we call `myDataLoader.load(id)` many different times in a frame of execution, then once that frame completes, the data loader would be provided with an array of all the IDs and can batch-load the requested data. I would highly recommend reading the README to better understand DataLoader's workings.

In our case, we can model `track.userHasLiked()` as a call to a DataLoader instance designed for resolving the the relationship between a user and track in bulk. Something like this:

```javascript
import DataLoader from 'dataloader'
import BaseModel from './BaseModel'

const likeLoader = new DataLoader(requests => {
  // requests is now a an array of [track, user] pairs.
  // Batch-load the results for those requests, reorder them to match
  // the order of requests and return.
})

export default class Track extends BaseModel {
  userHasLiked(user) {
    return likeLoader.load([this, user])
  }
}
```

With this code in place, the 50 calls to `likeLoader.load()` will result in one call to the batch load function, meaning that our GraphQL query will now execute 3 database queries rather than 52.

As indicated on the DataLoader README, we take this one step further by composing DataLoader instances all the way to the database query level.

For example, if we wanted to fetch users by username, we would have:

- `batchQueryLoader` - a DataLoader with caching disabled that accepts database queries, executes them against the database (using batch / parallel features for performance speedups), and returns the results.
- `userByIDLoader` - a DataLoader that accepts IDs, uses `batchQueryLoader` to query the database, and returns user objects.
- `userByUsernameLoader` - a DataLoader that accepts usernames, uses `batchQueryLoader` to query the database for user IDs, then calls `userByIDLoader` to return user objects.

With this DataLoader composition, the batchQueryLoader, used by all other DataLoaders, ensures database activity is batched and latency is reduced. And since `userByUsernameLoader` resolves IDs then calls `userByIDLoader`, `userByIDLoader` becomes a shared cache, reducing queries overall. In our setup, we even added a DataLoader for Redis using pipelines and integrated it into our other loaders as a caching layer, further reducing query time.

Also, as mentioned before, DataLoaders cache their results by the arguments of `load()`. Because of this fact, we initialize DataLoaders for each request, so during the life of a single request, data is cached, then it is discarded after the request completes.

Using this architecture, the entire requested playlist from the beginning, the one that took 170 queries and around 15s to render, returns in about 250ms with only 3 database queries, and around 17ms reading data from the Redis cache. This solves both performance issues.

## Future Puzzles

Looking forward, here are a few things we are currently looking to solve:

### Mutations (Writes)

Our GraphQL server provides read capabilities for our entire API surface, but writes have yet to be implemented. graphql-js provides an easy DSL for handling GraphQL mutations, so we shortly will be integrating writes into the GraphQL system. This appears to be a straightforward task, but it will be interesting to discover what if any insights or best practices emerge from the implementation.

### Client-side Caching

We have yet to solve caching GraphQL responses on the client. Ideally the system fetching data from a GraphQL endpoint would understand the underlying schema by utilizing schema introspection and thus would be able to intelligently cache sub-resources, so updates to a model at one location would update everywhere. Further considerations like TTLs, forced updates, etc. would need to be implemented.

If understand correctly, Relay may solve some of these concerns, however Relay is still new, does not currently support React Native, and does not run in a native code environment.

### Real-time or Push Updates

There are several aspects of our platform that are "real-time," and it would be awesome to integrate these aspects into our GraphQL backend, perhaps allowing live "subscriptions" to particular sets of data.

### Query Performance Protection

If we expose something like the followers of a given user, then theoretically a malicious client could submit a request like user.followers.followers... until the server struggled to respond. We do not have a full solution for this yet, especially if we decide to expose our GraphQL endpoints as a public API at some future point. Three possible paths to explore come to mind:

1. Perform schema AST inspection to validate the query is not too "complex," rejecting queries over a threshold.
1. Have some form of query "timeout," kill requests that take too long to resolve, and rate-limit the ability of a single request to query the database.
1. Take a note from Facebook and implement a "query cache" where queries are stored in a cache and clients refer to them by ID in production rather than passing the full query, essentially whitelisting queries. This only works if the GraphQL API is only for internal clients.

## Conclusion

In conclusion, GraphQL is pretty awesome and has been solving some real-world problems at Playlist. For us, it is more than hype, and I wanted to share some of our findings in the hopes that it may help others understand. Cutting edge technologies and projects are fun, but can sometimes be difficult to comprehend and apply.

One more thing - check out this video. It was immensely helpful for me in understanding some of the benefits of GraphQL and its real-world implementation at the Financial Times.

<div class="video">
<iframe src="https://www.youtube-nocookie.com/embed/S0s935RKKB4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

If you have any questions, comments, pieces of advice, whatever, feel free to get in touch [@jacobwgillespie](https://twitter.com/jacobwgillespie) on Twitter or at [jacobwgillespie@gmail.com](mailto:jacobwgillespie@gmail.com).
