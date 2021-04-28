# NodeInterview  

An endpoint that listens on port 9999 and can receive JSON or CSV messages. The endpoint is secured with JWT. 
It is written in NodeJS with express.  

#### To run the app:  
- clone the project  
- run "npm install" to install the dependencies  
- run "npm start" to start the application   
  
#### To create a token:
Send a JSON message to the endpoint "http://localhost:9999/login" in the format : 
>{  
"authenticated": true,  
"iss": "JWT Builder",  
"facility": ["12", "13"]  
"roles": [ "Admin" ]  
>} 
 

  
