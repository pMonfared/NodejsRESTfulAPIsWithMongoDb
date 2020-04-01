
Hi!

# This is a nodejs RESTful APIs app by express framework and MongoDb.
# test driven deployment
# heroku deployment config

First things need to do is:

1- Install npm globaly on your Os (windows - mac - ...)

2- Install nodemon for run-watching mode (install command is : "npm i -g nodemon")
   I suggest to you install as globaly packages because it is a tool not a dependency for project

So now! you must install dependency packages: (please run below command in project folder)

``` npm i ```


Welldone! app is ready to run now. run below command

``` npm start-local-test ```

or

``` npm start-local-dev ```

or

``` npm start-local-prod ```

tadaaa!

open browser: "localhost:5000"  (must see hello :))

open browser: "localhost:5000/api/courses" (must see course array list)

You can use Postman to Get,Post,Put,Delete Courses operators

Enjoyed.
