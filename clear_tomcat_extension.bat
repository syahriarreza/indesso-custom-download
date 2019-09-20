rem # Script to REMOVE Alfresco extensions in shared folder #
set EXTENSION_HOME=D:\AlfrescoCom51\tomcat\shared\classes\alfresco\extension
set MESSAGES_HOME=D:\AlfrescoCom51\tomcat\shared\classes\alfresco\messages
set WEB_EXTENSION_HOME=D:\AlfrescoCom51\tomcat\shared\classes\alfresco\web-extension

rmdir /S /Q "%EXTENSION_HOME%\models"
rmdir /S /Q "%EXTENSION_HOME%\templates"
rmdir /S /Q "%EXTENSION_HOME%\customDownload-model-context.xml"
del /Q "%EXTENSION_HOME%\*.xml"

del /Q "%MESSAGES_HOME%\*"

rmdir /S /Q "%WEB_EXTENSION_HOME%\custom-share-config"
rmdir /S /Q "%WEB_EXTENSION_HOME%\site-data"
rmdir /S /Q "%WEB_EXTENSION_HOME%\site-webscripts"
del /Q "%WEB_EXTENSION_HOME%\custom-slingshot-application-context.xml"