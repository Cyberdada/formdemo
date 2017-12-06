# Formdemo

This is a demoproject that tries to illustrate how to build complex frankenforms with the 
help of angular reactive forms. 


The project also makes use of Angular Material, and shows how to do client side 
image manipulation before posting image to server


There are three components: 
-Imagebox
-GroupToggler
-Parameters

### Imagebox 
Imagebox lets you upload an image to the client, and select what part of the image you want to uppload. 


### Imagebox API

**INPUT**

**emptyImage**: The image to show if now image is selected. The component has a built in default image it shows if no image is selected. Used for overriding the default image. 
**width**: the width of the image. The width of the component is approx: width + 55px

**height**: the height of the image. The height of the component is approx: height + 6px; 

**resImageType** 'image/jpeg' or 'image/png' defaults to image/jpeg 
there is no error check on if you give it the right value

**resQuality**: only used if image is set to jpeg, defaults to 0.82


**OUTPUT** 

**originSize** : the original size of the image you are trying to upload. 
{width, height}

**position**: the position of x and y (if you move the image by mose or keyboard.)

Image can be moved within in the given frame with keyboard arrows and with the mouse. 
The image can also be scaled, either with the slider, or with 
the mousewheel


### Grouptoggler
Grouptoggler is control that can be used for dialogs involving 1:M scenarios. 
Example : User is part of 100 projects, in the 100 projects he has different roles. 
With the grouptoggler you can easily list all projects and make end user "toggle" between the
different user rights. 

### Grouptoggler API

**INPUT** 

**toggleValues**: An array of objects that use the namevalue interface (name:string, value:string) 
these are the values that the end user can choose between (ex, none, editor, admin) 
It defaults to :  

[{name: 'None', value: 0 }, {name: 'Editor', value: 1 }, {name: 'Admin', value: 2 } ];


**width**: The total width of the control. If set to -1 width will be calculated with the following formula:  
Width of all fields before buttons + DEFAULT_HEAD_LEFTMARGIN (16px) + (DEFAULT_TOGGLEBUTTON_LENGTH (80) * Nr of togglebuttons)  default value of width is -1

**rowsHeight** : The height of the rows. Defaults to 300. If more rows then height, then a scrollbar will be shown. 

**headers** : The headers to show on top of the control, defaults to  

[{name: 'Name', width: 140} , {name: 'Role', width: 0}];  

Note that width is used to set the with for each column except for the last one, 
because the last column contains the togglebuttons, 
but the width number there is used when calculating the total width of the control, so if you want to offset that, 
you can set the last width to something else than 0 (should be 0 though :) ) 

**fields** : The fields to show for each item , defaults to ["Name"]
value: ToogleItems - All the items to be shown in the list. (The value given to the control)
Items must use this interface: 

id,  (the id of the row) 

role,  (the role (which of the toogle values this object has)) 

extId - ( the Id of the object that this object has the relation specified in role )


Items should also include the properties specified in the fields. 



### Parameters 
Parameters is an array of parameters. Its currently the least developed component.  
just run the application, and you will be able to figure them out. 


The initial decision to use material can be a bit of a double edged sword, as the project using these components, might not want to use material. Im thinking of building an 'unmaterial' version of the components, but that will be in a later stage. 
