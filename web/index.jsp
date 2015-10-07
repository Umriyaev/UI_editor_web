<%-- 
    Document   : index
    Created on : Jun 16, 2015, 11:35:36 AM
    Author     : Shokhrukh
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>UI editor</title>
        <link href="js/libs/twitter-bootstrap/css/bootstrap.css" rel="stylesheet" />        
        <link href="style.css" rel="stylesheet" />
        <script src="js/libs/jquery/jquery.js"></script>
        <script src="js/libs/twitter-bootstrap/js/bootstrap.js"></script>
        <script src="index.js"></script>

    </head>
    <body>
        <div id="main">            
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4 col-md-offset-4">
                        <div class="panel panel-default">
                            <div class="panel-heading text-center">
                                <h3 class="panel-title">Welcome</h3>
                            </div>
                            <div class="panel-body text-center ">
                                <div class='flexContainer'>
                                    <button type="button" class="btn btn-default btn-lg" onclick='redirectTo("loadProject.jsp")'>Load UI project</button>
                                    <button type="button" class="btn btn-default btn-lg" onclick="redirectTo('uiEditor.jsp')">New UI project</button>
                                </div>                                
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>  

            <nav class="context-menu">
                <ul class="context-menu__items">
                    <li class="context-menu__item">
                        <a href="#" class="context-menu__link">
                            Copy
                        </a>
                    </li>
                    <li class="context-menu__item">
                        <a href="#" class="context-menu__link">
                            Paste
                        </a>
                    </li>
                    <li class="context-menu__item">
                        <a href="#" class="context-menu__link">
                            Delete
                        </a>
                    </li>

                </ul>
            </nav>    
            <div class="bb-alert alert alert-info" style="display: none;">
                <span>Hello . You've chosen <b>Really awesome</b></span>
            </div>
    </body>
</html>
