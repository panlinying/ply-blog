//checkbox 单选和多选
/* checkbox */
    var headChecked =false;
    var Select_One = function(i,checked_id){
        i.checked = !i.checked;
        if(i.checked){
            checked_id.push(i.id);
         }
         else if(!i.checked){
             //var headChecked =false;
             checked_id.splice($.inArray(i.id,checked_id),1);     
         }   
    };
    var Select_All = function(list,checked_id,headChecked){
        if(headChecked){
            angular.forEach(list, function(i){
                if(!i.checked){
                    i.checked = true;
                    checked_id.push(i.id);
                }    
            });
        }
        else if(!headChecked){
            angular.forEach(list, function(i){
                i.checked = false;
            });
            checked_id.splice(0,checked_id.length);
        }    
    };
    var new_Window = function(checked_id){
        if(checked_id.length === 0){
            $.msg_bre({ content:'未选择订单' });        
        }
        else{
            window.open('#/orders_statistics'+'/'+checked_id);
            //checked_id.splice(0,checked_id.length);
        }
    }; 
