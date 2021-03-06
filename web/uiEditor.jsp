<%-- 
    Document   : index
    Created on : Jun 16, 2015, 11:35:36 AM
    Author     : Shokhrukh
--%>

<%@page import="java.nio.file.Paths"%>
<%@page import="java.nio.charset.StandardCharsets"%>
<%@page import="java.nio.file.Files"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>UI editor</title>
        <link href="js/libs/twitter-bootstrap/css/bootstrap.css" rel="stylesheet" />    
        <link href="js/libs/colorPicker/css/bootstrap-colorpicker.css" rel="stylesheet"/>
        <link href="style.css" rel="stylesheet" />
        <script src="js/libs/jquery/jquery.js"></script>
        <script src="jquery.ajaxfileupload.js"></script>
        <script src="js/libs/twitter-bootstrap/js/bootstrap.js"></script>
        <script src="js/libs/colorPicker/js/bootstrap-colorpicker.js"></script>
        <script src="js/libs/bootbox/bootbox.js"></script>
        <script src="Notify.js"></script>
        <script src="uiEditor.js"></script>
        <script src="main.js"></script>
    </head>
    <body onload="uiEditor.mainApp.init()">
        <div id="main">
            <nav  class="navbar navbar-default">
                <div class="navbar-inner">
                    <div class="container">                       
                        <ul class="nav navbar-nav">
                            <li class="dropdown"><a>Page</a>
                                <ul class="dropdown-menu">
                                    <!--<li><a class=dropdown-toggle" data-toggle="dropdown">New page</a></li>-->
                                    <li><a class=dropdown-toggle" data-toggle="dropdown" onclick="ns.redirect('uiEditor.jsp')">New project</a></li>
                                    <li><a class=dropdown-toggle" data-toggle="dropdown" onclick="ns.redirect('loadProject.jsp')">Open</a></li>
                                    <li><a class=dropdown-toggle" data-toggle="dropdown" onclick="ns.saveToJson()">Save</a></li>
                                    <li><a class=dropdown-toggle" data-toggle="dropdown" onclick="ns.saveAs()">Save as</a></li>
                                </ul>
                            </li>
                            <li class="dropdown"><a>Edit</a>
                                <ul class="dropdown-menu">
                                    <li><a class=dropdown-toggle" data-toggle="dropdown">Cut</a></li>
                                    <li><a class=dropdown-toggle" data-toggle="dropdown">Copy</a></li>
                                    <li><a class=dropdown-toggle" data-toggle="dropdown">Paste</a></li>
                                    <li><a class=dropdown-toggle" data-toggle="dropdown">Delete</a></li>
                                </ul>
                            </li>
                            <li class="dropdown"><a>Alignment</a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-toggle" data-toggle="dropdown" onclick="ns.alignSizes()">Size alignment</a></li>
                                    <li><a class="dropdown-toggle" data-toggle="dropdown" onclick="ns.alignHorizontal()">Horizontal alignment</a></li>  
                                    <li><a class="dropdown-toggle" data-toggle="dropdown" onclick="ns.alignVertical()">Vertical alignment</a></li> 
                                    <li><a class="dropdown-toggle" data-toggle="dropdown" onclick="ns.alignIntervalsHorizontal()">Horizontal interval alignment</a></li>
                                    <li><a class="dropdown-toggle" data-toggle="dropdown" onclick="ns.alignIntervalsVertical()">Vertical interval alignment</a></li>
                                </ul>
                            </li>
                            <li class="dropdown"><a>View</a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-toggle" data-toggle="dropdown">Preview</a></li>
                                </ul>
                            </li>
                            <li class="dropdown"><a>Setting</a></a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-toggle" data-toggle="dropdown">Screen resolution</a></li>
                                    <li><a class="dropdown-toggle" data-toggle="dropdown">Device type</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-2">
                        <div class="panel panel-default">
                            <div class="panel-heading text-center">
                                <h3 class="panel-title">Toolbox</h3>
                            </div>
                            <div class="panel-body toolboxPanel">
                                <div class="panel-group" id="accordion">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">                                            
                                            <h4 class="panel-title">
                                                Common controls
                                            </h4>
                                        </div>
                                        <div id="commonControls" class="panel panel-default">
                                            <div class="panel-body toolBoxChildPanel">
                                                <button onclick="uiEditor.mainApp.setChosenComponent('button')">Button</button>
                                                <button onclick="uiEditor.mainApp.setChosenComponent('image')">Image</button>

                                                <button onclick="uiEditor.mainApp.setChosenComponent('text')">Text</button>
                                                <button onclick="uiEditor.mainApp.setChosenComponent('panel')">Panel</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h4 class="panel-title">
                                                Screen controls
                                            </h4>
                                        </div>
                                        <div id="screenControls" class="panel panel-default">
                                            <div class="panel-body toolBoxChildPanel">
                                                <button onclick="uiEditor.mainApp.setChosenComponent('display')">Display</button>
                                                <button onclick="uiEditor.mainApp.setChosenComponent('screenControl')">Screen control</button>
                                                <button onclick="uiEditor.mainApp.setChosenComponent('source')">Source</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="panel panel-default">
                            <div class="panel-heading text-center">
                                <h3 class="panel-title">Canvas</h3>
                            </div>
                            <div class="panel-body canvasPanel">
                                <div>
                                    <canvas id="myCanvas" width="1210" height="762" style="border: 1px solid #d3d3d3;"></canvas>
                                </div>                                
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="panel panel-default" id="propertiesColumn">
                            <div class="panel-heading text-center">
                                <h3 class="panel-title">Properties</h3>
                            </div>
                            <div class="panel-body propertiesPanel" id="properties">

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
            <div id='json' style='display: none'>
                <%
                    String path = request.getParameter("param1");
                    if (path != null && !path.trim().isEmpty()) {
                        byte[] encoded = Files.readAllBytes(Paths.get(path));
                        String json = new String(encoded, StandardCharsets.UTF_8);
                        out.println(json);
                    }
                %>
            </div>
            <form id="jsonForm" action="saveFile.jsp" style="display: none" method="post">
                <input type="text" name="json" value="">                
            </form>
    </body>
</html>
