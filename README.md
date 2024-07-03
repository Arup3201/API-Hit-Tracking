# API Hit Tracking & Analytics Dashboard

## Tech Stacks

- **Frontend** React, HTML, CSS

- **Backend** Flask, Python

- **Database** PostgreSQL

## Project Execution

1. Clone the github repo.
   
   ```
   git clone https://github.com/Arup3201/API-Hit-Tracking.git
   ```

2. Set up virtual environment
   
   ```
   python -m venv env
   ```

3. Install requirements. Open Power Shell. Then run the following commands.
   
   ```
   ./env/Scripts/activate
   pip install -r requirements.txt
   ```

4. I am using PostgreSQL here. So, make sure that you have PosgreSQL installed in your computer. After doing that, you need to change some configurations that are particular for my computer. Go to `api.py` file, change the `get_connection` function by replacing the values I mentioned there.
   
   ```
   return psycopg2.connect(
               host= HOST(e.g. 127.0.0.1), 
               user= USER_NAME(e.g. postgres), 
               port= PORT_NO(e.g. 5432), 
               password= YOUR_PASSWORD, 
               database= "apidb", 
           )
   ```

5. Open `pg4Admin`. Create a database there and name it `apidb`, then choose it as your active database. Then, run the query script file `create_db.sql` in `pg4Admin`. It has all the query needed to create the table.

6. Come back to Power Shell now. Start the server by running the script file.
   
   ```
   python api.py
   ```

7. Server should start at `http://127.0.0.1:3000`. You can open your favourite browser and type the URL. In the frontend, you will notice some buttons. Those buttons will send API requests for `PUSH`, `GET`, `PUT` & `DELETE`. This data will be stored in the database.

8. Now, you can start the frontend to see the dashboard as well. To do that, you need to go to `api-dashboard` folder and there open a new power shell. Then, write the following commands.
   
   ```
   npm install
   npm run dev
   ```

9. Open the frontend dashboard at `http://localhost:5173`. Everytime you hit the API with new requests and reload the frontend, it will update the dashboard.