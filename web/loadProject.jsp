<%-- 
    Document   : loadProject
    Created on : Oct 6, 2015, 3:47:06 PM
    Author     : Umriyaev
--%>

<%@page import="com.sun.org.apache.bcel.internal.generic.AALOAD"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.io.*" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Load project</title>
        <link href="js/libs/twitter-bootstrap/css/bootstrap.css" rel="stylesheet" />        
        <link href="style.css" rel="stylesheet" />
        <script src="js/libs/jquery/jquery.js"></script>
        <script src="js/libs/twitter-bootstrap/js/bootstrap.js"></script>       
        <script src='index.js'></script>
    </head>
    <body>
        <div id="main">            
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4 col-md-offset-4">
                        <div class="panel panel-default">
                            <div class="panel-heading text-center">
                                <h3 class="panel-title">Projects in server</h3>
                            </div>
                            <div class="panel-body text-center ">
                                <div class='flexContainer'>
                                    <%
                                        String path = "/ui/";
                                        File directory = new File(path);
                                        File[] projects = directory.listFiles();
                                        for (File file : projects) {
                                            String button = "<button"
                                                    +" class=\"btn btn-default btn-lg\""
                                                    
                                                    +" onclick=\"loadProject(\'"                                                    
                                                    +path+ file.getName()+ "\')\">"
                                                    + file.getName()
                                                    + "</button><br/>";
                                            out.println(button);
                                        }
                                    %>
                                </div>                                
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>  
    </body>
</html>
