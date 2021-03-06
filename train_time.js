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
var proposal_op;
var anchor_target_op;
var proposal_target_op;
var loss_start;
var backprop;
var applymomentum;
var no_op;



//conut
var path = require("path");
//console.log(path);
var file_path = path.resolve();
console.log(file_path);
var file_list = [];

//write file
var str = '';

fs.writeFileSync("./average/train_timeline.csv",',共享卷积网络,rpn网络,roi_pool OP,全连接网络,分类预测网络,bbox_回归网络,anchor_target_OP,proposal_OP,proposal_target_OP,网络评价函数LOSS,反向传播,预测网络时间小计\n','utf8',function(err){
    if (err) {
        //throw err;
        return;
    }
})

function find()
{
    var files = fs.readdirSync(file_path+'/train_timeline');
    files.forEach(function(item,index)
    {
        console.log(item+'---'+index);
        var file_name = file_path+'/train_timeline/'+item;
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
            line_7=0;
            line_8=0;
            proposal_op=0;
            anchor_target_op=0;
            proposal_target_op=0;
            loss_start=0;
            backprop=0;
            applymomentum=0;

            console.log(time_data_list);
            console.log('----------one file start--------------');

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

                if (person.traceEvents[j].name =='NoOp') 
                {
                    no_op = person.traceEvents[j].ts 
                }
            		//NoOp -->conv5_3 
            		if(person.traceEvents[j].name =='Conv2D')
            		{
            			if (person.traceEvents[j].args.input0 =='conv5_3/conv5_3') 
            				{
            						line_1 = person.traceEvents[j].ts;
            						line_2 = person.traceEvents[j].ts;
            				}
            		}
            		 //roi_pool
            		 if (person.traceEvents[j].name == 'RoiPool') 
            		 {
            		 	line_3 = person.traceEvents[j].ts;
            		 	line_4 = person.traceEvents[j].dur;
            		 }
            		 //Matmul
            		 if (person.traceEvents[j].name == 'MatMul')
            		  {
            		  	if (person.traceEvents[j].args.name == 'cls_score/cls_score/MatMul') 
            		  	{
            		  		line_5 = person.traceEvents[j].ts;
                            line_class = person.traceEvents[j].dur;
            		  	}
            		  }
                    //classify_start
                    // if (person.traceEvents[j].name =='BiasAdd')
                    //  {
                    //     if (person.traceEvents[j].cat=='Op') 
                    //     {
                    //         if (person.traceEvents[j].args.input0 =='cls_score/cls_score/MatMul')
                    //          {
                    //             line_class = person.traceEvents[j].ts;
                    //          }
                    //     }
                    //  }


            		  //Matmul (bbox_pred)
            		  if (person.traceEvents[j].name == 'MatMul') 
            		  {
            		  	if (person.traceEvents[j].args.name == 'bbox_pred/bbox_pred/MatMul')
            		  	 {
            		  	 	line_6 = person.traceEvents[j].dur;
            		  	 	line_7 = person.traceEvents[j].ts;
            		  	 }
            		  }
                      //proposal_OP
            		  if (person.traceEvents[j].name == 'PyFunc')
            		   {

                        if (person.traceEvents[j].cat=='Op') 
                        {
                            //console.log(person.traceEvents[j].name);
                            if (person.traceEvents[j].args.input0 == 'rpn_cls_prob_reshape' ) 
                            {
                                proposal_op = person.traceEvents[j].dur;
                                line_9 = person.traceEvents[j].ts;
                            }
                        }

            		   }
                       //anchor_target_OP
                       if (person.traceEvents[j].name =='PyFunc') 
                       {
                        if (person.traceEvents[j].cat=='Op') 
                        {
                            if (person.traceEvents[j].args.input0 == 'rpn_cls_score/rpn_cls_score') 
                            {
                                anchor_target_op = person.traceEvents[j].dur;
                            }
                        }
                       }
                       //proposal_target_op
                       if (person.traceEvents[j].name == 'PyFunc')
                        {
                            if (person.traceEvents[j].cat=='Op') 
                            {
                                if (person.traceEvents[j].args.name == 'roi-data/PyFunc') 
                                {
                                    if (person.traceEvents[j].args.input0 == 'rpn_rois')
                                    {
                                        proposal_target_op = person.traceEvents[j].dur;
                                    }
                                }
                            }
                        }
                        //网络评价函数LOSS
                        if (person.traceEvents[j].name=='SparseSoftmaxCrossEntropyWithLogits') 
                        {
                            if (person.traceEvents[j].args.name =='SparseSoftmaxCrossEntropyWithLogits_1/SparseSoftmaxCrossEntropyWithLogits') 
                            {
                                loss_start = person.traceEvents[j].ts;
                                console.log('---------loss_start-----');
                                console.log(loss_start);
                            }
                        }

                         //反向传播
                        if (person.traceEvents[j].name =='ApplyMomentum')
                         {
                            if (person.traceEvents[j].args.name == 'Momentum/update_cls_score/biases/ApplyMomentum') 
                            {
                                applymomentum = person.traceEvents[j].ts;
                                console.log('------applymomentum--------');
                                console.log(applymomentum);
                            }
                         }


                        //反向传播
                        if (person.traceEvents[j].name == 'ApplyMomentum') 
                        {
                            if (person.traceEvents[j].args.name == 'Momentum/update_conv3_1/weights/ApplyMomentum')
                             {
                                backprop = person.traceEvents[j].ts;
                                last = person.traceEvents[j].dur;
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
                console.log(item+'---'+index);
                if(item > some_max)
                {
                    some_max = item;
                }
            })

            line_10 = max - min;

            		          //conv        //rpn网络                   roi_pool 			//全连接网络			//分类预测网络 			bbox_回归网络 		//anchor_target_op     //proposal OP      //proposal_target_OP    //网络评价函数LOSS     //反向传播       //totaltime
            str =index+','+(line_1-no_op)/1000+','+(line_3-line_2)/1000+','+line_4/1000+','+(line_5-line_3)/1000+','+(line_class)/1000+','+(line_6)/1000+','+anchor_target_op/1000+','+proposal_op/1000+','+proposal_target_op/1000+','+(applymomentum-loss_start)/1000+','+(backprop-applymomentum+last)/1000+','+line_10/1000+',';

            fs.appendFileSync("./average/train_timeline.csv",str,function(err)
                {
                    if (err) 
                    {
                        throw err;
                    }
                })

            fs.appendFileSync("./average/train_timeline.csv",'\n',function(err)
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
