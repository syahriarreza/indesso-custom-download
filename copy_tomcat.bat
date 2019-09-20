rem ### Script to copy tomcat to Alfresco ###
set TOMCAT_HOME=D:\AlfrescoCom51\tomcat
echo Copying tomcat to %TOMCAT_HOME%...
xcopy /E /Y "tomcat" "%TOMCAT_HOME%"