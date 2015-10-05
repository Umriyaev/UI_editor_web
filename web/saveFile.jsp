<%-- 
    Document   : saveFile
    Created on : Oct 5, 2015, 11:26:03 AM
    Author     : Umriyaev
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="org.json.simple.JSONObject"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <%String jsonString = request.getParameter("jsonFile");%>        
        <%System.out.println(jsonString);%>
    </body>
</html>
