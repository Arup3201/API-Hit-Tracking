from werkzeug.user_agent import UserAgent
from flask import Flask, request, render_template, jsonify, g
from flask_cors import CORS
import datetime
import time
import psycopg2
from psycopg2.extras import Json

def get_connection():
    try:
        return psycopg2.connect(
            host= HOST, 
            user= USER, 
            port= PORT_NO, 
            password= YOUR_PASSWORD, 
            database= "apidb", 
        )
    except:
        return False

class CustomUserAgent(UserAgent):
    def __init__(self, string):
        super().__init__(string)
        self.platform = self._parse_platform()
        self.browser = self._parse_browser()

    def _parse_platform(self):
        # Add your custom platform parsing logic here
        if 'windows' in self.string.lower():
            return 'Windows'
        elif 'mac' in self.string.lower():
            return 'MacOS'
        elif 'linux' in self.string.lower():
            return 'Linux'
        elif 'android' in self.string.lower():
            return 'Android'
        elif 'iphone' in self.string.lower() or 'ipad' in self.string.lower():
            return 'iOS'
        elif 'postman' in self.string.lower():
            return 'Postman'
        else:
            return 'Unknown'

    def _parse_browser(self):
        # Add your custom browser parsing logic here
        if 'edg' in self.string.lower():
            return 'Edge'
        elif 'chrome' in self.string.lower():
            return 'Chrome'
        elif 'firefox' in self.string.lower():
            return 'Firefox'
        elif 'safari' in self.string.lower() and 'chrome' not in self.string.lower():
            return 'Safari'
        elif 'msie' in self.string.lower() or 'trident' in self.string.lower():
            return 'Internet Explorer'
        elif 'postman' in self.string.lower():
            return 'Postman'
        else:
            return 'Unknown'

app = Flask(__name__)
CORS(app)

@app.before_request
def handle_request():
    
    g.start_time = time.time()
    
    if request.method=="GET":
        rid = "get-items"
    if request.method=="POST":
        rid = "save-item"
    if request.method=="PUT":
        rid = "update-item"
    if request.method=="DELETE":
        rid = "delete-item"
    
    request.user_agent = CustomUserAgent(request.headers.get('User-Agent', ''))
    
    g.request_details = {
        "RequestID": rid, 
        "RequestType": request.method, 
        "RequestTime": datetime.datetime.now().isoformat(), 
        "Payload": None if request.get_json(silent=True) is None else Json(request.get_json(silent=True)),
        "ContentType": request.content_type, 
        "IPaddress": request.remote_addr, 
        "OS": request.user_agent.platform, 
        "UserAgent": request.user_agent.browser
    }
    

