# eggDROP

## [Log in as 'Guest' to try it out here.](https://www.eggdrop.live "eggDROP")

## Watch My Live Demonstration on Youtube!

<a href="http://www.youtube.com/watch?feature=player_embedded&v=2FjTO4m3IUo
" target="_blank"><img src="http://img.youtube.com/vi/2FjTO4m3IUo/0.jpg" 
alt="egg-drop-demo" width="480" height="360" border="10" /></a>

## Technologies Used 

-React.js
-Node.js
-SQL
-PostgreSQL
-MapBox
-React Router
-Webpack
-Express
-AWS-S3
-Heroku
-CSS3
-HTML5
-JavaScript ES6

EggDrop is a PokemonGo meets Instagram. It’s a mobile, location-based, geocaching web application for users to share pictures and messages in the form of a scavenger hunt.

### What is an Egg?

An **'egg'** consists of a picture and image of the user’s choice.

To **‘drop’** an egg is to pin that picture and image to the map in the form of a marker - fixing it to that location’s coordinates.

The conceit of EggDrop is that users can only **‘claim’** an egg and view its contents if they’re within 300-feet of the drop location.

### Why eggDROP?

EggDrop was an idea that came to me while taking on online course on UI/UX design. In fact, I loved the idea so much it propelled me study web design.

_"How can I make a social-media application fun and maintain a high degree of privacy?"_

Geolocation answers both parts of that question:

Using EggDrop, a user can limit who sees their content by location, and even specify a single user who can claim their egg.

By hiding the egg contents from the client until they claim the egg, and adding a random ID generator to image URLs, the egg contents are further protected.

## Features:

1. User can create a password protected account.
2. User can send a follow request to another user.
3. User can accept or reject follow request.
4. User can live search for another user.
5. User can upload a file and text-based message.
6. User can 'pin' that file and text message to the map in the form of an egg.
7. User can view the distance between themselves and an egg.
8. User can claim an egg if they're within 300 feet of that egg.
9. User can view all their claimed eggs in their profile, along with their followers and following.
10. User can view notifications when another user claims their egg or requests to follow.
11. User can create three types of eggs:
    - Public Eggs (claimable by anyone)
    - Followers Only Eggs (claimable by followers)
    - Private Eggs (claimable by only one of their chosen followers)


## Stretch Features

1. User can drop an egg that they currently own: 
   Rather than having to create a new egg, the user can drop an egg that they currently own. By limiting the total number of eggs a user can own to 12 (their 'egg carton'), users would be encouraged to reshare their claimed eggs. This would help ensure a more linear claim-to-drop ratio and limit the total number of eggs in the database.    
2. User can only see eggs within an X mile radius: 
   Rather than rendering an egg in New York when the user is in Los Angeles, the user would only see eggs within X miles of their current location. With Postgres's earth_distance function, this would be a rather simple addition to the current select statement that would improve the app's efficiency.    
3. Users can trade eggs: 
   Eggs are quite similar to NFTs in that only one user can own a given egg, and the egg contains a unique ID and details about it's creator. With an added 'Marketplace' feature, users would have the option to trade eggs with other users, or purchase eggs from other users based on perceived value. Furthermore, a business could create eggs for product promotion in the same way Nike 'drops' a limited supply of new sneakers. The eggs would then be redeemable for discounts, free-products, or anything of the business's choosing.    

## Development

### System Requirements

-Node.js 17 or higher
-PostgreSQL 14 or higher
-npm 7 or higher

1. Clone the repository.

`git clone git@github.com:mpowers1113/eggDropFinal.git
 cd eggDropFinal`

2. Install dependencies with NPM.

`npm install`

3. Import the example database to Postgres.

`npm run db:import`

4. Start the project. Once started you can view the application by opening http://localhost:3000 in your browswer and allowing the app to use your current location. 

`npm run dev`
