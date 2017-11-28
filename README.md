# Formdemo

This is a demoproject that tries to illustrate how to build complex frankenforms with the 
help of angular reactive forms. 


The project also makes use of Angular Material, and shows how to do client side 
image manipulation before posting image to server


There are three components: 
Imagebox
GroupToggler
Parameters

Imagebox API

INPUT

emptyImage: The image to show if now image is selected. The component has a built in default image it shows if no image is selected. Used for overriding the default image. 
width: the width of the image. The width of the component is approx: width + 55px
height: the height of the image. The height of the component is approx: height + 6px; 

resImageType 'image/jpeg' or 'image/png' defaults to image/jpeg 
there is no error check on if you give it the right value

resQuality: only used if image is set to jpeg, defaults to 0.82


OUTPUT 
originSize : the original size of the image you are trying to upload. 
{width, height}
position: the position of x and y (if you move the image by mose or keyboard.)

Image can be moved within in the given frame with keyboard arrows and with the mouse. 
The image can also be scaled, either with the slider, or with 
the mousewheel

The other controls are pretty self explanatory, 
just run the application, and you will be able to figure them out. 