@app.after_request
def handle_response(response):
    
    response_time = time.time() - g.start_time
    g.request_details["RequestStatus"] = response.status_code
    g.request_details["ResponseTime"] = round(response_time % 60.0, 2)
    
    conn = get_connection()
    if conn:
        curr = conn.cursor()
        curr.execute("INSERT INTO requestlogs(RequestID, RequestStatus, RequestType, ResponseTime, RequestTime, Payload, ContentType, IPAddress, OS, UserAgent) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (g.request_details['RequestID'], g.request_details['RequestStatus'], g.request_details['RequestType'], g.request_details['ResponseTime'], g.request_details['RequestTime'], g.request_details['Payload'], g.request_details['ContentType'], g.request_details['IPaddress'], g.request_details['OS'], g.request_details['UserAgent']))
        conn.commit()
    else:
        print("Failed to connect to database...")
        
    return response

@app.route('/', methods=['GET', 'POST', 'PUT', 'DELETE'])
def handle_request():

    if request.method=='GET':
        message = "GET request received"
        
    elif request.method=='POST':
        message = "POST request received"
        
    elif request.method=='PUT':
        message = "PUT request received"
        
    elif request.method=='DELETE':
        message = "DELETE request received"
        
    return render_template("base.html", message=message)

@app.route('/total_request', methods=['GET', 'POST', 'PUT', 'DELETE'])
def total_request():
    if request.method == 'GET':
        conn = get_connection()
        if conn:
            with conn.cursor() as cursor:
                cursor.execute('''SELECT
                                    SUM(ID) AS TOTALREQUESTS
                                FROM
                                    REQUESTLOGS;''')
                row = cursor.fetchone()
                
                if row[0]>100_000_000:
                    value = f"{row[0]/100_000_000}M"
                elif row[0]>100_000:
                    value = f"{row[0]/100_000}K"
                elif row[0]>100:
                    value = row[0]
                    
                return jsonify({'value': value})
        else:
            return '', 500
        
    
    response = jsonify({'value': 0})
    return response, 200

@app.route('/avg_request_time', methods=['GET', 'POST', 'PUT', 'DELETE'])
def avg_request_time():
    if request.method == 'GET':
        conn = get_connection()
        if conn:
            with conn.cursor() as cursor:
                cursor.execute('''SELECT
                                    ROUND(CAST(AVG(RESPONSETIME) AS NUMERIC), 2) AVGREQUESTTIME
                                FROM
                                    REQUESTLOGS;''')
                row = cursor.fetchone()
                return jsonify({'value': f"{row[0]}s"})
        else:
            return '', 500
    
    response = jsonify({'value': 0})
    return response, 200

@app.route('/failed_requests', methods=['GET', 'POST', 'PUT', 'DELETE'])
def failed_requests():
    if request.method == 'GET':
        conn = get_connection()
        if conn:
            with conn.cursor() as cursor:
                cursor.execute('''SELECT
                                    SUM(ID) AS TOTALFAILEDRESPONSE
                                FROM
                                    REQUESTLOGS
                                WHERE
                                    REQUESTSTATUS BETWEEN 400 AND 700;''')
                row = cursor.fetchone()
                return jsonify({'value': row[0]})
        else:
            return '', 500
    
    response = jsonify({'value': 0})
    return response, 200

@app.route('/bar_chart_data', methods=['GET', 'POST', 'PUT', 'DELETE'])
def bar_chart_data():
    if request.method == 'GET':
        conn = get_connection()
        if conn:
            with conn.cursor() as cursor:
                cursor.execute('''SELECT
                                    REQUESTTYPE,
                                    COUNT(ID) REQUEST_COUNT
                                FROM
                                    REQUESTLOGS
                                GROUP BY
                                    REQUESTTYPE;''')
                rows = cursor.fetchall()
                return jsonify({'data': [row[1] for row in rows]})
        else:
            return '', 500
    
    response = jsonify({'data': []})
    return response, 200

@app.route('/pie_chart_data', methods=['GET', 'POST', 'PUT', 'DELETE'])
def pie_chart_data():
    if request.method == 'GET':
        conn = get_connection()
        if conn:
            with conn.cursor() as cursor:
                cursor.execute('''SELECT
                                    USERAGENT,
                                    COUNT(ID) AS REQUEST_COUNT
                                FROM
                                    REQUESTLOGS
                                GROUP BY
                                    USERAGENT;''')
                rows = cursor.fetchall()
                return jsonify({'data': [{'value': row[1], 'label': row[0]} for row in rows]})
        else:
            return '', 500
    
    return jsonify({'data': []}), 200

@app.route('/table_data', methods=['GET', 'POST', 'PUT', 'DELETE'])
def table_data():
    if request.method == 'GET':
        conn = get_connection()
        if conn:
            with conn.cursor() as cursor:
                cursor.execute('''SELECT
                                    ID,
                                    REQUESTID,
                                    REQUESTSTATUS,
                                    REQUESTTYPE,
                                    REQUESTTIME,
                                    CONTENTTYPE,
                                    IPADDRESS,
                                    OS,
                                    USERAGENT
                                FROM
                                    REQUESTLOGS;''')
                rows = cursor.fetchall()
                return jsonify({'data': [{ 'id': row[0], 'request_id': row[1], 'request_status': row[2], 'request_type': row[3], 'request_time': row[4], 'content_type': row[5], 'ip_address': row[6], 'os': row[7], 'user_agent': row[8]} for row in rows]})
        else:
            return '', 500
    
    return jsonify({'data': []}), 200


if __name__=="__main__":
    app.run(debug=True, port=3000)
