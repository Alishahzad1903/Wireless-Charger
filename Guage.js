

window.electronAPI.handlecontroller((event, registerValues) => {
    
  newgauge1 = registerValues[0];
  if(gaugevoltage){
    updatevoltageChart();
  }
  else{
    createvoltageChart();
  }
  
});

var gaugevoltage;
var ctx = document.getElementById('gaugeChart').getContext('2d');
createvoltageChart();

function createvoltageChart() {
  var data = {
      datasets: [{ 
          data: [0, 100-0],
          backgroundColor: ['#FF5733','#d6d4d0'],
          borderWidth: 0
      }]
  };
  var voltageoptions={
        aspectRatio: 1.5,
          rotation: 270,
          circumference: 180,
          responsive: true,
          maintainAspectRatio: false,  //Add this line to make the chart responsive
          borderWidth: 1,
          cutout: '85%',
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
          layout: {
            padding: {
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            },
          },

  }

  var guaguecharttext={
      id:'guaguecharttext',
      afterDatasetsDraw(chart,args,pluginOptions){
          const{ctx,data,chartArea:{top,bottom,left,right,width,height},scales:{r}}=chart;
          ctx.save();
          const X=chart.getDatasetMeta(0).data[0].x;
          const Y=chart.getDatasetMeta(0).data[0].y;

          ctx.beginPath();
          ctx.moveTo(X, top);
          ctx.lineTo(X, top+30);
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.stroke();
          
          ctx.font='15px MyCustomFont2';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.textBaseLine='bottom';
          ctx.textAlign='left';
          ctx.fillText('-1000',left+0.05*width,Y+15);
          ctx.textAlign='right';
          ctx.fillText('1000',right-0.07*width,Y+15);

          ctx.font='35px MyCustomFont2';
          ctx.textAlign='center';
          ctx.textBaseLine='top';
          const score=data.datasets[0].data[0];
          ctx.fillStyle = 'rgba(255, 255, 255, 1)';
          ctx.fillText(score,X,Y-0.3*height);


          ctx.font='20px MyCustomFont2';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.fillText('Var 1',X,Y)
          ctx.textAlign='center';

      }
  }
  gaugevoltage=new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: voltageoptions,
      plugins:[guaguecharttext]
  });


}

function updatevoltageChart() {
  gaugevoltage.data.datasets[0].data = [newgauge1, 100 - newgauge1];
  gaugevoltage.update();
}
