# Indesso Custom Download
This will hide Download button above Document Actions in Document Details page and disable Download button in pdf viewer.
Any aspect (Custom Download Watermark or Custom Download Skip Page) applied, will hide built-in download button in Document Actions and show customized download button instead. (the button appearance is same with the built-in one, but the function differs)

## Before Installation
1. Make sure backups any customization done in Alfresco.
2. Any customization done directly to "tomcat/webapps/alfresco" and "tomcat/webapps/share" folder will be GONE because this installation required installing AMP packages that will remove those 2 folders. So make sure to backup them first, so that you can apply them later after all installation done.

## Installation

1. Install All AMP in amps folder.
2. Copy tomcat folder to tomcat folder in Alfresco installation directory (make sure no existing customization is being overwritten).
3. Upload "Data Dictionary\Watermark\uncontrolled-when-printed-rotate.png" to Alfresco Repository "Data Dictionary\Watermark" as default watermark image.

## How to use

### Download with Watermark
1. Add aspect Custom Download Watermark to any folder in Repository.
2. All documents inside will be added a watermark when downloaded.
3. Change the folder properties (the folder that being attached with the aspect) if you need more configuration.

### Download Skip Page
1. Add aspect Custom Download Skip Page to any folder in Repository.
2. The first several page of the document inside will be removed when downloaded.
3. Change the folder properties (the folder that being attached with the aspect) if you need more configuration.
