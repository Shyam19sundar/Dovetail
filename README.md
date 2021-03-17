# Dovetail
Our Dovetail ensures secure communication between people.
We have secure sign up policy. Sign up is done only after the email verification from the user.
We use web tokens for authentication and authorization, which makes our app more secure . The sessions can also be retained(max 7 days for security reasons) since we use refresh tokens.
We have 'Rooms' and 'Chats' options for logged in users.
'Rooms' enable people to share their thoughts publicly. One can also create new rooms as they wish. Rooms give opportunity for one to find some other like-minded.Then,
'Chats' enables private communication between those persons.We have profile for each user, which help others to know more about them.


# '/video'
   -Route enable to share a video between two persion available on local network by showing the socket id of the another person (note:Add "proxy":"localhost:8000" in front end package.json).But We are not deploying this feature because of the proxy problem in front end.

In Linux, use
1) Install Node Package Manager
2) git clone the repository or download the folder
3) In command prompt go inside frontend folder and give 'npm i' and then 'npm start'
4) Then in command prompt go inside backend folder and give 'npm i' and then 'npm start' or 'nodemon server.js' or 'node server.js'


Deployed Web App : https://dovetail-elan.herokuapp.com/

NOTE : If the server didn't respond add 'Allow CORS' extension and click on the 'C' icon.(Hosting Issues) 
