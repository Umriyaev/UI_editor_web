<%-- 
    Document   : saveImage
    Created on : Oct 21, 2015, 4:34:15 PM
    Author     : Umriyaev
--%>


<%@page import="org.apache.commons.fileupload.FileItem"%>
<%@page import="java.util.List"%>
<%@page import="org.apache.commons.fileupload.servlet.ServletFileUpload"%>
<%@page import="org.apache.commons.fileupload.disk.DiskFileItemFactory"%>
<%@page import="org.apache.commons.fileupload.FileItemFactory"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.io.*"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <%
            boolean isMultipart = ServletFileUpload.isMultipartContent(request);
            if (isMultipart) {
                FileItemFactory factory = new DiskFileItemFactory();

                ServletFileUpload upload = new ServletFileUpload(factory);
                try {
                    List<FileItem> multiparts = upload.parseRequest(request);

                    for (FileItem item : multiparts) {
                        if (!item.isFormField()) {
                            String name = item.getName();
                            item.write(new File("/images/"  + name));
                            out.println("/images/" + name);                            
                        }
                    }
                    out.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        %>
    </body>
</html>
