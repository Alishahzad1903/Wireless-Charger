

var updateValue, updateValue1, updateValue2, updateValue3, updateValue4; 
var updateValue5, updateValue6, updateValue7, updateValue8, updateValue9;

window.electronAPI.handlecontroller((event, registerValues) => {
    updateValue6 = registerValues[6];
    updateValue7 = registerValues[7];
    updateValue8 = registerValues[8];
    updateValue9 = registerValues[9];

    $('#pin').animate({ width: (updateValue6+1000)/20 + '%' });
    $('#pout').animate({ width: (updateValue7+1000)/20 + '%' });
    $('#ein').animate({ width: (updateValue8+1000)/20 + '%' });
    $('#eout').animate({ width: (updateValue9+1000)/20 + '%' });
  
    
  
    $('#p1').text(Math.round(updateValue6));
    $('#p2').text(Math.round(updateValue7));
    $('#p3').text(Math.round(updateValue8));
    $('#p4').text(Math.round(updateValue9));

});


// Set the color of each column
$('#pin').css({ background: '#FFC107' });
$('#pout').css({ background: '#4caf50' });
$('#ein').css({ background: '#9C27B0' });
$('#eout').css({ background: '#00BCD4' });



    //new
  
    // Update the width of each column
    

  