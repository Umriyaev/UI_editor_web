<%-- 
    Document   : saveFile
    Created on : Oct 5, 2015, 11:26:03 AM
    Author     : Umriyaev
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.io.*"%>
<%@page import="java.util.*"%>
<%@page import="java.text.*" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>

        <h1>Save project</h1>
        <h2>UI projects in the server:</h2>
        <%
            String jsonString = request.getParameter("jsonFile");
            if (jsonString != null && !jsonString.trim().isEmpty()) {
                String fileName = request.getParameter("fileName");
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH_mm_ss");
                String nameOfFile = "";
                if (fileName == null) {
                    nameOfFile += "/ui/" + sdf.format(new Date()) + ".json";
                } else {
                    nameOfFile += fileName;
                }

                try {
                    File file = new File(nameOfFile);
                    file.getParentFile().mkdirs();
                    FileWriter fileWriter = new FileWriter(file, false);
                    fileWriter.write(jsonString);
                    fileWriter.close();

                } catch (IOException e) {
                    out.println(e.getMessage());
                }
            }
        %>        
        <div id="files">
            <%
                //String nameOfFolder = application.getRealPath("/")+"/ui/";
                //String nameOfFolder = request.getServletContext().getRealPath("/")+"/ui/";
                String nameOfFolder = "/ui/";
                File folder = new File(nameOfFolder);
                File[] files = folder.listFiles();
                for (File file : files) {
                    out.println(file.getName() + "<br/>");
                    out.println(file.getCanonicalFile() + "<br/><br/>");
                }
            %>
        </div>
    </body>
</html>
