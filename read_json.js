var fs = require('fs');
var time_data_list = [];
var someone_time = [];
var max = 0;
var min = 10000000000000000;
var dur =0;
var last_dur =0;
var some_max = 0;
var num = 0;
var count = 0;

//data
var line_list=[] ;
var line_1;
var line_2;
var line_3;
var line_4;
var line_5;
var line_6;
var line_7;
var line_8;
var classify;



//conut
var path = require("path");
//console.log(path);
var file_path = path.resolve();
console.log(file_path);
var file_list = [];

//write file
var str = '';

fs.writeFileSync("./average/test_timeline.csv",',共享卷积网络,rpn网络,roi_pool OP,全连接网络,分类预测网络,bbox_回归网络,proposal_OP,预测网络时间小计\n','utf8',function(err){
    if (err) {
        //throw err;
        return;
    }
})

function find()
{
    var files = fs.readdirSync(file_path+'/time');
    files.forEach(function(item,index)
    {
        //console.log(item+'---'+index);
        var file_name = file_path+'/time/'+item;
        fs.readFile(file_name,function(err,traceEvents)
        {
            time_data_list.splice(0,time_data_list.length);
            someone_time.splice(0,someone_time.length );
            max=0;
            min =10000000000000000;
            some_max =0;
            num = 0;
            dur = 0;
            line_1=0;
            line_2=0;
            line_3=0;
            line_4=0;
            line_5=0;
            line_6=0;
            //console.log(time_data_list);
            console.log('----------one file start--------------');
            console.log(index);


            count++;

            var person = traceEvents.toString();
            person = JSON.parse(person);
            for (var j =0 ; j < person.traceEvents.length;j++ )
            {
                time_data_list.push(person.traceEvents[j].ts)
                last_dur = person.traceEvents[j].dur;

            }

            for (var j = 0; j < person.traceEvents.length; j++)
            {
            	for (var k = 0; k < person.traceEvents.length; k++) 
            	{
            		//NoOp -->conv5_3 
            		if(person.traceEvents[j].name =='Conv2D')
            		{
            			if (person.traceEvents[j].args.input0 =='conv5_3/conv5_3') 
            				{
            					if(person.traceEvents[k].name=='NoOp')
            					{
            						//line_list.push(person.traceEvents[j].ts+person.traceEvents[j].dur-person.traceEvents[k].ts);
            						// console.log(line_list);
            						// console.log('++++++++++++++++++++++')
            						line_1 = person.traceEvents[j].ts-person.traceEvents[k].ts;
            						line_2 = person.traceEvents[j].ts;
            					}
            				}
            		}
            		//conv rpn_conv/3x3 ---->proposal
            		// if (person.traceEvents[j].name == 'Conv2D')
            		//  {
            		//  	if (person.traceEvents[j].args.input0 == 'conv5_3/conv5_3')
            		//  	 {
            		//  	 	//if (person.traceEvents[k].name = 'PyFunc') 
            		//  	 	//{
            		//  	 		//line_list.push(person.traceEvents[k].ts + person.traceEvents[k].dur - person.traceEvents[j].ts);
            		//  	 		line_3 = person.traceEvents[k].ts + person.traceEvents[k].dur - person.traceEvents[j].ts;
            		//  	 	//}
            		//  	 }
            		//  }
            		 //roi_pool
            		 if (person.traceEvents[j].name == 'RoiPool') 
            		 {
            		 	//line_list.push(person.traceEvents[j].dur);
            		 	line_3 = person.traceEvents[j].ts;
            		 	line_4 = person.traceEvents[j].dur;
            		 }
            		 //Matmul
            		 if (person.traceEvents[j].name == 'MatMul')
            		  {
            		  	if (person.traceEvents[j].args.name == 'cls_score/cls_score/MatMul') 
            		  	{
            		  		//line_list.push(person.traceEvents[j].dur);
            		  		line_5 = person.traceEvents[j].ts;
            		  		classify =person.traceEvents[j].dur;
            		  	}
            		  }
            		  //Matmul (bbox_pred)
            		  if (person.traceEvents[j].name == 'MatMul') 
            		  {
            		  	if (person.traceEvents[j].args.name == 'bbox_pred/bbox_pred/MatMul')
            		  	 {
            		  	 	//line_list.push(person.traceEvents[j].dur);
            		  	 	line_6 = person.traceEvents[j].dur;
            		  	 	line_7 = person.traceEvents[j].ts;
            		  	 }
            		  }
            		  if (person.traceEvents[j].name == 'PyFunc')
            		   {
	            		   	if (person.traceEvents[j].cat =='Op') 
	            		   	{
		            		   	if (person.traceEvents[j].args.name =='PyFunc') 
		            		   	{
		            		   		line_8 = person.traceEvents[j].dur;
		            		   		line_9 = person.traceEvents[j].ts;
		            		   	}
	            		   }
            		   }
            	}
            }
            time_data_list.forEach(function(item,index)
            {
                    //console.log(item+'---'+index);
                if(item>max)
                {
                    max = item;
                }
                if(item<min)
                {
                    min = item;
                }
            })

            someone_time.forEach(function(item,index)
            {
                //console.log(item+'---'+index);
                if(item > some_max)
                {
                    some_max = item;
                }
            })

            line_10 = max - min;

            // fs.appendFileSync("./average/test_timeline.csv",'\n',function(err)
            //     {
            //         if (err) 
            //         {
            //             throw err;
            //         }
            //     })
            				//conv        //rpn网络                   roi_pool 			//全连接网络			//分类预测网络 			bbox_回归网络 			 //proposal OP
            str =index+','+line_1/1000+','+(line_3-line_2)/1000+','+line_4/1000+','+(line_5-line_3)/1000+','+classify/1000+','+(line_6)/1000+','+line_8/1000+','+line_10/1000+',';

            fs.appendFileSync("./average/test_timeline.csv",str,function(err)
                {
                    if (err) 
                    {
                        throw err;
                    }
                })

            fs.appendFileSync("./average/test_timeline.csv",'\n',function(err)
                {
                    if (err) 
                    {
                        throw err;
                    }
                })

            
            console.log('----------one file end--------------');
        })

    })//for
}
find();//查询第一页，每页的数据条数为6条
